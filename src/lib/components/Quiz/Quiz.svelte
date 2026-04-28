<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { ProspectConfig } from '$types/prospect';
	import { createQuizState } from '$stores/quizState.svelte';
	import QuizProgress from './QuizProgress.svelte';
	import StepService from './StepService.svelte';
	import StepWhenWhere from './StepWhenWhere.svelte';
	import StepSurface from './StepSurface.svelte';
	import StepContact from './StepContact.svelte';
	import StepInspiration from './StepInspiration.svelte';

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

	async function handleSubmit() {
		if (quiz.answers.honeypot) return;
		if (!quiz.canProceed) return;

		quiz.isSubmitting = true;
		quiz.submitError = null;

		try {
			const payload = quiz.buildPayload(config.slug);
			console.log('[Quiz] LeadSubmission payload:', JSON.stringify(payload, null, 2));
			window.location.href = `/eg/${config.slug}/merci`;
		} catch (err) {
			quiz.submitError = "Une erreur est survenue. Veuillez réessayer.";
			quiz.isSubmitting = false;
		}
	}

	function handleNext() {
		if (quiz.isLastStep) {
			handleSubmit();
		} else {
			quiz.nextStep();
		}
	}
</script>

<section id="devis" class="px-4 py-16">
	<div class="mx-auto max-w-3xl">
		<div class="mb-8 text-center">
			<h2 class="text-4xl font-bold text-primary md:text-5xl">
				Recevez votre devis en 2 minutes
			</h2>
			<p class="mt-2 text-text-muted">Répondez à quelques questions, c'est gratuit et sans engagement.</p>
		</div>

		<div class="border border-gray-200 bg-white p-6 shadow-lg md:p-8">
			<QuizProgress current={quiz.currentStep} total={quiz.totalSteps} />

			<div class="relative min-h-[320px] overflow-hidden">
				{#key quiz.currentStep}
					<div
						class="w-full"
						in:fly={{ x: quiz.direction * 80, duration: 300 }}
						out:fly={{ x: quiz.direction * -80, duration: 200 }}
					>
						{#if quiz.currentStepKey === 'service'}
							<StepService
								services={config.services}
								selectedId={quiz.answers.serviceId}
								onSelect={quiz.selectService}
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
							<StepSurface
								selected={quiz.answers.surface}
								onSelect={quiz.selectSurface}
							/>
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

			{#if quiz.submitError}
				<p class="mt-4 text-center text-sm text-red-500">{quiz.submitError}</p>
			{/if}

			<div class="mt-6 flex items-center justify-between gap-4">
				{#if quiz.isFirstStep}
					<div></div>
				{:else}
					<button
						type="button"
						onclick={quiz.prevStep}
						class="border-2 border-gray-200 px-6 py-3 text-sm font-medium text-text-muted transition-all duration-200 hover:border-primary/40"
					>
						← Retour
					</button>
				{/if}

				<button
					type="button"
					onclick={handleNext}
					disabled={!quiz.canProceed || quiz.isSubmitting}
					class="px-8 py-3 text-sm font-semibold text-white transition-all duration-200
						{quiz.canProceed && !quiz.isSubmitting
						? 'bg-accent hover:shadow-md cursor-pointer'
						: 'bg-gray-300 cursor-not-allowed'}"
				>
					{#if quiz.isSubmitting}
						Envoi…
					{:else if quiz.isLastStep}
						Recevoir mon devis →
					{:else}
						Continuer →
					{/if}
				</button>
			</div>
		</div>
	</div>
</section>
