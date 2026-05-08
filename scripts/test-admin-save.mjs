#!/usr/bin/env node
// Smoke-test admin save : modifies every editable field, POSTs to ?/save,
// reads back the JSON, reports any divergence.
// Usage: node scripts/test-admin-save.mjs http://localhost:5174 gt-paysages

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:5174';
const SLUG = process.argv[3] ?? 'gt-paysages';
const CONFIG_PATH = join(process.cwd(), 'static', 'clients', SLUG, 'config.json');

function loadConfig() {
	return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
}
function saveConfig(c) {
	writeFileSync(CONFIG_PATH, JSON.stringify(c, null, '\t') + '\n', 'utf-8');
}

function buildPayload(c) {
	const fd = new URLSearchParams();
	fd.set('businessName', c.business.name);
	fd.set('tagline', c.business.tagline);
	fd.set('ownerFirstName', c.business.ownerFirstName);
	fd.set('ownerLastName', c.business.ownerLastName);
	fd.set('phone', c.business.phone);
	fd.set('email', c.business.email);
	fd.set('address', c.business.address ?? '');
	fd.set('googleProfileUrl', c.business.googleProfileUrl ?? '');
	fd.set('googleMapsEmbedUrl', c.business.googleMapsEmbedUrl ?? '');
	fd.set('logoUrl', c.business.logoUrl ?? '');
	fd.set('googleReviewUrl', c.business.googleReviewUrl ?? '');
	fd.set('facebookUrl', c.business.facebookUrl ?? '');
	fd.set('instagramUrl', c.business.instagramUrl ?? '');
	fd.set('heroImage', c.heroImage);
	fd.set('quizVariant', c.quizVariant);
	fd.set('heroPrefix', c.heroPrefix ?? '');
	fd.set('heroSubline', c.heroSubline ?? '');
	fd.set('createdAt', c.createdAt);
	fd.set('yearsExperience', String(c.credibility.yearsExperience));
	fd.set('chantiersCount', c.credibility.chantiersCount ?? '');
	fd.set('googleRating', c.credibility.googleRating ?? '');
	fd.set('googleReviewsCount', c.credibility.googleReviewsCount ?? '');
	fd.set('zones', c.credibility.zones.join(', '));
	fd.set('radiusKm', String(c.credibility.radiusKm));
	fd.set('latitude', String(c.credibility.latitude));
	fd.set('longitude', String(c.credibility.longitude));
	fd.set('recipientEmail', c.leadDelivery.recipientEmail);
	fd.set('ccEmails', c.leadDelivery.ccEmails.join(', '));
	fd.set('subjectPrefix', c.leadDelivery.subjectPrefix);
	fd.set('crmStatus', c.crm?.status ?? 'a_contacter');
	fd.set('crmTier', c.crm?.tier ?? '');
	fd.set('crmWebsiteUrl', c.crm?.websiteUrl ?? '');
	fd.set('crmNotes', c.crm?.notes ?? '');
	fd.set('branding', JSON.stringify(c.branding));
	fd.set('services', JSON.stringify(c.services));
	fd.set('realizations', JSON.stringify(c.realizations));
	fd.set('testimonials', JSON.stringify(c.testimonials));
	fd.set('faq', JSON.stringify(c.faq));
	fd.set('communes', JSON.stringify(c.communes ?? []));
	fd.set('salesPage', c.salesPage ? JSON.stringify(c.salesPage) : '');
	fd.set('localMarket', c.localMarket ? JSON.stringify(c.localMarket) : '');
	fd.set('inspirationGallery', c.inspirationGallery ? JSON.stringify(c.inspirationGallery) : '');
	return fd;
}

async function postSave(payload) {
	const res = await fetch(`${BASE}/admin/${SLUG}?/save`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Origin: BASE,
			Accept: 'application/json',
			'x-sveltekit-action': 'true'
		},
		body: payload.toString()
	});
	const text = await res.text();
	let parsed;
	try {
		parsed = JSON.parse(text);
	} catch {
		parsed = { raw: text };
	}
	return { status: res.status, body: parsed };
}

// ── tests ───────────────────────────────────────────────────────
const original = loadConfig();

const tests = [
	{ label: 'business.name', mutate: (c) => (c.business.name = 'GT Paysages SMOKE'), check: (c) => c.business.name === 'GT Paysages SMOKE' },
	{ label: 'business.tagline', mutate: (c) => (c.business.tagline = 'tagline smoke 42'), check: (c) => c.business.tagline === 'tagline smoke 42' },
	{ label: 'business.ownerFirstName', mutate: (c) => (c.business.ownerFirstName = 'Jean-Luc'), check: (c) => c.business.ownerFirstName === 'Jean-Luc' },
	{ label: 'business.ownerLastName', mutate: (c) => (c.business.ownerLastName = 'Dupond'), check: (c) => c.business.ownerLastName === 'Dupond' },
	{ label: 'business.phone', mutate: (c) => (c.business.phone = '+41229876543'), check: (c) => c.business.phone === '+41229876543' },
	{ label: 'business.email', mutate: (c) => (c.business.email = 'smoke@example.ch'), check: (c) => c.business.email === 'smoke@example.ch' },
	{ label: 'business.address', mutate: (c) => (c.business.address = 'Rue Smoke 12, 1200 Genève'), check: (c) => c.business.address === 'Rue Smoke 12, 1200 Genève' },
	{ label: 'business.googleProfileUrl', mutate: (c) => (c.business.googleProfileUrl = 'https://share.google/smoke'), check: (c) => c.business.googleProfileUrl === 'https://share.google/smoke' },
	{ label: 'business.googleMapsEmbedUrl', mutate: (c) => (c.business.googleMapsEmbedUrl = 'https://maps.google.com/smoke'), check: (c) => c.business.googleMapsEmbedUrl === 'https://maps.google.com/smoke' },
	{ label: 'business.logoUrl', mutate: (c) => (c.business.logoUrl = '/clients/gt-paysages/smoke.png'), check: (c) => c.business.logoUrl === '/clients/gt-paysages/smoke.png' },
	{ label: 'business.googleReviewUrl', mutate: (c) => (c.business.googleReviewUrl = 'https://g.page/smoke/review'), check: (c) => c.business.googleReviewUrl === 'https://g.page/smoke/review' },
	{ label: 'business.facebookUrl', mutate: (c) => (c.business.facebookUrl = 'https://fb.com/smoke'), check: (c) => c.business.facebookUrl === 'https://fb.com/smoke' },
	{ label: 'business.instagramUrl', mutate: (c) => (c.business.instagramUrl = 'https://ig.com/smoke'), check: (c) => c.business.instagramUrl === 'https://ig.com/smoke' },
	{ label: 'heroImage', mutate: (c) => (c.heroImage = '/clients/gt-paysages/smoke.jpg'), check: (c) => c.heroImage === '/clients/gt-paysages/smoke.jpg' },
	{ label: 'quizVariant', mutate: (c) => (c.quizVariant = 'C'), check: (c) => c.quizVariant === 'C' },
	{ label: 'heroPrefix', mutate: (c) => (c.heroPrefix = 'sur'), check: (c) => c.heroPrefix === 'sur' },
	{ label: 'heroSubline', mutate: (c) => (c.heroSubline = 'subline smoke'), check: (c) => c.heroSubline === 'subline smoke' },
	{ label: 'credibility.yearsExperience', mutate: (c) => (c.credibility.yearsExperience = 17), check: (c) => c.credibility.yearsExperience === 17 },
	{ label: 'credibility.chantiersCount', mutate: (c) => (c.credibility.chantiersCount = 234), check: (c) => c.credibility.chantiersCount === 234 },
	{ label: 'credibility.googleRating', mutate: (c) => (c.credibility.googleRating = 4.7), check: (c) => c.credibility.googleRating === 4.7 },
	{ label: 'credibility.googleReviewsCount', mutate: (c) => (c.credibility.googleReviewsCount = 89), check: (c) => c.credibility.googleReviewsCount === 89 },
	{ label: 'credibility.zones', mutate: (c) => (c.credibility.zones = ['Genève', 'Vernier']), check: (c) => Array.isArray(c.credibility.zones) && c.credibility.zones.join('|') === 'Genève|Vernier' },
	{ label: 'credibility.radiusKm', mutate: (c) => (c.credibility.radiusKm = 33), check: (c) => c.credibility.radiusKm === 33 },
	{ label: 'credibility.latitude', mutate: (c) => (c.credibility.latitude = 46.5), check: (c) => c.credibility.latitude === 46.5 },
	{ label: 'credibility.longitude', mutate: (c) => (c.credibility.longitude = 6.5), check: (c) => c.credibility.longitude === 6.5 },
	{ label: 'leadDelivery.recipientEmail', mutate: (c) => (c.leadDelivery.recipientEmail = 'lead@smoke.ch'), check: (c) => c.leadDelivery.recipientEmail === 'lead@smoke.ch' },
	{ label: 'leadDelivery.ccEmails', mutate: (c) => (c.leadDelivery.ccEmails = ['cc1@smoke.ch', 'cc2@smoke.ch']), check: (c) => c.leadDelivery.ccEmails.join('|') === 'cc1@smoke.ch|cc2@smoke.ch' },
	{ label: 'leadDelivery.subjectPrefix', mutate: (c) => (c.leadDelivery.subjectPrefix = '[SMOKE]'), check: (c) => c.leadDelivery.subjectPrefix === '[SMOKE]' },
	{ label: 'crm.status', mutate: (c) => ((c.crm = c.crm ?? {}).status = 'signe'), check: (c) => c.crm?.status === 'signe' },
	{ label: 'crm.tier', mutate: (c) => ((c.crm = c.crm ?? {}).tier = 'B'), check: (c) => c.crm?.tier === 'B' },
	{ label: 'crm.websiteUrl', mutate: (c) => ((c.crm = c.crm ?? {}).websiteUrl = 'https://smoke.example/'), check: (c) => c.crm?.websiteUrl === 'https://smoke.example/' },
	{ label: 'crm.notes', mutate: (c) => ((c.crm = c.crm ?? {}).notes = 'notes smoke 12345'), check: (c) => c.crm?.notes === 'notes smoke 12345' },
	{ label: 'branding (color tweak)', mutate: (c) => (c.branding.primaryColor = '#ABCDEF'), check: (c) => c.branding.primaryColor.toUpperCase() === '#ABCDEF' },
	{ label: 'services (count change)', mutate: (c) => (c.services = c.services.slice(0, 1)), check: (c) => c.services.length === 1 },
	{ label: 'realizations (push)', mutate: (c) => (c.realizations = [{ before: null, after: 'https://x/y.jpg', caption: 'smoke' }]), check: (c) => c.realizations.length === 1 && c.realizations[0].caption === 'smoke' },
	{ label: 'testimonials (push)', mutate: (c) => (c.testimonials = [{ name: 'Smoke', location: 'Genève', text: 'top', rating: 5 }]), check: (c) => c.testimonials[0]?.name === 'Smoke' },
	{ label: 'faq (push)', mutate: (c) => (c.faq = [{ question: 'q smoke ?', answer: 'a smoke.' }]), check: (c) => c.faq[0]?.question === 'q smoke ?' },
	{ label: 'communes', mutate: (c) => (c.communes = ['SmokeVille']), check: (c) => c.communes?.[0] === 'SmokeVille' }
];

const results = [];
let baseline = original;

for (const t of tests) {
	const next = JSON.parse(JSON.stringify(baseline));
	t.mutate(next);
	const payload = buildPayload(next);
	const res = await postSave(payload);
	const after = loadConfig();
	const ok = res.status === 200 && t.check(after);
	results.push({ label: t.label, status: res.status, ok, body: res.body });
	if (!ok) {
		console.log(`✗ ${t.label} → HTTP ${res.status} ${ok ? 'check ok' : 'check FAIL'}`);
		if (res.body?.data) console.log('  body:', res.body.data);
	} else {
		console.log(`✓ ${t.label}`);
	}
	baseline = after; // accumulate
}

// restore original
const payload = buildPayload(original);
await postSave(payload);
console.log('\n— restored to original —');

const failed = results.filter((r) => !r.ok);
console.log(`\nResult: ${results.length - failed.length}/${results.length} OK`);
if (failed.length) {
	console.log('Failed:', failed.map((f) => f.label).join(', '));
	process.exit(1);
}
