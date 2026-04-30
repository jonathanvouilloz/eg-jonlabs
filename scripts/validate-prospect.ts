/**
 * Standalone Zod validator for static/clients/[slug]/config.json.
 * Used by the paysagiste-audit skill to verify a generated prospect config
 * matches the schema before deploying.
 *
 * Usage: npx tsx scripts/validate-prospect.ts <slug>
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { prospectConfigSchema } from '../src/lib/utils/validation.ts';

const slug = process.argv[2];
if (!slug) {
	console.error('Usage: npx tsx scripts/validate-prospect.ts <slug>');
	process.exit(2);
}

const path = resolve(process.cwd(), 'static', 'clients', slug, 'config.json');

let raw: string;
try {
	raw = readFileSync(path, 'utf-8');
} catch {
	console.error(`✗ Config not found: ${path}`);
	process.exit(2);
}

let json: unknown;
try {
	json = JSON.parse(raw);
} catch (e) {
	console.error(`✗ Invalid JSON: ${(e as Error).message}`);
	process.exit(1);
}

const parsed = prospectConfigSchema.safeParse(json);
if (!parsed.success) {
	console.error('✗ Zod validation failed:');
	for (const issue of parsed.error.issues) {
		console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
	}
	process.exit(1);
}

console.log(`✓ Zod valide : ${slug}`);
process.exit(0);
