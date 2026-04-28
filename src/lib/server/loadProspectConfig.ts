import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { prospectConfigSchema } from '$utils/validation';
import type { ProspectConfig } from '$types/prospect';

export interface LoadResult {
	ok: true;
	config: ProspectConfig;
}

export interface LoadError {
	ok: false;
	reason: 'not_found' | 'invalid_json' | 'invalid_schema';
	detail?: string;
}

export function loadProspectConfig(slug: string): LoadResult | LoadError {
	const configPath = resolve('static', 'clients', slug, 'config.json');

	let raw: string;
	try {
		raw = readFileSync(configPath, 'utf-8');
	} catch {
		return { ok: false, reason: 'not_found' };
	}

	let json: unknown;
	try {
		json = JSON.parse(raw);
	} catch (err) {
		return { ok: false, reason: 'invalid_json', detail: String(err) };
	}

	const parsed = prospectConfigSchema.safeParse(json);
	if (!parsed.success) {
		return { ok: false, reason: 'invalid_schema', detail: parsed.error.message };
	}

	return { ok: true, config: parsed.data };
}
