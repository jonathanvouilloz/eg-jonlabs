import type { PricingCategory, SurfaceBucket, TimingValue } from '$types/quote';

export const SURFACE_BASELINE: Record<Exclude<SurfaceBucket, 'unknown'>, number> = {
	less_100: 70,
	'100_300': 200,
	'300_800': 500,
	more_800: 1000
};

export const TIMING_MODULATOR: Record<TimingValue, { factor: number; label: string }> = {
	urgent: { factor: 1.2, label: 'Intervention urgente (+20%)' },
	few_weeks: { factor: 1.0, label: 'Quelques semaines' },
	this_season: { factor: 1.0, label: 'Cette saison' },
	planning: { factor: 0.95, label: 'Planifié, pas pressé (-5%)' }
};

export const TRAVEL_FEE_SMALL = 80;

export interface PerM2Rate {
	type: 'perM2';
	rateMin: number;
	rateMedian: number;
	rateMax: number;
	unit: 'CHF/m²';
}

export interface PerMlRate {
	type: 'perMl';
	rateMin: number;
	rateMedian: number;
	rateMax: number;
	mlPerM2: number;
	unit: 'CHF/ml';
}

export interface ForfaitRate {
	type: 'forfait';
	byBucket: Record<Exclude<SurfaceBucket, 'unknown'>, { min: number; median: number; max: number }>;
	unit: 'forfait' | 'CHF/an';
}

export type PricingRate = PerM2Rate | PerMlRate | ForfaitRate;

export const PRICING_RATES: Record<PricingCategory, PricingRate> = {
	tonte: { type: 'perM2', rateMin: 0.25, rateMedian: 0.28, rateMax: 0.3, unit: 'CHF/m²' },
	creation_jardin: { type: 'perM2', rateMin: 80, rateMedian: 115, rateMax: 150, unit: 'CHF/m²' },
	amenagement_complet: {
		type: 'perM2',
		rateMin: 80,
		rateMedian: 115,
		rateMax: 150,
		unit: 'CHF/m²'
	},
	taille_haies: {
		type: 'perMl',
		rateMin: 5,
		rateMedian: 9,
		rateMax: 18,
		mlPerM2: 0.15,
		unit: 'CHF/ml'
	},
	elagage: {
		type: 'forfait',
		unit: 'forfait',
		byBucket: {
			less_100: { min: 200, median: 350, max: 500 },
			'100_300': { min: 400, median: 700, max: 1200 },
			'300_800': { min: 600, median: 1400, max: 2500 },
			more_800: { min: 1000, median: 2500, max: 5000 }
		}
	},
	terrasse_dalle: { type: 'perM2', rateMin: 100, rateMedian: 122, rateMax: 145, unit: 'CHF/m²' },
	terrasse_bois: { type: 'perM2', rateMin: 200, rateMedian: 290, rateMax: 380, unit: 'CHF/m²' },
	gazon_rouleau: { type: 'perM2', rateMin: 26, rateMedian: 35, rateMax: 45, unit: 'CHF/m²' },
	entretien_annuel: {
		type: 'forfait',
		unit: 'CHF/an',
		byBucket: {
			less_100: { min: 800, median: 1200, max: 1800 },
			'100_300': { min: 2000, median: 2750, max: 3500 },
			'300_800': { min: 3500, median: 4800, max: 6500 },
			more_800: { min: 5500, median: 8000, max: 12000 }
		}
	},
	plantation: { type: 'perM2', rateMin: 80, rateMedian: 115, rateMax: 150, unit: 'CHF/m²' },
	horaire_simple: {
		type: 'forfait',
		unit: 'forfait',
		byBucket: {
			less_100: { min: 280, median: 400, max: 560 },
			'100_300': { min: 700, median: 1000, max: 1400 },
			'300_800': { min: 1500, median: 2200, max: 3000 },
			more_800: { min: 3000, median: 4000, max: 6000 }
		}
	}
};
