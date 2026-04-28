/**
 * Format a Swiss phone number progressively as the user types.
 * Handles three modes: international (+41 XX XXX XX XX),
 * 00-prefixed (00XX -> +XX), and national (0XX XXX XX XX).
 */
export function formatSwissPhoneInput(input: string): string {
	let cleaned = input.replace(/[^\d+]/g, '');

	if (cleaned.startsWith('00')) {
		cleaned = '+' + cleaned.slice(2);
	}

	if (cleaned.startsWith('+41')) {
		const rest = cleaned.slice(3).slice(0, 9);
		const parts = [rest.slice(0, 2), rest.slice(2, 5), rest.slice(5, 7), rest.slice(7, 9)].filter(
			(p) => p.length > 0
		);
		return '+41' + (parts.length ? ' ' + parts.join(' ') : '');
	}

	if (cleaned.startsWith('+')) {
		return cleaned;
	}

	const digits = cleaned.slice(0, 10);
	const parts = [
		digits.slice(0, 3),
		digits.slice(3, 6),
		digits.slice(6, 8),
		digits.slice(8, 10)
	].filter((p) => p.length > 0);
	return parts.join(' ');
}

export function isValidSwissPhone(input: string): boolean {
	const digits = input.replace(/[^\d+]/g, '');
	if (digits.startsWith('+41')) return digits.length === 12;
	if (digits.startsWith('+')) return digits.length >= 10;
	return digits.length === 10 && digits.startsWith('0');
}
