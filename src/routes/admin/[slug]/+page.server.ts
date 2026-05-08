import { error, fail, redirect } from '@sveltejs/kit';
import { readProspect, writeProspect, deleteProspect } from '$server/crm';
import { uploadImage } from '$server/imageUpload';
import type { ProspectConfig, CrmStatus, CrmTier } from '$types/prospect';
import type { Actions, PageServerLoad } from './$types';

const VALID_STATUSES: CrmStatus[] = [
	'a_contacter',
	'contacte',
	'repondu',
	'signe',
	'pas_interesse'
];
const VALID_TIERS: CrmTier[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const load: PageServerLoad = ({ params }) => {
	const result = readProspect(params.slug);
	if (!result.ok) {
		throw error(result.reason === 'not_found' ? 404 : 500, result.reason);
	}
	return { config: result.config, slug: params.slug };
};

function parseJsonField<T>(
	data: FormData,
	key: string,
	fallback: T
): { ok: true; value: T } | { ok: false; error: string } {
	const raw = data.get(key);
	if (raw === null || raw === '') return { ok: true, value: fallback };
	try {
		return { ok: true, value: JSON.parse(String(raw)) as T };
	} catch (e) {
		return {
			ok: false,
			error: `Champ ${key} : JSON invalide (${e instanceof Error ? e.message : 'parse error'})`
		};
	}
}

/**
 * Normalise une saisie Google Maps : si l'utilisateur a paste le tag <iframe>
 * complet, on extrait juste l'URL src=. Si c'est un short link maps.app.goo.gl,
 * on rejette avec un message clair (pas embeddable).
 */
function normalizeMapsEmbed(
	raw: string
): { ok: true; url: string | null } | { ok: false; error: string } {
	const trimmed = raw.trim();
	if (!trimmed) return { ok: true, url: null };

	const iframeSrc = trimmed.match(/<iframe[^>]*\bsrc=["']([^"']+)["']/i);
	const url = iframeSrc ? iframeSrc[1] : trimmed;

	if (
		/maps\.app\.goo\.gl/i.test(url) ||
		/^https?:\/\/(?:www\.)?google\.[^/]+\/maps\/place/i.test(url)
	) {
		return {
			ok: false,
			error:
				"googleMapsEmbedUrl : utilise l'URL embed (Maps → Partager → Intégrer une carte → copier le src de l'iframe), pas un share link maps.app.goo.gl ni une URL /maps/place."
		};
	}
	if (!/^https?:\/\//i.test(url)) {
		return { ok: false, error: `googleMapsEmbedUrl : URL invalide (${url.slice(0, 60)}...)` };
	}
	return { ok: true, url };
}

function buildConfigFromForm(
	data: FormData,
	slug: string
): { ok: true; config: ProspectConfig } | { ok: false; error: string } {
	// Champs JSON (édition libre depuis textareas)
	const jsonFields = {
		services: parseJsonField<unknown>(data, 'services', []),
		realizations: parseJsonField<unknown>(data, 'realizations', []),
		testimonials: parseJsonField<unknown>(data, 'testimonials', []),
		faq: parseJsonField<unknown>(data, 'faq', []),
		communes: parseJsonField<unknown>(data, 'communes', []),
		branding: parseJsonField<unknown>(data, 'branding', null),
		salesPage: parseJsonField<unknown>(data, 'salesPage', null),
		localMarket: parseJsonField<unknown>(data, 'localMarket', null),
		inspirationGallery: parseJsonField<unknown>(data, 'inspirationGallery', null)
	};

	for (const [, result] of Object.entries(jsonFields)) {
		if (!result.ok) return { ok: false, error: result.error };
	}

	const mapsEmbed = normalizeMapsEmbed(String(data.get('googleMapsEmbedUrl') ?? ''));
	if (!mapsEmbed.ok) return { ok: false, error: mapsEmbed.error };

	const ccEmailsRaw = String(data.get('ccEmails') ?? '');
	const ccEmails = ccEmailsRaw
		.split(/[,\n]/)
		.map((s) => s.trim())
		.filter((s) => s.length > 0);

	const zonesRaw = String(data.get('zones') ?? '');
	const zones = zonesRaw
		.split(/[,\n]/)
		.map((s) => s.trim())
		.filter((s) => s.length > 0);

	const num = (key: string, fallback = 0): number => {
		const v = Number(data.get(key));
		return Number.isFinite(v) ? v : fallback;
	};
	const nullableStr = (key: string): string | null => {
		const v = String(data.get(key) ?? '').trim();
		return v.length > 0 ? v : null;
	};

	const config: ProspectConfig = {
		slug,
		industry: 'paysagiste',
		createdAt: String(data.get('createdAt') ?? new Date().toISOString().slice(0, 10)),
		business: {
			name: String(data.get('businessName') ?? '').trim(),
			ownerFirstName: String(data.get('ownerFirstName') ?? '').trim(),
			ownerLastName: String(data.get('ownerLastName') ?? '').trim(),
			tagline: String(data.get('tagline') ?? '').trim(),
			phone: String(data.get('phone') ?? '').trim(),
			email: String(data.get('email') ?? '').trim(),
			address: nullableStr('address'),
			googleProfileUrl: nullableStr('googleProfileUrl'),
			googleMapsEmbedUrl: mapsEmbed.url,
			logoUrl: nullableStr('logoUrl'),
			googleReviewUrl: nullableStr('googleReviewUrl'),
			facebookUrl: nullableStr('facebookUrl'),
			instagramUrl: nullableStr('instagramUrl')
		},
		credibility: {
			yearsExperience: num('yearsExperience', 1),
			chantiersCount: data.get('chantiersCount') ? num('chantiersCount') : null,
			googleRating: data.get('googleRating') ? num('googleRating') : null,
			googleReviewsCount: data.get('googleReviewsCount') ? num('googleReviewsCount') : null,
			zones,
			radiusKm: num('radiusKm', 20),
			latitude: num('latitude'),
			longitude: num('longitude')
		},
		// JSON fields
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		branding: (jsonFields.branding.ok && jsonFields.branding.value) as any,
		heroImage: String(data.get('heroImage') ?? '').trim(),
		quizVariant: (String(data.get('quizVariant') ?? 'B') as ProspectConfig['quizVariant']) || 'B',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		services: (jsonFields.services.ok ? jsonFields.services.value : []) as any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		realizations: (jsonFields.realizations.ok ? jsonFields.realizations.value : []) as any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		testimonials: (jsonFields.testimonials.ok ? jsonFields.testimonials.value : []) as any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		faq: (jsonFields.faq.ok ? jsonFields.faq.value : []) as any,
		leadDelivery: {
			recipientEmail: String(data.get('recipientEmail') ?? '').trim(),
			ccEmails,
			subjectPrefix: String(data.get('subjectPrefix') ?? '').trim()
		},
		heroPrefix: String(data.get('heroPrefix') ?? '').trim() || undefined,
		heroSubline: String(data.get('heroSubline') ?? '').trim() || undefined,
		crm: {
			websiteUrl: nullableStr('crmWebsiteUrl'),
			status: (() => {
				const v = String(data.get('crmStatus') ?? 'a_contacter');
				return VALID_STATUSES.includes(v as CrmStatus) ? (v as CrmStatus) : 'a_contacter';
			})(),
			tier: (() => {
				const v = String(data.get('crmTier') ?? '');
				return VALID_TIERS.includes(v as CrmTier) ? (v as CrmTier) : null;
			})(),
			notes: String(data.get('crmNotes') ?? '')
		}
	};

	// Optionnels JSON
	if (
		jsonFields.communes.ok &&
		Array.isArray(jsonFields.communes.value) &&
		jsonFields.communes.value.length > 0
	) {
		config.communes = jsonFields.communes.value as string[];
	} else if (zones.length > 0 && !config.communes) {
		// rien
	}
	if (jsonFields.salesPage.ok && jsonFields.salesPage.value) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		config.salesPage = jsonFields.salesPage.value as any;
	}
	if (jsonFields.localMarket.ok && jsonFields.localMarket.value) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		config.localMarket = jsonFields.localMarket.value as any;
	}
	if (jsonFields.inspirationGallery.ok && jsonFields.inspirationGallery.value) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		config.inspirationGallery = jsonFields.inspirationGallery.value as any;
	}

	return { ok: true, config };
}

export const actions: Actions = {
	save: async ({ request, params }) => {
		const data = await request.formData();
		const built = buildConfigFromForm(data, params.slug);
		if (!built.ok) return fail(400, { error: built.error });

		const result = writeProspect(params.slug, built.config);
		if (!result.ok) {
			const detail = result.reason === 'invalid_schema' ? result.detail : result.reason;
			return fail(400, { error: `Validation Zod : ${detail}` });
		}
		return { saved: true };
	},

	delete: async ({ params }) => {
		const result = deleteProspect(params.slug);
		if (!result.ok) return fail(400, { error: result.reason ?? 'unknown' });
		throw redirect(303, '/admin');
	},

	uploadHero: async ({ request, params }) => {
		const data = await request.formData();
		const file = data.get('file') as File | null;
		const upload = await uploadImage(params.slug, 'hero', file);
		if (!upload.ok) return fail(400, { uploadError: upload.reason, uploadDetail: upload.detail });

		// Met à jour heroImage dans la config
		const current = readProspect(params.slug);
		if (!current.ok) return fail(500, { error: 'Config introuvable après upload' });
		current.config.heroImage = upload.publicPath;
		const wrote = writeProspect(params.slug, current.config);
		if (!wrote.ok) return fail(500, { error: `Écriture config : ${wrote.reason}` });

		return { uploaded: 'hero', path: upload.publicPath };
	},

	uploadLogo: async ({ request, params }) => {
		const data = await request.formData();
		const file = data.get('file') as File | null;
		const upload = await uploadImage(params.slug, 'logo', file);
		if (!upload.ok) return fail(400, { uploadError: upload.reason, uploadDetail: upload.detail });

		const current = readProspect(params.slug);
		if (!current.ok) return fail(500, { error: 'Config introuvable après upload' });
		current.config.business.logoUrl = upload.publicPath;
		const wrote = writeProspect(params.slug, current.config);
		if (!wrote.ok) return fail(500, { error: `Écriture config : ${wrote.reason}` });

		return { uploaded: 'logo', path: upload.publicPath };
	}
};
