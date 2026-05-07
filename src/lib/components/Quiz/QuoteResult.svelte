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
		const items: { num: number; title: string; text: string }[] = [];
		let n = 1;
		if (quote.surfaceUsed) {
			items.push({
				num: n++,
				title: 'Surface estimée',
				text: `Le calcul se base sur une surface médiane de ${quote.surfaceUsed} m² (votre fourchette : ${answers.surfaceLabel.toLowerCase()}). Le prix est proportionnel à la surface réelle mesurée sur place.`
			});
		} else {
			items.push({
				num: n++,
				title: 'Forfait par taille de chantier',
				text: `Cette prestation se calcule en forfait selon la taille du chantier (${answers.surfaceLabel.toLowerCase()}). Le prix exact dépend du nombre de prestations et de la difficulté.`
			});
		}

		if (quote.modulator > 1) {
			items.push({
				num: n++,
				title: 'Délai serré',
				text: `Une intervention urgente représente un surcoût d'environ ${Math.round((quote.modulator - 1) * 100)} % (mobilisation rapide d'une équipe disponible).`
			});
		} else if (quote.modulator < 1) {
			items.push({
				num: n++,
				title: 'Planification flexible',
				text: `Vous n'êtes pas pressé : le paysagiste peut planifier l'intervention à un moment optimisé (-${Math.round((1 - quote.modulator) * 100)} % sur le tarif standard).`
			});
		}

		if (quote.travelFee > 0) {
			items.push({
				num: n++,
				title: 'Frais de déplacement',
				text: `Pour les petits chantiers, des frais fixes de déplacement de ${formatChf(quote.travelFee)} sont inclus pour couvrir le trajet et la mise en place.`
			});
		}

		items.push({
			num: n,
			title: 'Ce qui peut faire varier',
			text: 'Accès au terrain (pente, étroitesse), matériaux choisis, évacuation des déchets, plus-values esthétiques. Le paysagiste affinera après visite gratuite.'
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

<div class="space-y-8">
	<div>
		<p
			class="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-text-muted"
			style="font-family: var(--font-body);"
		>
			Votre estimation
		</p>
		<h3 class="text-2xl font-normal text-primary">
			Bonjour {answers.contact.firstName}, voici votre devis
		</h3>
		<p class="mt-1 text-sm text-text-muted" style="font-family: var(--font-body);">
			Estimation indicative pour {answers.serviceLabel.toLowerCase()} à {answers.commune}.
		</p>
	</div>

	{#if quote.available}
		<div class="bg-secondary px-8 py-10 text-center">
			<p
				class="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-text-muted"
				style="font-family: var(--font-body);"
			>
				Fourchette estimée
			</p>
			<p
				class="mt-3 text-[clamp(3rem,10vw,5rem)] font-normal leading-none text-primary"
				style="font-family: var(--font-heading); font-variation-settings: 'opsz' 72;"
			>
				{formatChf(quote.median)}
			</p>
			<p class="mt-3 text-sm text-text-muted" style="font-family: var(--font-body);">
				Entre <strong class="text-text">{formatChf(quote.min)}</strong> et
				<strong class="text-text">{formatChf(quote.max)}</strong>
			</p>

			{#if quote.breakdown.length > 0}
				<dl class="mx-auto mt-6 max-w-xs space-y-2 border-t border-text/10 pt-4 text-left">
					{#each quote.breakdown as line, i (i)}
						<div class="flex items-baseline justify-between gap-4 text-sm">
							<dt class="text-text-muted" style="font-family: var(--font-body);">{line.label}</dt>
							<dd class="font-medium text-text" style="font-family: var(--font-body);">
								{line.value}
							</dd>
						</div>
					{/each}
				</dl>
			{/if}
		</div>

		<details bind:open={detailsOpen}>
			<summary
				class="flex cursor-pointer items-center justify-between border-t border-text/10 py-4 text-sm font-medium text-text-muted transition-colors hover:text-primary"
				style="font-family: var(--font-body);"
			>
				<span>Pourquoi ce prix ?</span>
				<svg
					class="chevron h-4 w-4 transition-transform duration-200"
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
			<ul class="space-y-4 pb-4 pt-2">
				{#each explanationItems as item (item.num)}
					<li class="flex gap-3 text-sm">
						<span
							class="mt-0.5 shrink-0 text-xs font-semibold text-accent"
							style="font-family: var(--font-body);"
						>
							{item.num}.
						</span>
						<div>
							<p class="font-medium text-text" style="font-family: var(--font-body);">
								{item.title}
							</p>
							<p class="mt-0.5 text-text-muted" style="font-family: var(--font-body);">
								{item.text}
							</p>
						</div>
					</li>
				{/each}
			</ul>
		</details>

		<p class="text-center text-xs italic text-text-muted" style="font-family: var(--font-body);">
			{quote.disclaimer}
		</p>
	{:else}
		<div class="bg-secondary px-8 py-10 text-center">
			<p class="text-sm text-text" style="font-family: var(--font-body);">{quote.disclaimer}</p>
		</div>
	{/if}

	<div class="grid gap-3 md:grid-cols-[1.5fr_1fr]">
		<a
			href={phoneHref}
			class="flex items-center justify-center gap-2 bg-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-opacity duration-200 hover:opacity-90"
			style="font-family: var(--font-body);"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-4 w-4"
			>
				<path
					fill-rule="evenodd"
					d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.328-.43A13.022 13.022 0 0 1 2.43 8.328 13.019 13.019 0 0 1 2 5V3.5Z"
					clip-rule="evenodd"
				/>
			</svg>
			Appeler {config.business.ownerFirstName || config.business.name}
		</a>

		<button
			type="button"
			onclick={downloadPdf}
			disabled={isGenerating || !quote.available}
			class="flex items-center justify-center gap-2 border border-primary px-6 py-4 text-xs font-medium uppercase tracking-[0.1em] transition-all duration-200
				{quote.available && !isGenerating
				? 'cursor-pointer text-primary hover:bg-primary hover:text-white'
				: 'cursor-not-allowed border-text/20 text-text-muted'}"
			style="font-family: var(--font-body);"
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
			{isGenerating ? 'Génération…' : 'PDF'}
		</button>
	</div>

	{#if pdfError}
		<p class="text-center text-sm text-red-500" style="font-family: var(--font-body);">
			{pdfError}
		</p>
	{/if}

	<div class="border-t border-text/10 pt-6 text-center">
		<p class="text-sm text-text-muted" style="font-family: var(--font-body);">
			{config.business.name} vous contacte sous
			<strong class="text-primary">48 heures</strong> pour confirmer le devis sur place.
		</p>
		<p class="mt-1 text-xs text-text-muted" style="font-family: var(--font-body);">
			Contact direct : <a href={phoneHref} class="underline underline-offset-2"
				>{config.business.phone}</a
			>
		</p>
	</div>

	{#if onReset}
		<div class="text-center">
			<button
				type="button"
				onclick={onReset}
				class="text-xs text-text-muted underline-offset-4 transition-colors hover:text-primary hover:underline"
				style="font-family: var(--font-body);"
			>
				Refaire un devis
			</button>
		</div>
	{/if}
</div>

<div class="pdf-offscreen" aria-hidden="true">
	<div bind:this={documentRef}>
		<QuoteDocument {config} {answers} {quote} />
	</div>
</div>

<style>
	details[open] .chevron {
		transform: rotate(180deg);
	}

	details summary::-webkit-details-marker {
		display: none;
	}

	details summary {
		list-style: none;
	}

	.pdf-offscreen {
		position: absolute;
		left: -9999px;
		top: 0;
		pointer-events: none;
	}
</style>
