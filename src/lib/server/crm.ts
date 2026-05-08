import {
	readFileSync,
	writeFileSync,
	readdirSync,
	statSync,
	mkdirSync,
	rmSync,
	existsSync
} from 'node:fs';
import { join, resolve } from 'node:path';
import { prospectConfigSchema } from '$utils/validation';
import type { ProspectConfig, CrmStatus, CrmTier } from '$types/prospect';

const CLIENTS_DIR = resolve(process.cwd(), 'static', 'clients');
const SKIP_DIRS = new Set(['_template']);

export interface ProspectListItem {
	slug: string;
	name: string;
	canton: string | null;
	tier: CrmTier | null;
	status: CrmStatus;
	owner: string;
	phone: string;
	email: string;
	address: string | null;
	googleProfileUrl: string | null;
	websiteUrl: string | null;
	hasLogo: boolean;
	hasHero: boolean;
	hasGmb: boolean;
	hasOwner: boolean;
	hasRealEmail: boolean;
}

const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
export function isValidSlug(slug: string): boolean {
	return SLUG_REGEX.test(slug) && slug.length <= 64;
}

function listSlugs(): string[] {
	if (!existsSync(CLIENTS_DIR)) return [];
	return readdirSync(CLIENTS_DIR)
		.filter((d) => !SKIP_DIRS.has(d))
		.filter((d) => statSync(join(CLIENTS_DIR, d)).isDirectory())
		.sort();
}

function configPath(slug: string): string {
	return join(CLIENTS_DIR, slug, 'config.json');
}

function inferCanton(config: ProspectConfig): string | null {
	const addr = config.business.address ?? '';
	const match = addr.match(/\b(GE|VD|VS|FR|NE|JU|BE)\b/);
	if (match) return match[1];
	const cp = addr.match(/\b(\d{4})\b/);
	if (!cp) return null;
	const code = parseInt(cp[1], 10);
	if (code >= 1200 && code <= 1299) return 'GE';
	if (code >= 1000 && code <= 1199) return 'VD';
	if (code >= 1300 && code <= 1499) return 'VD';
	if (code >= 1700 && code <= 1799) return 'FR';
	if (code >= 1800 && code <= 1899) return 'VD';
	if (code >= 1900 && code <= 1999) return 'VS';
	if (code >= 2000 && code <= 2099) return 'NE';
	if (code >= 2300 && code <= 2399) return 'NE';
	if (code >= 2400 && code <= 2499) return 'NE';
	if (code >= 2500 && code <= 2999) return 'BE';
	return null;
}

export function listProspects(): ProspectListItem[] {
	const items: ProspectListItem[] = [];
	for (const slug of listSlugs()) {
		const result = readProspect(slug);
		if (!result.ok) continue;
		const c = result.config;
		const heroIsLocal = c.heroImage?.startsWith(`/clients/${slug}/`) ?? false;
		const owner = `${c.business.ownerFirstName} ${c.business.ownerLastName}`.trim();
		items.push({
			slug,
			name: c.business.name,
			canton: inferCanton(c),
			tier: c.crm?.tier ?? null,
			status: c.crm?.status ?? 'a_contacter',
			owner,
			phone: c.business.phone,
			email: c.business.email,
			address: c.business.address ?? null,
			googleProfileUrl: c.business.googleProfileUrl ?? null,
			websiteUrl: c.crm?.websiteUrl ?? null,
			hasLogo: !!c.business.logoUrl,
			hasHero: heroIsLocal,
			hasGmb: !!c.business.googleProfileUrl,
			hasOwner: owner.length > 0,
			hasRealEmail: c.business.email !== 'leads@jonlabs.ch'
		});
	}
	return items;
}

export type ReadResult =
	| { ok: true; config: ProspectConfig }
	| { ok: false; reason: 'not_found' | 'invalid_json' | 'invalid_schema'; detail?: string };

export function readProspect(slug: string): ReadResult {
	if (!isValidSlug(slug)) return { ok: false, reason: 'not_found' };
	const path = configPath(slug);
	if (!existsSync(path)) return { ok: false, reason: 'not_found' };
	let raw: unknown;
	try {
		raw = JSON.parse(readFileSync(path, 'utf-8'));
	} catch (err) {
		return { ok: false, reason: 'invalid_json', detail: String(err) };
	}
	const parsed = prospectConfigSchema.safeParse(raw);
	if (!parsed.success) {
		return { ok: false, reason: 'invalid_schema', detail: parsed.error.message };
	}
	return { ok: true, config: parsed.data as ProspectConfig };
}

export type WriteResult =
	| { ok: true }
	| { ok: false; reason: 'invalid_slug' | 'invalid_schema'; detail?: string };

export function writeProspect(slug: string, config: ProspectConfig): WriteResult {
	if (!isValidSlug(slug)) return { ok: false, reason: 'invalid_slug' };
	const parsed = prospectConfigSchema.safeParse({ ...config, slug });
	if (!parsed.success) {
		return { ok: false, reason: 'invalid_schema', detail: parsed.error.message };
	}
	const dir = join(CLIENTS_DIR, slug);
	mkdirSync(dir, { recursive: true });
	const json = JSON.stringify(parsed.data, null, '\t') + '\n';
	writeFileSync(configPath(slug), json, 'utf-8');
	return { ok: true };
}

export function deleteProspect(slug: string): { ok: boolean; reason?: string } {
	if (!isValidSlug(slug)) return { ok: false, reason: 'invalid_slug' };
	const dir = join(CLIENTS_DIR, slug);
	if (!existsSync(dir)) return { ok: false, reason: 'not_found' };
	rmSync(dir, { recursive: true, force: true });
	return { ok: true };
}

export function prospectExists(slug: string): boolean {
	if (!isValidSlug(slug)) return false;
	return existsSync(configPath(slug));
}
