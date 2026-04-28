import { error } from '@sveltejs/kit';
import { loadProspectConfig } from '$server/loadProspectConfig';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const result = loadProspectConfig(params.slug);

	if (!result.ok) {
		if (result.reason === 'not_found') {
			throw error(404, `Prospect "${params.slug}" introuvable`);
		}
		if (result.reason === 'invalid_json') {
			throw error(500, `Config JSON invalide pour "${params.slug}"`);
		}
		if (import.meta.env.DEV) {
			throw error(500, `Config invalide: ${result.detail}`);
		}
		throw error(404, 'Page introuvable');
	}

	return { config: result.config };
};
