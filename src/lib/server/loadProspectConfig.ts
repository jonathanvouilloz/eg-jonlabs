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

// Vite bundles these JSONs into the server function — works on Vercel (readFileSync doesn't).
const clientConfigs = import.meta.glob('/static/clients/*/config.json', { eager: true });

export function loadProspectConfig(slug: string): LoadResult | LoadError {
	const key = `/static/clients/${slug}/config.json`;
	const module = clientConfigs[key] as { default?: unknown } | undefined;

	if (!module) {
		return { ok: false, reason: 'not_found' };
	}

	const json = module.default ?? module;

	const parsed = prospectConfigSchema.safeParse(json);
	if (!parsed.success) {
		return { ok: false, reason: 'invalid_schema', detail: parsed.error.message };
	}

	return { ok: true, config: parsed.data as ProspectConfig };
}
