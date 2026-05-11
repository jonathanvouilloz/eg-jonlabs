/**
 * fetch-heroes.mjs
 * Télécharge les photos GMB (Google Maps) pour chaque prospect P1 sans site.
 *
 * Usage:
 *   node scripts/fetch-heroes.mjs
 *   node scripts/fetch-heroes.mjs --slug gt-paysages   # un seul prospect
 *   node scripts/fetch-heroes.mjs --dry-run             # affiche sans télécharger
 *
 * Prérequis: Node 18+ (fetch natif). Pas de dépendances supplémentaires.
 * Sortie:    static/clients/[slug]/hero.jpg (JPEG 1280×720)
 *
 * Note: Les URLs lh3.googleusercontent.com sont stables tant que la fiche GMB existe.
 * Si une URL expire, rouvrir Google Maps et relancer collect depuis le browser (voir README).
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Config ───────────────────────────────────────────────────────────────────
const PHOTOS_JSON = join(ROOT, 'docs/prospects/hero-photos.json');
const CLIENTS_DIR = join(ROOT, 'static/clients');
const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;

// Headers pour imiter un browser — nécessaire pour lh3.googleusercontent.com
const FETCH_HEADERS = {
	'User-Agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
	Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
	'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
	Referer: 'https://www.google.com/maps/'
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function log(icon, msg) {
	console.log(`${icon} ${msg}`);
}

function buildUrl(baseUrl, width = TARGET_WIDTH, height = TARGET_HEIGHT) {
	// Remplace ou ajoute les dimensions dans l'URL Google CDN
	return baseUrl.replace(/=w\d+-h\d+-[^=]*$/, `=w${width}-h${height}-k-no`);
}

async function downloadImage(url, destPath) {
	const resp = await fetch(url, { headers: FETCH_HEADERS });

	if (!resp.ok) {
		throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
	}

	const contentType = resp.headers.get('content-type') || '';
	if (!contentType.startsWith('image/')) {
		throw new Error(`Réponse inattendue: content-type=${contentType}`);
	}

	const buffer = Buffer.from(await resp.arrayBuffer());

	if (buffer.length < 5000) {
		throw new Error(`Image trop petite (${buffer.length} bytes) — probablement bloquée`);
	}

	mkdirSync(dirname(destPath), { recursive: true });
	writeFileSync(destPath, buffer);

	return { size: buffer.length, type: contentType };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
	const args = process.argv.slice(2);
	const dryRun = args.includes('--dry-run');
	const slugFilter = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null;

	// Charger le JSON des URLs
	if (!existsSync(PHOTOS_JSON)) {
		console.error(`❌ Fichier introuvable: ${PHOTOS_JSON}`);
		process.exit(1);
	}

	const { photos } = JSON.parse(readFileSync(PHOTOS_JSON, 'utf8'));

	const entries = Object.entries(photos).filter(([slug, url]) => {
		if (slugFilter && slug !== slugFilter) return false;
		return url !== null;
	});

	const skipped = Object.entries(photos).filter(([, url]) => url === null);

	console.log(
		`\n🌿 fetch-heroes — ${entries.length} photos à télécharger, ${skipped.length} sans URL\n`
	);

	if (dryRun) {
		console.log('📋 Mode dry-run — aucun téléchargement\n');
		for (const [slug, url] of entries) {
			console.log(`  → ${slug}`);
			console.log(`     ${url}\n`);
		}
		return;
	}

	// ─── Téléchargements ────────────────────────────────────────────────────────
	const results = { ok: [], skipped: [], error: [] };

	for (const [slug, baseUrl] of entries) {
		const destPath = join(CLIENTS_DIR, slug, 'hero.jpg');

		// Skip si déjà téléchargé
		if (existsSync(destPath)) {
			log('⏭ ', `${slug} — hero.jpg déjà présent, skip`);
			results.skipped.push(slug);
			continue;
		}

		const url = buildUrl(baseUrl);
		process.stdout.write(`⬇  ${slug} … `);

		try {
			const { size } = await downloadImage(url, destPath);
			const kb = Math.round(size / 1024);
			console.log(`✅ ${kb} KB`);
			results.ok.push(slug);
		} catch (err) {
			console.log(`❌ ${err.message}`);
			results.error.push({ slug, error: err.message });
		}

		// Petit délai pour ne pas spammer Google
		await new Promise((r) => setTimeout(r, 500));
	}

	// ─── Résumé ─────────────────────────────────────────────────────────────────
	console.log('\n─────────────────────────────────────────');
	console.log(`✅ Téléchargés   : ${results.ok.length}`);
	console.log(`⏭  Déjà présents : ${results.skipped.length}`);
	console.log(`❌ Erreurs       : ${results.error.length}`);

	if (skipped.length > 0) {
		console.log(`\n⚠️  Sans photo GMB (${skipped.length}) :`);
		for (const [slug] of skipped) {
			console.log(`   - ${slug}`);
		}
	}

	if (results.error.length > 0) {
		console.log('\n🔍 Erreurs détail:');
		for (const { slug, error } of results.error) {
			console.log(`   - ${slug}: ${error}`);
		}
		console.log('\n💡 Si les URLs ont expiré, rouvrir Google Maps dans Chrome et relancer:');
		console.log('   node scripts/fetch-heroes.mjs --slug [slug-en-erreur]');
	}

	if (results.ok.length > 0) {
		console.log('\n💡 Images disponibles dans static/clients/[slug]/hero.jpg');
		console.log('   Ajouter dans config.json: "heroImage": "/clients/[slug]/hero.jpg"');
	}
}

main().catch((err) => {
	console.error('\n💥 Erreur fatale:', err);
	process.exit(1);
});
