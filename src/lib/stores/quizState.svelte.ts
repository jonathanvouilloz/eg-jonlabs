import type { QuizVariant, ProspectService, InspirationItem } from '$types/prospect';
import type { LeadSubmission } from '$types/lead';

export type StepKey = 'service' | 'inspiration' | 'whenWhere' | 'surface' | 'contact';

export type TimingValue = 'urgent' | 'few_weeks' | 'this_season' | 'planning';
export type SurfaceValue = 'less_100' | '100_300' | '300_800' | 'more_800' | 'unknown';
export type PreferredContact = 'email' | 'phone' | 'any';

const TIMING_LABELS: Record<TimingValue, string> = {
	urgent: "C'est urgent (sous 1 semaine)",
	few_weeks: 'Dans les prochaines semaines',
	this_season: 'Cette saison',
	planning: 'Je planifie pour plus tard'
};

const SURFACE_LABELS: Record<SurfaceValue, string> = {
	less_100: 'Moins de 100 m²',
	'100_300': '100 – 300 m²',
	'300_800': '300 – 800 m²',
	more_800: 'Plus de 800 m²',
	unknown: 'Je ne sais pas'
};

export interface QuizAnswers {
	serviceId: string;
	serviceLabel: string;
	inspirationIds: string[];
	timing: TimingValue | '';
	timingLabel: string;
	commune: string;
	surface: SurfaceValue | '';
	surfaceLabel: string;
	contact: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		preferredContact: PreferredContact;
	};
	freeText: string;
	honeypot: string;
	consentGdpr: boolean;
}

function getSteps(variant: QuizVariant): StepKey[] {
	if (variant === 'C') {
		return ['service', 'inspiration', 'whenWhere', 'surface', 'contact'];
	}
	return ['service', 'whenWhere', 'surface', 'contact'];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function canProceedForStep(step: StepKey, answers: QuizAnswers): boolean {
	switch (step) {
		case 'service':
			return answers.serviceId !== '';
		case 'inspiration':
			return true; // optional
		case 'whenWhere':
			return answers.timing !== '' && answers.commune.trim().length >= 2;
		case 'surface':
			return answers.surface !== '';
		case 'contact':
			return (
				answers.contact.firstName.trim().length >= 2 &&
				EMAIL_RE.test(answers.contact.email) &&
				answers.contact.phone.trim().length >= 10 &&
				answers.consentGdpr
			);
	}
}

export function createQuizState(variant: QuizVariant, services: ProspectService[]) {
	let currentStep = $state(0);
	let direction = $state<1 | -1>(1);
	let answers = $state<QuizAnswers>({
		serviceId: '',
		serviceLabel: '',
		inspirationIds: [],
		timing: '',
		timingLabel: '',
		commune: '',
		surface: '',
		surfaceLabel: '',
		contact: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			preferredContact: 'any'
		},
		freeText: '',
		honeypot: '',
		consentGdpr: false
	});
	let isSubmitting = $state(false);
	let submitError = $state<string | null>(null);

	const steps = getSteps(variant);
	const totalSteps = steps.length;

	const progress = $derived(totalSteps > 1 ? currentStep / (totalSteps - 1) : 0);
	const currentStepKey = $derived(steps[currentStep]);
	const isFirstStep = $derived(currentStep === 0);
	const isLastStep = $derived(currentStep === totalSteps - 1);
	const canProceed = $derived(canProceedForStep(steps[currentStep], answers));

	function nextStep() {
		if (currentStep < totalSteps - 1) {
			direction = 1;
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			direction = -1;
			currentStep--;
		}
	}

	function reset() {
		currentStep = 0;
		direction = 1;
		answers = {
			serviceId: '',
			serviceLabel: '',
			inspirationIds: [],
			timing: '',
			timingLabel: '',
			commune: '',
			surface: '',
			surfaceLabel: '',
			contact: {
				firstName: '',
				lastName: '',
				email: '',
				phone: '',
				preferredContact: 'any'
			},
			freeText: '',
			honeypot: '',
			consentGdpr: false
		};
		isSubmitting = false;
		submitError = null;
	}

	function setAnswer<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) {
		answers[key] = value;
	}

	function setContactField<K extends keyof QuizAnswers['contact']>(
		key: K,
		value: QuizAnswers['contact'][K]
	) {
		answers.contact[key] = value;
	}

	function selectService(id: string, label: string) {
		answers.serviceId = id;
		answers.serviceLabel = label;
	}

	function selectTiming(value: TimingValue) {
		answers.timing = value;
		answers.timingLabel = TIMING_LABELS[value];
	}

	function selectSurface(value: SurfaceValue) {
		answers.surface = value;
		answers.surfaceLabel = SURFACE_LABELS[value];
	}

	function toggleInspiration(id: string) {
		const idx = answers.inspirationIds.indexOf(id);
		if (idx === -1) {
			answers.inspirationIds = [...answers.inspirationIds, id];
		} else {
			answers.inspirationIds = answers.inspirationIds.filter((i) => i !== id);
		}
	}

	function buildPayload(slug: string): LeadSubmission {
		return {
			slug,
			variant,
			answers: {
				serviceId: answers.serviceId,
				serviceLabel: answers.serviceLabel,
				...(variant === 'C' && answers.inspirationIds.length > 0
					? { inspirationIds: answers.inspirationIds }
					: {}),
				timing: answers.timing as TimingValue,
				timingLabel: answers.timingLabel,
				commune: answers.commune.trim(),
				surface: answers.surface as SurfaceValue,
				surfaceLabel: answers.surfaceLabel,
				contact: {
					firstName: answers.contact.firstName.trim(),
					lastName: answers.contact.lastName.trim() || null,
					email: answers.contact.email.trim().toLowerCase(),
					phone: normalizePhone(answers.contact.phone.trim()),
					preferredContact: answers.contact.preferredContact
				},
				...(variant === 'D' && answers.freeText.trim()
					? { freeText: answers.freeText.trim() }
					: {})
			},
			consentGdpr: answers.consentGdpr,
			submittedAt: new Date().toISOString()
		};
	}

	return {
		get currentStep() {
			return currentStep;
		},
		get direction() {
			return direction;
		},
		get answers() {
			return answers;
		},
		get isSubmitting() {
			return isSubmitting;
		},
		set isSubmitting(v: boolean) {
			isSubmitting = v;
		},
		get submitError() {
			return submitError;
		},
		set submitError(v: string | null) {
			submitError = v;
		},
		get steps() {
			return steps;
		},
		get totalSteps() {
			return totalSteps;
		},
		get progress() {
			return progress;
		},
		get currentStepKey() {
			return currentStepKey;
		},
		get isFirstStep() {
			return isFirstStep;
		},
		get isLastStep() {
			return isLastStep;
		},
		get canProceed() {
			return canProceed;
		},
		nextStep,
		prevStep,
		reset,
		setAnswer,
		setContactField,
		selectService,
		selectTiming,
		selectSurface,
		toggleInspiration,
		buildPayload
	};
}

function normalizePhone(phone: string): string {
	const digits = phone.replace(/\s+/g, '');
	if (digits.startsWith('0') && digits.length === 10) {
		return '+41' + digits.slice(1);
	}
	if (digits.startsWith('+')) {
		return digits;
	}
	return digits;
}

export { TIMING_LABELS, SURFACE_LABELS };
