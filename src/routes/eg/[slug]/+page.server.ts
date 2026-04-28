import { error } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { prospectConfigSchema } from '$utils/validation';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const configPath = resolve('static', 'clients', params.slug, 'config.json');

	let raw: string;
	try {
		raw = readFileSync(configPath, 'utf-8');
	} catch {
		throw error(404, `Prospect "${params.slug}" introuvable`);
	}

	let json: unknown;
	try {
		json = JSON.parse(raw);
	} catch {
		throw error(500, `Config JSON invalide pour "${params.slug}"`);
	}

	const result = prospectConfigSchema.safeParse(json);
	if (!result.success) {
		if (import.meta.env.DEV) {
			throw error(500, `Config invalide: ${result.error.message}`);
		}
		throw error(404, 'Page introuvable');
	}

	return { config: result.data };
};
