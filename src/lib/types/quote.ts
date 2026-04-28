export type PricingCategory =
	| 'tonte'
	| 'creation_jardin'
	| 'amenagement_complet'
	| 'taille_haies'
	| 'elagage'
	| 'terrasse_dalle'
	| 'terrasse_bois'
	| 'gazon_rouleau'
	| 'entretien_annuel'
	| 'plantation'
	| 'horaire_simple';

export type SurfaceBucket = 'less_100' | '100_300' | '300_800' | 'more_800' | 'unknown';
export type TimingValue = 'urgent' | 'few_weeks' | 'this_season' | 'planning';

export interface QuoteBreakdownLine {
	label: string;
	value: string;
}

export interface QuoteResult {
	available: boolean;
	min: number;
	median: number;
	max: number;
	unit: string;
	surfaceUsed: number | null;
	modulator: number;
	modulatorLabel: string;
	travelFee: number;
	breakdown: QuoteBreakdownLine[];
	disclaimer: string;
}

export interface PricingInput {
	category: PricingCategory;
	surface: SurfaceBucket;
	timing: TimingValue;
}
