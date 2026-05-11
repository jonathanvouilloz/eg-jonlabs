import { z } from 'zod';

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/);
const e164Phone = z.string().regex(/^\+\d{10,15}$/);

const pricingCategorySchema = z.enum([
	'tonte',
	'creation_jardin',
	'amenagement_complet',
	'taille_haies',
	'elagage',
	'terrasse_dalle',
	'terrasse_bois',
	'gazon_rouleau',
	'entretien_annuel',
	'plantation',
	'horaire_simple'
]);

const prospectServiceSchema = z.object({
	id: z.string(),
	label: z.string(),
	description: z.string(),
	icon: z.string(),
	iconName: z.string().optional(),
	image: z.string().nullable(),
	active: z.boolean(),
	pricingCategory: pricingCategorySchema.optional()
});

const inspirationItemSchema = z.object({
	id: z.string(),
	image: z.string(),
	label: z.string()
});

const realizationSchema = z.object({
	before: z.string().nullable(),
	after: z.string(),
	caption: z.string()
});

const testimonialSchema = z.object({
	name: z.string(),
	location: z.string(),
	text: z.string(),
	rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
});

const faqItemSchema = z.object({
	question: z.string(),
	answer: z.string()
});

export const prospectConfigSchema = z.object({
	slug: z.string(),
	industry: z.enum(['paysagiste']),
	createdAt: z.string(),

	business: z.object({
		name: z.string(),
		ownerFirstName: z.string(),
		ownerLastName: z.string(),
		tagline: z.string(),
		phone: e164Phone,
		email: z.string().email(),
		address: z.string().nullable().optional(),
		googleProfileUrl: z.string().nullable().optional(),
		googleMapsEmbedUrl: z.string().nullable().optional(),
		logoUrl: z.string().nullable(),
		googleReviewUrl: z.string().nullable(),
		facebookUrl: z.string().nullable(),
		instagramUrl: z.string().nullable()
	}),

	credibility: z.object({
		yearsExperience: z.number().int().positive(),
		chantiersCount: z.number().int().positive().nullable(),
		googleRating: z.number().min(0).max(5).nullable(),
		googleReviewsCount: z.number().int().nonnegative().nullable(),
		zones: z.array(z.string()).min(1),
		radiusKm: z.number().positive(),
		latitude: z.number().min(-90).max(90),
		longitude: z.number().min(-180).max(180)
	}),

	branding: z.object({
		primaryColor: hexColor,
		secondaryColor: hexColor,
		accentColor: hexColor,
		fontFamily: z.enum([
			'Inter',
			'Source Serif',
			'Playfair Display',
			'Raleway',
			'Bodoni Moda',
			'Plus Jakarta Sans'
		])
	}),

	heroImage: z.string(),
	quizVariant: z.enum(['B', 'C', 'D']),
	services: z.array(prospectServiceSchema).min(1),
	inspirationGallery: z.array(inspirationItemSchema).optional(),
	realizations: z.array(realizationSchema),
	testimonials: z.array(testimonialSchema),
	faq: z.array(faqItemSchema),

	leadDelivery: z.object({
		recipientEmail: z.string().email(),
		ccEmails: z.array(z.string().email()),
		subjectPrefix: z.string()
	}),

	salesPage: z
		.object({
			loomVideoId: z.string(),
			screenshotUrl: z.string(),
			subtitleObservation: z.string()
		})
		.optional(),

	localMarket: z
		.object({
			monthlySearches: z.number().int().nonnegative(),
			topThreeCaptureRate: z.number().min(0).max(1)
		})
		.optional(),

	communes: z.array(z.string()).optional(),

	heroPrefix: z.string().optional(),

	heroSubline: z.string().optional(),

	heroH1: z.string().optional(),

	crm: z
		.object({
			websiteUrl: z.string().nullable(),
			status: z.enum(['a_contacter', 'contacte', 'repondu', 'signe', 'pas_interesse']),
			tier: z.enum(['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']).nullable(),
			notes: z.string()
		})
		.optional()
});
