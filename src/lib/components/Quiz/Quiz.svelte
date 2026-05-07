<script lang="ts">
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import type { ProspectConfig } from '$types/prospect';
	import type { PricingCategory, SurfaceBucket, TimingValue } from '$types/quote';
	import { createQuizState } from '$stores/quizState.svelte';
	import { calculateQuote } from '$utils/pricing';
	import QuizProgress from './QuizProgress.svelte';
	import StepService from './StepService.svelte';
	import StepWhenWhere from './StepWhenWhere.svelte';
	import StepSurface from './StepSurface.svelte';
	import StepContact from './StepContact.svelte';
	import StepInspiration from './StepInspiration.svelte';
	import QuoteResult from './QuoteResult.svelte';

	let { config }: { config: ProspectConfig } = $props();

	const quiz = createQuizState(config.quizVariant, config.services);

	function handleUpdate(field: string, value: string | boolean) {
		if (field === 'consentGdpr') {
			quiz.setAnswer('consentGdpr', value as boolean);
		} else if (field === 'honeypot') {
			quiz.setAnswer('honeypot', value as string);
		} else if (field === 'freeText') {
			quiz.setAnswer('freeText', value as string);
		} else if (field === 'preferredContact') {
			quiz.setContactField('preferredContact', value as 'email' | 'phone' | 'any');
		} else {
			quiz.setContactField(field as 'firstName' | 'lastName' | 'email' | 'phone', value as string);
		}
	}

	function computeLocalQuote() {
		const service = config.services.find((s) => s.id === quiz.answers.serviceId);
		const category: PricingCategory = service?.pricingCategory ?? 'horaire_simple';
		return calculateQuote({
			category,
			surface: quiz.answers.surface as SurfaceBucket,
			timing: quiz.answers.timing as TimingValue
		});
	}

	async function handleSubmit() {
		if (quiz.answers.honeypot) return;
		if (!quiz.canProceed) return;

		quiz.submissionStatus = 'submitting';
		quiz.submitError = null;

		const localQuote = computeLocalQuote();
		quiz.quote = localQuote;

		try {
			const payload = quiz.buildPayload(config.slug);
			const body = { ...payload, honeypot: quiz.answers.honeypot };
			const res = await fetch('/api/submit', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!res.ok && res.status !== 404) {
				throw new Error(`Submit failed: ${res.status}`);
			}
			const data = await res.json().catch(() => ({}));
			if (data?.quote) {
				quiz.quote = data.quote;
			}
			quiz.submissionStatus = 'sent';
		} catch {
			quiz.submissionStatus = 'sent';
			quiz.submitError =
				"Le paysagiste sera prévenu manuellement. Voici votre estimation, n'hésitez pas à le contacter directement.";
		}
	}

	function handleNext() {
		if (quiz.isLastStep) {
			handleSubmit();
		} else {
			quiz.nextStep();
		}
	}

	function handleServiceSelect(id: string, label: string) {
		quiz.selectService(id, label);
		setTimeout(() => quiz.nextStep(), 420);
	}
</script>

<section id="devis" class="px-6 py-20 md:px-12">
	<div class="mx-auto max-w-4xl">
		{#if quiz.isSent && quiz.quote}
			<div in:fly={{ y: 24, duration: 500, easing: expoOut }}>
				<QuoteResult {config} answers={quiz.answers} quote={quiz.quote} onReset={quiz.reset} />
				{#if quiz.submitError}
					<p class="mt-4 text-center text-xs text-amber-600">{quiz.submitError}</p>
				{/if}
			</div>
		{:else}
			<div class="mb-10">
				<h2 class="text-4xl text-primary md:text-5xl">Décrivez votre projet</h2>
			</div>

			<QuizProgress current={quiz.currentStep} total={quiz.totalSteps} />

			<div class="relative min-h-[340px] overflow-hidden">
				{#key quiz.currentStep}
					<div
						class="w-full"
						in:fly={{ x: quiz.direction * 64, duration: 320, easing: expoOut }}
						out:fly={{ x: quiz.direction * -64, duration: 220, easing: expoOut }}
					>
						{#if quiz.currentStepKey === 'service'}
							<StepService
								services={config.services}
								selectedId={quiz.answers.serviceId}
								onSelect={handleServiceSelect}
							/>
						{:else if quiz.currentStepKey === 'inspiration'}
							<StepInspiration
								items={config.inspirationGallery ?? []}
								selectedIds={quiz.answers.inspirationIds}
								onToggle={quiz.toggleInspiration}
							/>
						{:else if quiz.currentStepKey === 'whenWhere'}
							<StepWhenWhere
								timing={quiz.answers.timing}
								commune={quiz.answers.commune}
								zones={config.credibility.zones}
								onTimingSelect={quiz.selectTiming}
								onCommuneChange={(v) => quiz.setAnswer('commune', v)}
							/>
						{:else if quiz.currentStepKey === 'surface'}
							<StepSurface selected={quiz.answers.surface} onSelect={quiz.selectSurface} />
						{:else if quiz.currentStepKey === 'contact'}
							<StepContact
								firstName={quiz.answers.contact.firstName}
								lastName={quiz.answers.contact.lastName}
								email={quiz.answers.contact.email}
								phone={quiz.answers.contact.phone}
								preferredContact={quiz.answers.contact.preferredContact}
								consentGdpr={quiz.answers.consentGdpr}
								honeypot={quiz.answers.honeypot}
								variant={config.quizVariant}
								freeText={quiz.answers.freeText}
								onUpdate={handleUpdate}
							/>
						{/if}
					</div>
				{/key}
			</div>

			<div class="mt-8 flex items-center justify-between gap-4">
				{#if quiz.isFirstStep}
					<div></div>
				{:else}
					<button
						type="button"
						onclick={quiz.prevStep}
						class="text-sm text-text-muted transition-colors duration-200 hover:text-primary"
						style="font-family: var(--font-body);"
					>
						← Retour
					</button>
				{/if}

				{#if quiz.currentStepKey !== 'service'}
					<button
						type="button"
						onclick={handleNext}
						disabled={!quiz.canProceed || quiz.isSubmitting}
						class="px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-200
							{quiz.canProceed && !quiz.isSubmitting
							? 'bg-primary hover:opacity-90 cursor-pointer'
							: 'bg-text/20 cursor-not-allowed'}"
						style="font-family: var(--font-body);"
					>
						{#if quiz.isSubmitting}
							Calcul en cours…
						{:else if quiz.isLastStep}
							Voir mon estimation
						{:else}
							Suivant
						{/if}
					</button>
				{/if}
			</div>
		{/if}
	</div>
</section>
