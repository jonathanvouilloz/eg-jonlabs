import type { ProspectConfig } from '$types/prospect';

const FONT_MAP: Record<ProspectConfig['branding']['fontFamily'], string> = {
	Inter: "'Barlow', sans-serif",
	'Source Serif': "'Source Serif 4', serif",
	'Playfair Display': "'Playfair Display', serif",
	Raleway: "'Raleway', sans-serif",
	'Bodoni Moda': "'Bodoni Moda', serif"
};

export function generateThemeStyle(branding: ProspectConfig['branding']): string {
	return [
		`--theme-primary: ${branding.primaryColor}`,
		`--theme-secondary: ${branding.secondaryColor}`,
		`--theme-accent: ${branding.accentColor}`,
		`--theme-font-heading: ${FONT_MAP[branding.fontFamily]}`
	].join('; ');
}

export function formatPhone(phone: string): string {
	if (phone.startsWith('+41')) {
		const digits = phone.slice(3);
		return `+41 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
	}
	return phone;
}
