import type { LeadSubmission } from '$types/lead';
import type { ProspectConfig } from '$types/prospect';
import type { QuoteResult } from '$types/quote';
import { formatChf } from '$utils/pricing';

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export function buildLeadEmailHtml(
	submission: LeadSubmission,
	quote: QuoteResult,
	config: ProspectConfig
): string {
	const { answers } = submission;
	const fullName = `${answers.contact.firstName} ${answers.contact.lastName ?? ''}`.trim();
	const submittedDate = new Date(submission.submittedAt).toLocaleString('fr-CH', {
		dateStyle: 'long',
		timeStyle: 'short'
	});
	const primary = config.branding.primaryColor;
	const accent = config.branding.accentColor;

	const quoteBlock = quote.available
		? `
		<tr>
			<td style="padding:0 24px 24px;">
				<div style="background:#f7f9f4;border-left:4px solid ${accent};padding:16px 20px;">
					<p style="margin:0 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#666;">Estimation calculée</p>
					<p style="margin:0;font-size:28px;font-weight:700;color:${primary};">
						${escapeHtml(formatChf(quote.median))}
					</p>
					<p style="margin:4px 0 0;font-size:13px;color:#555;">
						Fourchette : ${escapeHtml(formatChf(quote.min))} – ${escapeHtml(formatChf(quote.max))}
					</p>
					<table style="width:100%;border-collapse:collapse;margin-top:12px;">
						${quote.breakdown
							.map(
								(line) => `
							<tr>
								<td style="padding:4px 0;font-size:13px;color:#666;">${escapeHtml(line.label)}</td>
								<td style="padding:4px 0;font-size:13px;color:#1a1a1a;text-align:right;font-weight:500;">${escapeHtml(line.value)}</td>
							</tr>`
							)
							.join('')}
					</table>
				</div>
				<p style="margin:8px 0 0;font-size:11px;color:#888;font-style:italic;">${escapeHtml(quote.disclaimer)}</p>
			</td>
		</tr>`
		: `
		<tr>
			<td style="padding:0 24px 24px;">
				<div style="background:#fff8e6;border-left:4px solid #d4a574;padding:16px 20px;">
					<p style="margin:0;font-size:14px;color:#1a1a1a;">
						Surface inconnue — visite à programmer pour établir un devis chiffré.
					</p>
				</div>
			</td>
		</tr>`;

	const freeTextBlock = answers.freeText
		? `
		<tr>
			<td style="padding:0 24px 16px;">
				<p style="margin:0 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#666;">Message du client</p>
				<p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.5;white-space:pre-wrap;">${escapeHtml(answers.freeText)}</p>
			</td>
		</tr>`
		: '';

	return `<!doctype html>
<html lang="fr">
<head>
	<meta charset="utf-8" />
	<title>Nouveau lead</title>
</head>
<body style="margin:0;padding:24px;background:#f4f1ea;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;">
	<table role="presentation" style="max-width:600px;margin:0 auto;background:#fff;border-collapse:collapse;">
		<tr>
			<td style="padding:24px;border-bottom:3px solid ${primary};">
				<p style="margin:0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${primary};font-weight:600;">Nouveau lead — ${escapeHtml(config.business.name)}</p>
				<h1 style="margin:6px 0 0;font-size:22px;color:#1a1a1a;font-weight:700;">${escapeHtml(answers.serviceLabel)} à ${escapeHtml(answers.commune)}</h1>
				<p style="margin:4px 0 0;font-size:12px;color:#888;">Reçu le ${escapeHtml(submittedDate)}</p>
			</td>
		</tr>

		<tr>
			<td style="padding:20px 24px 12px;">
				<p style="margin:0 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#666;">Coordonnées</p>
				<table style="width:100%;border-collapse:collapse;">
					<tr><td style="padding:4px 0;font-size:13px;color:#666;width:120px;">Nom</td><td style="padding:4px 0;font-size:14px;font-weight:600;">${escapeHtml(fullName)}</td></tr>
					<tr><td style="padding:4px 0;font-size:13px;color:#666;">Email</td><td style="padding:4px 0;font-size:14px;"><a href="mailto:${escapeHtml(answers.contact.email)}" style="color:${primary};">${escapeHtml(answers.contact.email)}</a></td></tr>
					<tr><td style="padding:4px 0;font-size:13px;color:#666;">Téléphone</td><td style="padding:4px 0;font-size:14px;"><a href="tel:${escapeHtml(answers.contact.phone)}" style="color:${primary};">${escapeHtml(answers.contact.phone)}</a></td></tr>
					<tr><td style="padding:4px 0;font-size:13px;color:#666;">Préférence contact</td><td style="padding:4px 0;font-size:14px;">${escapeHtml(answers.contact.preferredContact)}</td></tr>
				</table>
			</td>
		</tr>

		<tr>
			<td style="padding:8px 24px 12px;">
				<p style="margin:0 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#666;">Demande</p>
				<table style="width:100%;border-collapse:collapse;">
					<tr><td style="padding:4px 0;font-size:13px;color:#666;width:120px;">Prestation</td><td style="padding:4px 0;font-size:14px;">${escapeHtml(answers.serviceLabel)}</td></tr>
					<tr><td style="padding:4px 0;font-size:13px;color:#666;">Surface</td><td style="padding:4px 0;font-size:14px;">${escapeHtml(answers.surfaceLabel)}</td></tr>
					<tr><td style="padding:4px 0;font-size:13px;color:#666;">Délai</td><td style="padding:4px 0;font-size:14px;">${escapeHtml(answers.timingLabel)}</td></tr>
					<tr><td style="padding:4px 0;font-size:13px;color:#666;">Commune</td><td style="padding:4px 0;font-size:14px;">${escapeHtml(answers.commune)}</td></tr>
				</table>
			</td>
		</tr>

		${freeTextBlock}
		${quoteBlock}

		<tr>
			<td style="padding:16px 24px 24px;border-top:1px solid #eee;">
				<p style="margin:0;font-size:12px;color:#aaa;">Lead reçu via <strong>jonlabs.ch/eg/${escapeHtml(submission.slug)}</strong>. Pour répondre au client, utilisez Reply (l'email est pré-rempli).</p>
			</td>
		</tr>
	</table>
</body>
</html>`;
}
