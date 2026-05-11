/**
 * backfill-local-market.mjs
 * Met à jour `localMarket.monthlySearches` pour tous les prospects.
 *
 * Règles :
 *   - Si credibility.zones[0] === "Genève" (insensible casse/accents) → 1000
 *   - Sinon → 500
 *   - Skip _template (placeholder)
 *   - Skip demo/demo-c/demo-d (pas de localMarket dans leur config)
 *
 * Préserve l'indentation tab et l'ordre des champs via regex surgical.
 *
 * Usage: node scripts/backfill-local-market.mjs [--dry-run]
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENTS_DIR = join(__dirname, '..', 'static', 'clients');
const dryRun = process.argv.includes('--dry-run');

const GENEVE_VALUE = 1000;
const DEFAULT_VALUE = 500;
const SKIP = new Set(['_template', 'demo', 'demo-c', 'demo-d']);

function normalize(s) {
	return s
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.trim();
}

let updated = 0;
let unchanged = 0;
let skipped = 0;

for (const slug of readdirSync(CLIENTS_DIR)) {
	if (SKIP.has(slug)) {
		skipped++;
		continue;
	}
	const path = join(CLIENTS_DIR, slug, 'config.json');
	let text;
	try {
		text = readFileSync(path, 'utf-8');
	} catch {
		continue;
	}

	let config;
	try {
		config = JSON.parse(text);
	} catch {
		console.log(`⚠️  ${slug}: JSON invalide, skip`);
		continue;
	}

	if (!config.localMarket) {
		console.log(`ℹ️  ${slug}: pas de localMarket, skip`);
		skipped++;
		continue;
	}

	const mainZone = config.credibility?.zones?.[0] ?? '';
	const target = normalize(mainZone) === 'geneve' ? GENEVE_VALUE : DEFAULT_VALUE;
	const current = config.localMarket.monthlySearches;

	if (current === target) {
		unchanged++;
		continue;
	}

	// Regex surgicale : remplace la valeur de monthlySearches sans toucher le reste
	const re = /("monthlySearches"\s*:\s*)\d+/;
	if (!re.test(text)) {
		console.log(`⚠️  ${slug}: monthlySearches introuvable via regex, skip`);
		continue;
	}
	const newText = text.replace(re, `$1${target}`);

	console.log(
		`📝 ${slug.padEnd(28)} | ${mainZone.padEnd(20)} | ${String(current).padStart(4)} → ${target}`
	);

	if (!dryRun) {
		writeFileSync(path, newText, 'utf-8');
	}
	updated++;
}

console.log('');
console.log(`✅ ${updated} mis à jour • ${unchanged} déjà OK • ${skipped} skippés`);
if (dryRun) console.log('🏁 Dry run — aucun fichier écrit');
