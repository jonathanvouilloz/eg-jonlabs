import type { ProspectConfig } from '$types/prospect';

const FONT_MAP: Record<ProspectConfig['branding']['fontFamily'], string> = {
	Inter: "'Plus Jakarta Sans', sans-serif",
	'Source Serif': "'Plus Jakarta Sans', sans-serif",
	'Playfair Display': "'Plus Jakarta Sans', sans-serif",
	Raleway: "'Plus Jakarta Sans', sans-serif",
	'Bodoni Moda': "'Plus Jakarta Sans', sans-serif",
	'Plus Jakarta Sans': "'Plus Jakarta Sans', sans-serif"
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
