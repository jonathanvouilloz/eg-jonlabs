import { z } from 'zod';

const surfaceBucket = z.enum(['less_100', '100_300', '300_800', 'more_800', 'unknown']);
const timing = z.enum(['urgent', 'few_weeks', 'this_season', 'planning']);
const preferredContact = z.enum(['email', 'phone', 'any']);
const variant = z.enum(['B', 'C', 'D']);

export const leadSubmissionSchema = z.object({
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/),
	variant,
	answers: z.object({
		serviceId: z.string().min(1),
		serviceLabel: z.string(),
		inspirationIds: z.array(z.string()).optional(),
		timing,
		timingLabel: z.string(),
		commune: z.string().min(2).max(80),
		surface: surfaceBucket,
		surfaceLabel: z.string(),
		contact: z.object({
			firstName: z.string().min(2).max(60),
			lastName: z.string().max(60).nullable(),
			email: z.string().email(),
			phone: z.string().min(10).max(20),
			preferredContact
		}),
		freeText: z.string().max(2000).optional()
	}),
	consentGdpr: z.literal(true),
	submittedAt: z.string()
});

export const requestBodySchema = leadSubmissionSchema.extend({
	honeypot: z.string().optional()
});
