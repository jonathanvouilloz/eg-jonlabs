import { readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENTS_DIR = join(__dirname, '..', 'static', 'clients');

const GE_COMMUNES = new Set(
	[
		'Genève',
		'Carouge',
		'Plan-les-Ouates',
		'Lancy',
		'Vernier',
		'Meyrin',
		'Onex',
		'Thônex',
		'Thonex',
		'Chêne-Bourg',
		'Chêne-Bougeries',
		'Versoix',
		'Veyrier',
		'Bernex',
		'Troinex',
		'Choulex',
		'Vandoeuvres',
		'Châtelaine',
		'Collonge-Bellerive',
		'Puplinge',
		'Présinge',
		'Jussy',
		'Anières',
		'Avully',
		'Hermance',
		'Soral',
		'Bardonnex',
		'Confignon',
		'Cologny',
		'Pregny-Chambésy',
		'Genthod',
		'Grand-Saconnex'
	].map((s) => s.toLowerCase())
);

const matches = [];
for (const slug of readdirSync(CLIENTS_DIR)) {
	const path = join(CLIENTS_DIR, slug, 'config.json');
	let config;
	try {
		config = JSON.parse(readFileSync(path, 'utf-8'));
	} catch {
		continue;
	}
	const tier = config.crm?.tier;
	const mainZone = (config.credibility?.zones?.[0] ?? '').toLowerCase();
	const inGE = GE_COMMUNES.has(mainZone) || mainZone.includes('genève') || mainZone.includes('geneve');
	if (tier === 'S' && inGE) {
		matches.push({ slug, zone: config.credibility.zones[0], name: config.business.name });
	}
}

console.log(`${matches.length} prospect(s) tier S en canton Genève :\n`);
matches.forEach((m) => console.log(`  • ${m.slug.padEnd(28)} | ${m.zone.padEnd(20)} | ${m.name}`));
console.log('\nSlugs CSV : ' + matches.map((m) => m.slug).join(','));
