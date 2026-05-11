/**
 * generate-screenshots.mjs
 * Génère les captures d'écran du hero `/site/[slug]` pour chaque prospect EG.
 *
 * Usage:
 *   node scripts/generate-screenshots.mjs                # tous les prospects
 *   node scripts/generate-screenshots.mjs --slug gt-paysages
 *   node scripts/generate-screenshots.mjs --force        # écrase les PNG existants
 *   node scripts/generate-screenshots.mjs --port 5174    # port Vite custom
 *   node scripts/generate-screenshots.mjs --keep-server  # ne tue pas le dev server à la fin
 *
 * Prérequis :
 *   - playwright + chromium installés (npm install -D playwright && npx playwright install chromium)
 *   - aucun dev server déjà actif sur le port choisi (le script en démarre un)
 *
 * Sortie : static/screenshots/[slug].png (1440×900, viewport top fold)
 */

import { spawn } from 'child_process';
import { readdirSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Config ───────────────────────────────────────────────────────────────────
const CLIENTS_DIR = join(ROOT, 'static/clients');
const OUTPUT_DIR = join(ROOT, 'static/screenshots');
const VIEWPORT = { width: 1440, height: 900 };
const READY_TIMEOUT_MS = 30_000;
const PAGE_TIMEOUT_MS = 20_000;

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getFlag(name) {
	const idx = args.indexOf(`--${name}`);
	if (idx === -1) return null;
	const next = args[idx + 1];
	return next && !next.startsWith('--') ? next : true;
}

const onlySlug = getFlag('slug');
const force = !!getFlag('force');
const port = Number(getFlag('port')) || 5173;
const keepServer = !!getFlag('keep-server');
const dryRun = !!getFlag('dry-run');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function log(icon, msg) {
	console.log(`${icon} ${msg}`);
}

function listProspects() {
	const slugs = [];
	for (const entry of readdirSync(CLIENTS_DIR, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		if (entry.name.startsWith('_')) continue;
		const configPath = join(CLIENTS_DIR, entry.name, 'config.json');
		if (!existsSync(configPath)) continue;

		let config;
		try {
			config = JSON.parse(readFileSync(configPath, 'utf-8'));
		} catch {
			log('⚠️', `${entry.name}: config.json invalide, skip`);
			continue;
		}

		const screenshotUrl = config?.salesPage?.screenshotUrl;
		if (!screenshotUrl) continue;

		slugs.push(entry.name);
	}
	return slugs;
}

// eslint-disable-next-line no-control-regex
const ANSI_RE = /\x1b\[[0-9;]*m/g;

function startDevServer() {
	return new Promise((resolve, reject) => {
		log('🚀', `Démarrage du dev server (port ${port})...`);
		const child = spawn('npm', ['run', 'dev', '--', '--port', String(port)], {
			cwd: ROOT,
			stdio: ['ignore', 'pipe', 'pipe'],
			env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
			shell: process.platform === 'win32'
		});

		let resolved = false;
		const timer = setTimeout(() => {
			if (!resolved) {
				resolved = true;
				reject(new Error(`Dev server n'a pas répondu après ${READY_TIMEOUT_MS}ms`));
			}
		}, READY_TIMEOUT_MS);

		const onChunk = (chunk) => {
			const raw = chunk.toString();
			if (process.env.DEBUG_DEV) process.stdout.write(raw);
			const text = raw.replace(ANSI_RE, '');
			const match = text.match(/Local:\s+http:\/\/localhost:(\d+)/);
			if (!resolved && match) {
				resolved = true;
				clearTimeout(timer);
				const actualPort = Number(match[1]);
				if (actualPort !== port) {
					log('ℹ️', `Port ${port} occupé, Vite utilise ${actualPort}`);
				}
				log('✅', `Dev server prêt sur http://localhost:${actualPort}`);
				resolve({ child, port: actualPort });
			}
		};

		child.stdout.on('data', onChunk);
		child.stderr.on('data', onChunk);
		child.on('error', (err) => {
			if (!resolved) {
				resolved = true;
				clearTimeout(timer);
				reject(err);
			}
		});
		child.on('exit', (code) => {
			if (!resolved) {
				resolved = true;
				clearTimeout(timer);
				reject(new Error(`Dev server a quitté prématurément (code ${code})`));
			}
		});
	});
}

function killDevServer(child) {
	if (!child || child.killed) return;
	if (process.platform === 'win32') {
		spawn('taskkill', ['/pid', String(child.pid), '/f', '/t']);
	} else {
		child.kill('SIGTERM');
	}
}

async function screenshotProspect(page, slug, activePort) {
	const url = `http://localhost:${activePort}/atelier/${slug}`;
	const outPath = join(OUTPUT_DIR, `${slug}.png`);

	if (!force && existsSync(outPath)) {
		log('⏭️', `${slug}: déjà présent (--force pour écraser)`);
		return { slug, status: 'skipped' };
	}

	try {
		await page.goto(url, { waitUntil: 'networkidle', timeout: PAGE_TIMEOUT_MS });
		// Petit délai pour les animations fadeInUp / lazy images au-dessus du fold
		await page.waitForTimeout(500);
		await page.screenshot({ path: outPath, fullPage: false });
		log('📸', `${slug} → static/screenshots/${slug}.png`);
		return { slug, status: 'ok' };
	} catch (err) {
		log('❌', `${slug}: ${err.message}`);
		return { slug, status: 'error', error: err.message };
	}
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
	if (!existsSync(OUTPUT_DIR)) {
		mkdirSync(OUTPUT_DIR, { recursive: true });
		log('📁', `Création de static/screenshots/`);
	}

	let prospects = listProspects();
	if (onlySlug && onlySlug !== true) {
		prospects = prospects.filter((s) => s === onlySlug);
		if (prospects.length === 0) {
			log('❌', `Aucun prospect "${onlySlug}" avec salesPage.screenshotUrl trouvé`);
			process.exit(1);
		}
	}

	log('📋', `${prospects.length} prospect(s) à traiter`);
	if (dryRun) {
		prospects.forEach((s) => log('  •', s));
		log('🏁', 'Dry run terminé');
		return;
	}

	const { child: server, port: activePort } = await startDevServer();
	const browser = await chromium.launch();
	const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
	const page = await context.newPage();

	const results = [];
	try {
		for (const slug of prospects) {
			results.push(await screenshotProspect(page, slug, activePort));
		}
	} finally {
		await browser.close();
		if (!keepServer) killDevServer(server);
	}

	const ok = results.filter((r) => r.status === 'ok').length;
	const skipped = results.filter((r) => r.status === 'skipped').length;
	const errors = results.filter((r) => r.status === 'error');

	console.log('');
	log('✅', `${ok} générée(s) • ${skipped} skippée(s) • ${errors.length} erreur(s)`);
	if (errors.length) {
		errors.forEach((e) => log('  ❌', `${e.slug}: ${e.error}`));
		process.exit(1);
	}
}

main().catch((err) => {
	console.error('💥', err);
	process.exit(1);
});
