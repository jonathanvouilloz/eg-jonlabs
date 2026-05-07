import type { PricingCategory } from './quote';

export type QuizVariant = 'B' | 'C' | 'D';

export interface ProspectConfig {
	slug: string;
	industry: 'paysagiste';
	createdAt: string;

	business: {
		name: string;
		ownerFirstName: string;
		ownerLastName: string;
		tagline: string;
		phone: string;
		email: string;
		address?: string | null;
		googleProfileUrl?: string | null;
		googleMapsEmbedUrl?: string | null;
		logoUrl: string | null;
		googleReviewUrl: string | null;
		facebookUrl: string | null;
		instagramUrl: string | null;
	};

	credibility: {
		yearsExperience: number;
		chantiersCount: number | null;
		googleRating: number | null;
		googleReviewsCount: number | null;
		zones: string[];
		radiusKm: number;
		latitude: number;
		longitude: number;
	};

	branding: {
		primaryColor: string;
		secondaryColor: string;
		accentColor: string;
		fontFamily:
			| 'Inter'
			| 'Source Serif'
			| 'Playfair Display'
			| 'Raleway'
			| 'Bodoni Moda'
			| 'Plus Jakarta Sans';
	};

	heroImage: string;
	quizVariant: QuizVariant;
	services: ProspectService[];
	inspirationGallery?: InspirationItem[];
	realizations: Realization[];
	testimonials: Testimonial[];
	faq: FAQItem[];

	leadDelivery: {
		recipientEmail: string;
		ccEmails: string[];
		subjectPrefix: string;
	};

	salesPage?: SalesPageConfig;
	localMarket?: LocalMarketConfig;
	communes?: string[];
	heroPrefix?: string;
	heroSubline?: string;
}

export interface SalesPageConfig {
	loomVideoId: string;
	screenshotUrl: string;
	subtitleObservation: string;
}

export interface LocalMarketConfig {
	monthlySearches: number;
	topThreeCaptureRate: number;
}

export interface ProspectService {
	id: string;
	label: string;
	description: string;
	icon: string;
	iconName?: string;
	image: string | null;
	active: boolean;
	pricingCategory?: PricingCategory;
}

export interface InspirationItem {
	id: string;
	image: string;
	label: string;
}

export interface Realization {
	before: string | null;
	after: string;
	caption: string;
}

export interface Testimonial {
	name: string;
	location: string;
	text: string;
	rating: 1 | 2 | 3 | 4 | 5;
}

export interface FAQItem {
	question: string;
	answer: string;
}
