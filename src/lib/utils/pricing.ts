import {
	PRICING_RATES,
	SURFACE_BASELINE,
	TIMING_MODULATOR,
	TRAVEL_FEE_SMALL
} from '$lib/data/pricingRates';
import type { PricingInput, QuoteBreakdownLine, QuoteResult } from '$types/quote';

const CHF_FORMATTER = new Intl.NumberFormat('fr-CH', {
	style: 'currency',
	currency: 'CHF',
	maximumFractionDigits: 0
});

export function formatChf(amount: number): string {
	return CHF_FORMATTER.format(amount);
}

function roundToTen(n: number): number {
	return Math.round(n / 10) * 10;
}

export function calculateQuote(input: PricingInput): QuoteResult {
	const { category, surface, timing } = input;

	if (surface === 'unknown') {
		return {
			available: false,
			min: 0,
			median: 0,
			max: 0,
			unit: '',
			surfaceUsed: null,
			modulator: 1,
			modulatorLabel: '',
			travelFee: 0,
			breakdown: [{ label: 'Surface', value: 'À évaluer sur place' }],
			disclaimer:
				'Sans connaître la surface, impossible de chiffrer une fourchette précise. Le paysagiste vous proposera un devis exact après une visite gratuite.'
		};
	}

	const rate = PRICING_RATES[category];
	const baseSurface = SURFACE_BASELINE[surface];
	const { factor: modulator, label: modulatorLabel } = TIMING_MODULATOR[timing];
	const travelFee = surface === 'less_100' ? TRAVEL_FEE_SMALL : 0;

	const breakdown: QuoteBreakdownLine[] = [];

	const raw = (() => {
		if (rate.type === 'perM2') {
			breakdown.push({ label: 'Surface estimée', value: `${baseSurface} m²` });
			breakdown.push({
				label: 'Tarif médian',
				value: `${rate.rateMedian.toLocaleString('fr-CH')} ${rate.unit}`
			});
			return {
				min: rate.rateMin * baseSurface,
				median: rate.rateMedian * baseSurface,
				max: rate.rateMax * baseSurface
			};
		}
		if (rate.type === 'perMl') {
			const ml = Math.round(baseSurface * rate.mlPerM2);
			breakdown.push({ label: 'Linéaire de haies estimé', value: `${ml} ml` });
			breakdown.push({ label: 'Tarif médian', value: `${rate.rateMedian} ${rate.unit}` });
			return {
				min: rate.rateMin * ml,
				median: rate.rateMedian * ml,
				max: rate.rateMax * ml
			};
		}
		const f = rate.byBucket[surface];
		breakdown.push({ label: 'Forfait', value: 'Selon la taille du chantier' });
		return { min: f.min, median: f.median, max: f.max };
	})();

	const min = roundToTen(raw.min * modulator + travelFee);
	const median = roundToTen(raw.median * modulator + travelFee);
	const max = roundToTen(raw.max * modulator + travelFee);

	if (modulator !== 1) {
		breakdown.push({ label: 'Délai', value: modulatorLabel });
	}
	if (travelFee > 0) {
		breakdown.push({ label: 'Frais de déplacement', value: formatChf(travelFee) });
	}

	return {
		available: true,
		min,
		median,
		max,
		unit: rate.unit,
		surfaceUsed: rate.type !== 'forfait' ? baseSurface : null,
		modulator,
		modulatorLabel,
		travelFee,
		breakdown,
		disclaimer:
			'Estimation indicative basée sur les tarifs moyens en Suisse romande. Le devis définitif sera établi après une visite gratuite à votre domicile.'
	};
}
