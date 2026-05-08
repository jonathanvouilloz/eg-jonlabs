#!/usr/bin/env node
/**
 * Validates a prospect config without starting the dev server.
 * Schema mirrors src/lib/utils/validation.ts (the runtime Zod schema).
 *
 * Usage:
 *   npm run check-client <slug>
 *   npm run check-client --all   # valide tous les prospects
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CLIENTS_DIR = resolve(ROOT, 'static', 'clients');
const SKIP_DIRS = new Set(['_template']);

const slug = process.argv[2];
if (!slug) {
	console.error('Usage: npm run check-client <slug>');
	console.error('       npm run check-client --all');
	process.exit(1);
}

// ── Schema (copie de src/lib/utils/validation.ts) ───────────────────────────
const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Hex attendu : #RRGGBB');
const e164Phone = z.string().regex(/^\+\d{10,15}$/, 'Format E.164 requis : +41XXXXXXXXX');

const pricingCategorySchema = z.enum([
	'tonte',
	'creation_jardin',
	'amenagement_complet',
	'taille_haies',
	'elagage',
	'terrasse_dalle',
	'terrasse_bois',
	'gazon_rouleau',
	'entretien_annuel',
	'plantation',
	'horaire_simple'
]);

const prospectServiceSchema = z.object({
	id: z.string(),
	label: z.string(),
	description: z.string(),
	icon: z.string(),
	iconName: z.string().optional(),
	image: z.string().nullable(),
	active: z.boolean(),
	pricingCategory: pricingCategorySchema.optional()
});

const inspirationItemSchema = z.object({
	id: z.string(),
	image: z.string(),
	label: z.string()
});

const realizationSchema = z.object({
	before: z.string().nullable(),
	after: z.string(),
	caption: z.string()
});

const testimonialSchema = z.object({
	name: z.string(),
	location: z.string(),
	text: z.string(),
	rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
});

const faqItemSchema = z.object({
	question: z.string(),
	answer: z.string()
});

const prospectConfigSchema = z.object({
	slug: z.string(),
	industry: z.enum(['paysagiste']),
	createdAt: z.string(),

	business: z.object({
		name: z.string(),
		ownerFirstName: z.string(),
		ownerLastName: z.string(),
		tagline: z.string(),
		phone: e164Phone,
		email: z.string().email(),
		address: z.string().nullable().optional(),
		googleProfileUrl: z.string().nullable().optional(),
		googleMapsEmbedUrl: z.string().nullable().optional(),
		logoUrl: z.string().nullable(),
		googleReviewUrl: z.string().nullable(),
		facebookUrl: z.string().nullable(),
		instagramUrl: z.string().nullable()
	}),

	credibility: z.object({
		yearsExperience: z.number().int().positive(),
		chantiersCount: z.number().int().positive().nullable(),
		googleRating: z.number().min(0).max(5).nullable(),
		googleReviewsCount: z.number().int().nonnegative().nullable(),
		zones: z.array(z.string()).min(1),
		radiusKm: z.number().positive(),
		latitude: z.number().min(-90).max(90),
		longitude: z.number().min(-180).max(180)
	}),

	branding: z.object({
		primaryColor: hexColor,
		secondaryColor: hexColor,
		accentColor: hexColor,
		fontFamily: z.enum([
			'Inter',
			'Source Serif',
			'Playfair Display',
			'Raleway',
			'Bodoni Moda',
			'Plus Jakarta Sans'
		])
	}),

	heroImage: z.string(),
	quizVariant: z.enum(['B', 'C', 'D']),
	services: z.array(prospectServiceSchema).min(1),
	inspirationGallery: z.array(inspirationItemSchema).optional(),
	realizations: z.array(realizationSchema),
	testimonials: z.array(testimonialSchema),
	faq: z.array(faqItemSchema),

	leadDelivery: z.object({
		recipientEmail: z.string().email(),
		ccEmails: z.array(z.string().email()),
		subjectPrefix: z.string()
	}),

	salesPage: z
		.object({
			loomVideoId: z.string(),
			screenshotUrl: z.string(),
			subtitleObservation: z.string()
		})
		.optional(),

	localMarket: z
		.object({
			monthlySearches: z.number().int().nonnegative(),
			topThreeCaptureRate: z.number().min(0).max(1)
		})
		.optional(),

	communes: z.array(z.string()).optional(),
	heroPrefix: z.string().optional(),
	heroSubline: z.string().optional(),

	crm: z
		.object({
			websiteUrl: z.string().nullable(),
			status: z.enum(['a_contacter', 'contacte', 'repondu', 'signe', 'pas_interesse']),
			tier: z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']).nullable(),
			notes: z.string()
		})
		.optional()
});

// ── Validation d'un slug ────────────────────────────────────────────────────
function validateSlug(slug) {
	const configPath = resolve(CLIENTS_DIR, slug, 'config.json');

	if (!existsSync(configPath)) {
		return {
			slug,
			ok: false,
			fatal: `Dossier introuvable : static/clients/${slug}/`
		};
	}

	let raw;
	try {
		raw = JSON.parse(readFileSync(configPath, 'utf-8'));
	} catch {
		return { slug, ok: false, fatal: `JSON invalide` };
	}

	const result = prospectConfigSchema.safeParse(raw);

	if (result.success) {
		// Warnings non-bloquants : champs vides qui devraient être remplis
		const warnings = [];
		const c = result.data;
		if (!c.business.ownerFirstName) warnings.push('ownerFirstName vide');
		if (!c.business.ownerLastName) warnings.push('ownerLastName vide');
		if (c.business.phone === '+41000000000') warnings.push('phone placeholder');
		if (
			c.business.email === 'leads@jonlabs.ch' &&
			c.leadDelivery.recipientEmail === 'leads@jonlabs.ch'
		) {
			warnings.push('email fallback (leads@jonlabs.ch)');
		}
		return { slug, ok: true, data: c, warnings };
	}

	return { slug, ok: false, errors: result.error.issues };
}

function printResult(r) {
	if (r.fatal) {
		console.error(`❌ ${r.slug} — ${r.fatal}`);
		return;
	}
	if (r.ok) {
		const c = r.data;
		const tag = r.warnings.length > 0 ? ` ⚠️  ${r.warnings.join(', ')}` : '';
		console.log(`✅ ${c.slug}${tag}`);
		return;
	}
	console.error(`❌ ${r.slug}`);
	for (const err of r.errors) {
		const path = err.path.join('.') || '(racine)';
		console.error(`     ${path} → ${err.message}`);
	}
}

// ── Mode all ────────────────────────────────────────────────────────────────
if (slug === '--all') {
	const slugs = readdirSync(CLIENTS_DIR)
		.filter((d) => !SKIP_DIRS.has(d))
		.filter((d) => statSync(join(CLIENTS_DIR, d)).isDirectory())
		.sort();

	console.log(`\n🌿 check-client --all — ${slugs.length} prospects\n`);

	const results = slugs.map(validateSlug);
	for (const r of results) printResult(r);

	const okCount = results.filter((r) => r.ok).length;
	const failCount = results.filter((r) => !r.ok).length;
	const warnCount = results.filter((r) => r.ok && r.warnings.length > 0).length;

	console.log(`\n─────────────────────────────────────────`);
	console.log(`✅ Valides    : ${okCount}/${slugs.length}`);
	if (warnCount > 0) console.log(`⚠️  Avec warning : ${warnCount}`);
	if (failCount > 0) console.log(`❌ Invalides   : ${failCount}`);

	process.exit(failCount > 0 ? 1 : 0);
}

// ── Mode single slug ────────────────────────────────────────────────────────
const r = validateSlug(slug);

if (r.fatal) {
	console.error(`❌ ${r.fatal}`);
	if (r.fatal.startsWith('Dossier')) {
		console.error(`   Crée le dossier depuis le template :`);
		console.error(`   cp -r static/clients/_template static/clients/${slug}`);
	}
	process.exit(1);
}

if (r.ok) {
	const c = r.data;
	console.log(`✅ Config valide : ${c.business.name} (${c.slug})`);
	console.log(`   Services  : ${c.services.map((s) => s.label).join(', ')}`);
	console.log(`   Zones     : ${c.credibility.zones.join(', ')}`);
	console.log(`   Quiz      : variante ${c.quizVariant}`);
	console.log(`   Leads → ${c.leadDelivery.recipientEmail}`);
	if (r.warnings.length > 0) {
		console.log(`\n⚠️  Warnings (non bloquants) :`);
		for (const w of r.warnings) console.log(`   - ${w}`);
	}
	process.exit(0);
}

console.error(`❌ Config invalide : static/clients/${slug}/config.json\n`);
for (const err of r.errors) {
	const path = err.path.join('.') || '(racine)';
	console.error(`  ${path}`);
	console.error(`    → ${err.message}`);
}
process.exit(1);
