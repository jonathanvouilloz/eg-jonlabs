import { json, type RequestHandler } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { calculateQuote } from '$utils/pricing';
import { requestBodySchema } from '$server/leadSubmissionSchema';
import { loadProspectConfig } from '$server/loadProspectConfig';
import { buildLeadEmailHtml } from '$server/emailTemplate';
import type { PricingCategory } from '$types/quote';

function getResend() {
	const key = env.RESEND_API_KEY;
	if (!key) return null;
	return new Resend(key);
}

export const POST: RequestHandler = async ({ request }) => {
	let raw: unknown;
	try {
		raw = await request.json();
	} catch {
		return json({ error: 'invalid_json' }, { status: 400 });
	}

	if (
		raw &&
		typeof raw === 'object' &&
		'honeypot' in raw &&
		typeof (raw as { honeypot?: unknown }).honeypot === 'string' &&
		(raw as { honeypot: string }).honeypot.length > 0
	) {
		return json({ ok: true });
	}

	const parsed = requestBodySchema.safeParse(raw);
	if (!parsed.success) {
		return json({ error: 'invalid_payload' }, { status: 400 });
	}

	const submission = parsed.data;

	const loaded = loadProspectConfig(submission.slug);
	if (!loaded.ok) {
		return json({ error: 'prospect_not_found' }, { status: 404 });
	}
	const config = loaded.config;

	const service = config.services.find((s) => s.id === submission.answers.serviceId);
	const category: PricingCategory = service?.pricingCategory ?? 'horaire_simple';
	const quote = calculateQuote({
		category,
		surface: submission.answers.surface,
		timing: submission.answers.timing
	});

	const subjectService = service?.label ?? submission.answers.serviceLabel;
	const subject = `${config.leadDelivery.subjectPrefix} ${subjectService} – ${submission.answers.commune}`;
	const html = buildLeadEmailHtml(submission, quote, config);

	const bccList = Array.from(
		new Set(
			[env.INTERNAL_BCC_EMAIL, ...config.leadDelivery.ccEmails].filter(
				(s): s is string => typeof s === 'string' && s.length > 0
			)
		)
	);

	const resend = getResend();
	if (!resend || !env.RESEND_FROM_EMAIL) {
		console.warn('[api/submit] Resend not configured, skipping email send');
		return json({ ok: true, quote, warning: 'email_not_configured' });
	}

	try {
		await resend.emails.send({
			from: env.RESEND_FROM_EMAIL,
			to: config.leadDelivery.recipientEmail,
			replyTo: submission.answers.contact.email,
			bcc: bccList,
			subject,
			html
		});
	} catch (err) {
		console.error('[api/submit] Resend error', err);
		return json({ ok: false, quote, error: 'email_failed' }, { status: 502 });
	}

	return json({ ok: true, quote });
};
