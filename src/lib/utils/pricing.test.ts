import { describe, expect, it } from 'vitest';
import { calculateQuote, formatChf } from './pricing';

describe('calculateQuote', () => {
	it('returns unavailable for unknown surface', () => {
		const q = calculateQuote({
			category: 'creation_jardin',
			surface: 'unknown',
			timing: 'few_weeks'
		});
		expect(q.available).toBe(false);
		expect(q.median).toBe(0);
	});

	it('calculates per-m² creation_jardin for 100_300 bucket', () => {
		const q = calculateQuote({
			category: 'creation_jardin',
			surface: '100_300',
			timing: 'few_weeks'
		});
		expect(q.available).toBe(true);
		expect(q.surfaceUsed).toBe(200);
		expect(q.median).toBeGreaterThan(20000);
		expect(q.median).toBeLessThan(26000);
		expect(q.min).toBeLessThan(q.median);
		expect(q.max).toBeGreaterThan(q.median);
		expect(q.unit).toBe('CHF/m²');
		expect(q.travelFee).toBe(0);
	});

	it('applies +20% urgent modulator', () => {
		const normal = calculateQuote({
			category: 'creation_jardin',
			surface: '100_300',
			timing: 'few_weeks'
		});
		const urgent = calculateQuote({
			category: 'creation_jardin',
			surface: '100_300',
			timing: 'urgent'
		});
		expect(urgent.median).toBeGreaterThan(normal.median);
		expect(urgent.median / normal.median).toBeCloseTo(1.2, 1);
	});

	it('applies -5% planning modulator', () => {
		const planned = calculateQuote({
			category: 'creation_jardin',
			surface: '100_300',
			timing: 'planning'
		});
		const normal = calculateQuote({
			category: 'creation_jardin',
			surface: '100_300',
			timing: 'few_weeks'
		});
		expect(planned.median).toBeLessThan(normal.median);
	});

	it('adds travel fee for less_100 surfaces', () => {
		const small = calculateQuote({
			category: 'creation_jardin',
			surface: 'less_100',
			timing: 'few_weeks'
		});
		expect(small.travelFee).toBe(80);
	});

	it('uses forfait bucket for entretien_annuel', () => {
		const q = calculateQuote({
			category: 'entretien_annuel',
			surface: '100_300',
			timing: 'few_weeks'
		});
		expect(q.median).toBe(2750);
		expect(q.unit).toBe('CHF/an');
		expect(q.surfaceUsed).toBeNull();
	});

	it('horaire_simple fallback returns reasonable amount', () => {
		const q = calculateQuote({
			category: 'horaire_simple',
			surface: '100_300',
			timing: 'few_weeks'
		});
		expect(q.median).toBeGreaterThan(500);
		expect(q.median).toBeLessThan(2000);
		expect(q.min).toBeLessThan(q.max);
	});

	it('taille_haies converts surface to ml', () => {
		const q = calculateQuote({
			category: 'taille_haies',
			surface: '100_300',
			timing: 'few_weeks'
		});
		expect(q.available).toBe(true);
		expect(q.unit).toBe('CHF/ml');
		expect(q.median).toBeGreaterThan(0);
	});

	it('rounds to 10 CHF', () => {
		const q = calculateQuote({
			category: 'gazon_rouleau',
			surface: '100_300',
			timing: 'urgent'
		});
		expect(q.median % 10).toBe(0);
		expect(q.min % 10).toBe(0);
		expect(q.max % 10).toBe(0);
	});
});

describe('formatChf', () => {
	it('formats integer CHF amounts', () => {
		expect(formatChf(2750)).toMatch(/2.?750/);
		expect(formatChf(2750)).toMatch(/CHF/);
	});

	it('formats zero', () => {
		expect(formatChf(0)).toMatch(/0/);
	});
});
