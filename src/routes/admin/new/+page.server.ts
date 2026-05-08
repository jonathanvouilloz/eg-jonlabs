import { fail, redirect } from '@sveltejs/kit';
import { writeProspect, prospectExists, isValidSlug } from '$server/crm';
import type { ProspectConfig } from '$types/prospect';
import type { Actions } from './$types';

const FALLBACK_HERO = '/_fallback/heroes/default.webp';

const SERVICES_DEFAULT: ProspectConfig['services'] = [
	{
		id: 'entretien',
		label: 'Entretien & tonte',
		description:
			"Tonte régulière, désherbage, bordures nettes — votre jardin impeccable toute l'année.",
		icon: '🌿',
		iconName: 'leaf',
		image: null,
		active: true,
		pricingCategory: 'tonte'
	},
	{
		id: 'taille-haies',
		label: 'Taille de haies',
		description: 'Haies et arbustes taillés avec précision, pour un rendu propre et structuré.',
		icon: '✂️',
		iconName: 'scissors',
		image: null,
		active: true,
		pricingCategory: 'taille_haies'
	},
	{
		id: 'creation-jardin',
		label: 'Création & aménagement',
		description:
			'Conception et réalisation de jardins sur mesure — massifs, pelouses, allées, terrasses.',
		icon: '🌱',
		iconName: 'seedling',
		image: null,
		active: true,
		pricingCategory: 'creation_jardin'
	},
	{
		id: 'contrat-annuel',
		label: "Contrat d'entretien annuel",
		description:
			"Tranquillité toute l'année : une équipe dédiée, des passages réguliers, rien à gérer.",
		icon: '📅',
		iconName: 'watering-can',
		image: null,
		active: true,
		pricingCategory: 'entretien_annuel'
	}
];

const BRANDING_DEFAULT: ProspectConfig['branding'] = {
	primaryColor: '#1B4332',
	secondaryColor: '#F0F4F0',
	accentColor: '#52B788',
	fontFamily: 'Inter'
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const slug = String(data.get('slug') ?? '')
			.trim()
			.toLowerCase();
		const name = String(data.get('name') ?? '').trim();
		const phone = String(data.get('phone') ?? '').trim();
		const email = String(data.get('email') ?? '').trim() || 'leads@jonlabs.ch';
		const locality = String(data.get('locality') ?? '').trim();
		const lat = Number(data.get('latitude')) || 46.2;
		const lng = Number(data.get('longitude')) || 6.15;

		if (!slug || !isValidSlug(slug)) {
			return fail(400, {
				error: `Slug invalide : doit être en kebab-case sans accents (a-z, 0-9, -), 1-64 chars`
			});
		}
		if (prospectExists(slug)) {
			return fail(400, {
				error: `Le slug "${slug}" existe déjà — choisis un autre slug ou édite l'existant`
			});
		}
		if (!name || !phone || !locality) {
			return fail(400, { error: 'Champs requis : nom, téléphone, localité' });
		}

		const today = new Date().toISOString().slice(0, 10);
		const subjectPrefix = `[DEVIS ${name
			.replace(/ Sàrl| SA| SNC/i, '')
			.toUpperCase()
			.slice(0, 30)}]`;

		const config: ProspectConfig = {
			slug,
			industry: 'paysagiste',
			createdAt: today,
			business: {
				name,
				ownerFirstName: '',
				ownerLastName: '',
				tagline: `Paysagiste à ${locality}`,
				phone,
				email,
				address: `${locality}, Suisse`,
				googleProfileUrl: null,
				googleMapsEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(`${name} ${locality}`)}&output=embed`,
				logoUrl: null,
				googleReviewUrl: null,
				facebookUrl: null,
				instagramUrl: null
			},
			credibility: {
				yearsExperience: 8,
				chantiersCount: null,
				googleRating: null,
				googleReviewsCount: 0,
				zones: [locality],
				radiusKm: 20,
				latitude: lat,
				longitude: lng
			},
			branding: BRANDING_DEFAULT,
			heroImage: FALLBACK_HERO,
			quizVariant: 'B',
			services: SERVICES_DEFAULT,
			realizations: [],
			testimonials: [],
			faq: [],
			leadDelivery: {
				recipientEmail: email,
				ccEmails: ['leads@jonlabs.ch'],
				subjectPrefix
			},
			localMarket: {
				monthlySearches: 0,
				topThreeCaptureRate: 0.5
			},
			communes: [locality],
			heroPrefix: 'à',
			heroSubline: 'création et entretien de jardin',
			crm: {
				websiteUrl: null,
				status: 'a_contacter',
				tier: null,
				notes: ''
			}
		};

		const result = writeProspect(slug, config);
		if (!result.ok) {
			const detail = result.reason === 'invalid_schema' ? result.detail : result.reason;
			return fail(400, { error: `Validation Zod : ${detail}` });
		}

		throw redirect(303, `/admin/${slug}`);
	}
};
