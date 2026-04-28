import type { QuizVariant } from './prospect';

export interface LeadSubmission {
	slug: string;
	variant: QuizVariant;
	answers: {
		serviceId: string;
		serviceLabel: string;
		inspirationIds?: string[];
		timing: 'urgent' | 'few_weeks' | 'this_season' | 'planning';
		timingLabel: string;
		commune: string;
		surface: 'less_100' | '100_300' | '300_800' | 'more_800' | 'unknown';
		surfaceLabel: string;
		contact: {
			firstName: string;
			lastName: string | null;
			email: string;
			phone: string;
			preferredContact: 'email' | 'phone' | 'any';
		};
		freeText?: string;
	};
	consentGdpr: boolean;
	submittedAt: string;
}
