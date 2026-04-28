<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';
	import type { QuoteResult } from '$types/quote';
	import type { QuizAnswers } from '$stores/quizState.svelte';
	import { formatChf } from '$utils/pricing';
	import { generateQuotePdf } from '$utils/pdfQuote';
	import QuoteDocument from './QuoteDocument.svelte';

	interface Props {
		config: ProspectConfig;
		answers: QuizAnswers;
		quote: QuoteResult;
		onReset?: () => void;
	}

	let { config, answers, quote, onReset }: Props = $props();

	let documentRef = $state<HTMLDivElement | null>(null);
	let isGenerating = $state(false);
	let pdfError = $state<string | null>(null);
	let detailsOpen = $state(false);

	const phoneHref = $derived(`tel:${config.business.phone.replace(/\s+/g, '')}`);
	const filename = $derived(
		`devis-${config.slug}-${answers.contact.lastName || answers.contact.firstName || 'client'}.pdf`
			.toLowerCase()
			.replace(/[^a-z0-9.-]/g, '-')
	);

	const explanationItems = $derived.by(() => {
		const items: { title: string; text: string }[] = [];
		if (quote.surfaceUsed) {
			items.push({
				title: 'Surface estimée',
				text: `Le calcul se base sur une surface médiane de ${quote.surfaceUsed} m² (votre fourchette : ${answers.surfaceLabel.toLowerCase()}). Le prix est proportionnel à la surface réelle mesurée sur place.`
			});
		} else {
			items.push({
				title: 'Forfait par taille de chantier',
				text: `Cette prestation se calcule en forfait selon la taille du chantier (${answers.surfaceLabel.toLowerCase()}). Le prix exact dépend du nombre de prestations et de la difficulté.`
			});
		}

		if (quote.modulator > 1) {
			items.push({
				title: 'Délai serré',
				text: `Une intervention urgente représente un surcoût d'environ ${Math.round((quote.modulator - 1) * 100)} % (mobilisation rapide d'une équipe disponible).`
			});
		} else if (quote.modulator < 1) {
			items.push({
				title: 'Planification flexible',
				text: `Vous n'êtes pas pressé : le paysagiste peut planifier l'intervention à un moment optimisé (-${Math.round((1 - quote.modulator) * 100)} % sur le tarif standard).`
			});
		}

		if (quote.travelFee > 0) {
			items.push({
				title: 'Frais de déplacement',
				text: `Pour les petits chantiers, des frais fixes de déplacement de ${formatChf(quote.travelFee)} sont inclus pour couvrir le trajet et la mise en place.`
			});
		}

		items.push({
			title: 'Ce qui peut faire varier',
			text: 'Accès au terrain (pente, étroitesse), matériaux choisis (essence du bois, qualité des plantes), évacuation des déchets, plus-values esthétiques. Le paysagiste affinera après visite gratuite.'
		});

		return items;
	});

	async function downloadPdf() {
		if (!documentRef) return;
		isGenerating = true;
		pdfError = null;
		try {
			await generateQuotePdf(documentRef, filename);
		} catch {
			pdfError = 'Impossible de générer le PDF. Réessayez ou contactez le paysagiste.';
		} finally {
			isGenerating = false;
		}
	}
</script>

<div class="space-y-6">
	<div class="text-center">
		<p class="text-sm uppercase tracking-wider text-text-muted">Votre estimation</p>
		<h3
			class="mt-2 text-2xl font-semibold text-primary md:text-3xl"
			style="font-family: 'Inter', sans-serif; letter-spacing: -0.015em;"
		>
			Bonjour {answers.contact.firstName}, voici votre devis
		</h3>
		<p class="mt-2 text-text-muted">
			Estimation indicative pour {answers.serviceLabel.toLowerCase()} à {answers.commune}.
		</p>
	</div>

	{#if quote.available}
		<div class="border-l-4 border-accent bg-secondary p-6 md:p-8">
			<p class="text-center text-sm uppercase tracking-wider text-text-muted">Fourchette estimée</p>
			<p class="mt-2 text-center text-5xl font-bold text-primary md:text-6xl">
				{formatChf(quote.median)}
			</p>
			<p class="mt-2 text-center text-text-muted">
				Entre <strong>{formatChf(quote.min)}</strong> et <strong>{formatChf(quote.max)}</strong>
			</p>

			{#if quote.breakdown.length > 0}
				<dl class="mt-6 space-y-2 border-t border-gray-200 pt-4">
					{#each quote.breakdown as line, i (i)}
						<div class="flex items-baseline justify-between gap-4 text-sm">
							<dt class="text-text-muted">{line.label}</dt>
							<dd class="font-medium text-text-default">{line.value}</dd>
						</div>
					{/each}
				</dl>
			{/if}
		</div>

		<details class="quote-details border border-gray-200 bg-white" bind:open={detailsOpen}>
			<summary
				class="flex items-center justify-between px-5 py-4 text-sm font-medium text-primary transition-colors hover:bg-secondary/40"
			>
				<span class="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-4 w-4"
					>
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-3.75a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75Zm0 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
							clip-rule="evenodd"
						/>
					</svg>
					Pourquoi ce prix ?
				</span>
				<svg
					class="quote-chevron h-4 w-4 transition-transform"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
						clip-rule="evenodd"
					/>
				</svg>
			</summary>
			<div class="border-t border-gray-100 px-5 py-4">
				<ul class="space-y-3">
					{#each explanationItems as item (item.title)}
						<li class="border-l-2 border-primary/30 pl-3 text-sm">
							<p class="font-medium text-text-default">{item.title}</p>
							<p class="mt-0.5 text-text-muted">{item.text}</p>
						</li>
					{/each}
				</ul>
			</div>
		</details>

		<p class="text-center text-xs italic text-text-muted">
			{quote.disclaimer}
		</p>
	{:else}
		<div class="border-l-4 border-accent bg-secondary p-6 md:p-8">
			<p class="text-center text-text-default">
				{quote.disclaimer}
			</p>
		</div>
	{/if}

	<div class="grid gap-3 md:grid-cols-[1.4fr_1fr]">
		<a
			href={phoneHref}
			class="flex items-center justify-center gap-2 bg-primary px-6 py-4 text-base font-semibold text-white shadow-md transition-all hover:opacity-90"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-5 w-5"
			>
				<path
					fill-rule="evenodd"
					d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.328-.43A13.022 13.022 0 0 1 2.43 8.328 13.019 13.019 0 0 1 2 5V3.5Z"
					clip-rule="evenodd"
				/>
			</svg>
			Appeler {config.business.ownerFirstName}
		</a>

		<button
			type="button"
			onclick={downloadPdf}
			disabled={isGenerating || !quote.available}
			class="flex items-center justify-center gap-2 border-2 border-primary px-6 py-4 text-sm font-medium transition-all
				{quote.available && !isGenerating
				? 'cursor-pointer text-primary hover:bg-primary hover:text-white'
				: 'cursor-not-allowed border-gray-300 text-gray-400'}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-4 w-4"
			>
				<path
					fill-rule="evenodd"
					d="M10 3a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3.75A.75.75 0 0 1 10 3Z"
					clip-rule="evenodd"
				/>
				<path
					d="M3 14.25a.75.75 0 0 1 .75.75v.75A2.25 2.25 0 0 0 6 18h8a2.25 2.25 0 0 0 2.25-2.25V15a.75.75 0 0 1 1.5 0v.75A3.75 3.75 0 0 1 14 19.5H6a3.75 3.75 0 0 1-3.75-3.75V15a.75.75 0 0 1 .75-.75Z"
				/>
			</svg>
			{isGenerating ? 'Génération…' : 'Télécharger en PDF'}
		</button>
	</div>

	{#if pdfError}
		<p class="text-center text-sm text-red-500">{pdfError}</p>
	{/if}

	{#if onReset}
		<div class="text-center">
			<button
				type="button"
				onclick={onReset}
				class="text-sm text-text-muted underline-offset-4 transition-colors hover:text-primary hover:underline"
			>
				Refaire un devis
			</button>
		</div>
	{/if}

	<div class="border-t border-gray-200 pt-6 text-center">
		<p class="text-sm text-text-muted">
			Le paysagiste vous contacte sous <strong class="text-primary">48 heures</strong> pour confirmer
			le devis sur place.
		</p>
		<p class="mt-1 text-xs text-text-muted">
			Numéro direct : <a href={phoneHref} class="underline">{config.business.phone}</a>
		</p>
	</div>
</div>

<div class="pdf-offscreen" aria-hidden="true">
	<div bind:this={documentRef}>
		<QuoteDocument {config} {answers} {quote} />
	</div>
</div>

<style>
	.pdf-offscreen {
		position: absolute;
		left: -9999px;
		top: 0;
		pointer-events: none;
	}

	.quote-details[open] .quote-chevron {
		transform: rotate(180deg);
	}

	.quote-details summary::-webkit-details-marker {
		display: none;
	}

	.quote-details summary {
		list-style: none;
	}
</style>
