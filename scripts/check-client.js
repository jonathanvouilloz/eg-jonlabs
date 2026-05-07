#!/usr/bin/env node
/**
 * Validates a prospect config without starting the dev server.
 * Usage: npm run check-client <slug>
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const slug = process.argv[2];
if (!slug) {
	console.error('Usage: npm run check-client <slug>');
	process.exit(1);
}

const configPath = resolve(ROOT, 'static', 'clients', slug, 'config.json');

if (!existsSync(configPath)) {
	console.error(`❌ Dossier introuvable : static/clients/${slug}/`);
	console.error(`   Crée le dossier depuis le template :`);
	console.error(`   cp -r static/clients/_template static/clients/${slug}`);
	process.exit(1);
}

let raw;
try {
	raw = JSON.parse(readFileSync(configPath, 'utf-8'));
} catch {
	console.error(`❌ JSON invalide dans static/clients/${slug}/config.json`);
	console.error(`   Vérifie la syntaxe (virgules, guillemets, accolades)`);
	process.exit(1);
}

// Schema mirrors src/lib/utils/validation.ts
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

const prospectConfigSchema = z.object({
	slug: z.string().min(1),
	industry: z.enum(['paysagiste']),
	createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD requis'),

	business: z.object({
		name: z.string().min(1),
		ownerFirstName: z.string().min(1),
		ownerLastName: z.string().min(1),
		tagline: z.string().min(1),
		phone: e164Phone,
		email: z.string().email(),
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
		zones: z.array(z.string()).min(1, 'Au moins une zone requise'),
		radiusKm: z.number().positive(),
		latitude: z.number().min(-90).max(90),
		longitude: z.number().min(-180).max(180)
	}),

	branding: z.object({
		primaryColor: hexColor,
		secondaryColor: hexColor,
		accentColor: hexColor,
		fontFamily: z.enum(['Inter', 'Source Serif', 'Playfair Display', 'Raleway'])
	}),

	heroImage: z.string().min(1),
	quizVariant: z.enum(['B', 'C', 'D']),

	services: z
		.array(
			z.object({
				id: z.string().min(1),
				label: z.string().min(1),
				description: z.string().min(1),
				icon: z.string().min(1),
				image: z.string().nullable(),
				active: z.boolean(),
				pricingCategory: pricingCategorySchema.optional()
			})
		)
		.min(1, 'Au moins un service requis'),

	inspirationGallery: z
		.array(z.object({ id: z.string(), image: z.string(), label: z.string() }))
		.optional(),

	realizations: z.array(
		z.object({ before: z.string().nullable(), after: z.string(), caption: z.string() })
	),

	testimonials: z.array(
		z.object({
			name: z.string(),
			location: z.string(),
			text: z.string(),
			rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
		})
	),

	faq: z.array(z.object({ question: z.string(), answer: z.string() })),

	leadDelivery: z.object({
		recipientEmail: z.string().email(),
		ccEmails: z.array(z.string().email()),
		subjectPrefix: z.string().min(1)
	})
});

const result = prospectConfigSchema.safeParse(raw);

if (result.success) {
	const c = result.data;
	console.log(`✅ Config valide : ${c.business.name} (${c.slug})`);
	console.log(`   Services  : ${c.services.map((s) => s.label).join(', ')}`);
	console.log(`   Zones     : ${c.credibility.zones.join(', ')}`);
	console.log(`   Quiz      : variante ${c.quizVariant}`);
	console.log(`   Leads → ${c.leadDelivery.recipientEmail}`);
} else {
	console.error(`❌ Config invalide : static/clients/${slug}/config.json\n`);
	for (const err of result.error.issues) {
		const path = err.path.join('.') || '(racine)';
		console.error(`  ${path}`);
		console.error(`    → ${err.message}`);
	}
	process.exit(1);
}
