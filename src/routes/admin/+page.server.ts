import { fail } from '@sveltejs/kit';
import { listProspects, deleteProspect } from '$server/crm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		prospects: listProspects()
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const data = await request.formData();
		const slug = String(data.get('slug') ?? '');
		if (!slug) return fail(400, { error: 'slug manquant' });
		const result = deleteProspect(slug);
		if (!result.ok) return fail(400, { error: result.reason ?? 'unknown' });
		return { success: true, deletedSlug: slug };
	}
};
