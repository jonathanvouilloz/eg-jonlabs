<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';
	import type { QuoteResult } from '$types/quote';
	import type { QuizAnswers } from '$stores/quizState.svelte';
	import { formatChf } from '$utils/pricing';

	interface Props {
		config: ProspectConfig;
		answers: QuizAnswers;
		quote: QuoteResult;
	}

	let { config, answers, quote }: Props = $props();

	const today = new Date().toLocaleDateString('fr-CH', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	});

	const fullName = $derived(`${answers.contact.firstName} ${answers.contact.lastName}`.trim());
	const service = $derived(config.services.find((s) => s.id === answers.serviceId));
</script>

<div
	class="quote-document"
	style="
		--doc-primary: {config.branding.primaryColor};
		--doc-secondary: {config.branding.secondaryColor};
		--doc-accent: {config.branding.accentColor};
		--doc-font: {config.branding.fontFamily};
	"
>
	<header class="doc-header">
		<div class="doc-brand">
			{#if config.business.logoUrl}
				<img src={config.business.logoUrl} alt={config.business.name} class="doc-logo" />
			{:else}
				<h1 class="doc-business-name">{config.business.name}</h1>
			{/if}
			<p class="doc-tagline">{config.business.tagline}</p>
		</div>
		<div class="doc-meta">
			<p class="doc-meta-label">Estimation</p>
			<p class="doc-date">{today}</p>
		</div>
	</header>

	<section class="doc-section">
		<h2 class="doc-h2">Pour</h2>
		<div class="doc-client">
			<p class="doc-client-name">{fullName}</p>
			<p class="doc-client-line">{answers.contact.email}</p>
			<p class="doc-client-line">{answers.contact.phone}</p>
			<p class="doc-client-line">{answers.commune}</p>
		</div>
	</section>

	<section class="doc-section">
		<h2 class="doc-h2">Prestation demandée</h2>
		<div class="doc-service">
			<p class="doc-service-label">
				{#if service?.icon}<span class="doc-service-icon">{service.icon}</span>{/if}
				{answers.serviceLabel}
			</p>
			{#if service?.description}
				<p class="doc-service-desc">{service.description}</p>
			{/if}
		</div>
		<dl class="doc-context">
			<div>
				<dt>Surface</dt>
				<dd>{answers.surfaceLabel}</dd>
			</div>
			<div>
				<dt>Délai</dt>
				<dd>{answers.timingLabel}</dd>
			</div>
			<div>
				<dt>Commune</dt>
				<dd>{answers.commune}</dd>
			</div>
		</dl>
	</section>

	{#if quote.available}
		<section class="doc-section doc-quote">
			<h2 class="doc-h2">Estimation indicative</h2>
			<div class="doc-price-block">
				<p class="doc-price-median">{formatChf(quote.median)}</p>
				<p class="doc-price-range">
					Fourchette : {formatChf(quote.min)} – {formatChf(quote.max)}
				</p>
			</div>
			{#if quote.breakdown.length > 0}
				<dl class="doc-breakdown">
					{#each quote.breakdown as line, i (i)}
						<div>
							<dt>{line.label}</dt>
							<dd>{line.value}</dd>
						</div>
					{/each}
				</dl>
			{/if}
		</section>
	{:else}
		<section class="doc-section doc-quote">
			<h2 class="doc-h2">Estimation</h2>
			<p class="doc-no-quote">
				Sans connaître la surface précise, le devis sera établi sur place lors d'une visite
				gratuite.
			</p>
		</section>
	{/if}

	<section class="doc-disclaimer">
		<p>{quote.disclaimer}</p>
	</section>

	<footer class="doc-footer">
		<div>
			<p class="doc-footer-name">{config.business.name}</p>
			<p class="doc-footer-line">{config.business.phone}</p>
			<p class="doc-footer-line">{config.business.email}</p>
		</div>
		<p class="doc-jonlabs">Page créée par Jon Labs · jonlabs.ch</p>
	</footer>
</div>

<style>
	.quote-document {
		width: 794px;
		min-height: 1123px;
		padding: 56px 64px;
		background: #ffffff;
		color: #1a1a1a;
		font-family: var(--doc-font, 'Inter'), system-ui, sans-serif;
		font-size: 14px;
		line-height: 1.5;
		box-sizing: border-box;
	}

	.doc-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		border-bottom: 3px solid var(--doc-primary);
		padding-bottom: 24px;
		margin-bottom: 32px;
	}

	.doc-logo {
		max-height: 56px;
		max-width: 220px;
		object-fit: contain;
	}

	.doc-business-name {
		font-size: 28px;
		font-weight: 700;
		color: var(--doc-primary);
		margin: 0 0 4px 0;
		font-family: var(--doc-font, 'Playfair Display'), serif;
	}

	.doc-tagline {
		font-size: 13px;
		color: #555;
		margin: 0;
	}

	.doc-meta {
		text-align: right;
	}

	.doc-meta-label {
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--doc-primary);
		margin: 0;
		font-weight: 600;
	}

	.doc-date {
		font-size: 14px;
		color: #1a1a1a;
		margin: 4px 0 0 0;
	}

	.doc-section {
		margin-bottom: 24px;
	}

	.doc-h2 {
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--doc-primary);
		font-weight: 600;
		margin: 0 0 12px 0;
		padding-bottom: 6px;
		border-bottom: 1px solid #e5e5e5;
	}

	.doc-client-name {
		font-size: 18px;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: #1a1a1a;
	}

	.doc-client-line {
		margin: 2px 0;
		color: #444;
	}

	.doc-service-label {
		font-size: 18px;
		font-weight: 600;
		margin: 0 0 6px 0;
		color: #1a1a1a;
	}

	.doc-service-icon {
		margin-right: 6px;
	}

	.doc-service-desc {
		color: #444;
		margin: 0 0 16px 0;
	}

	.doc-context {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		background: var(--doc-secondary);
		padding: 16px;
		border-radius: 4px;
		margin: 12px 0 0 0;
	}

	.doc-context > div {
		display: flex;
		flex-direction: column;
	}

	.doc-context dt {
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #777;
		margin-bottom: 2px;
	}

	.doc-context dd {
		margin: 0;
		font-weight: 600;
		color: #1a1a1a;
	}

	.doc-quote {
		background: var(--doc-secondary);
		padding: 24px;
		border-left: 4px solid var(--doc-accent);
	}

	.doc-price-block {
		text-align: center;
		padding: 16px 0;
		border-bottom: 1px solid #e5e5e5;
		margin-bottom: 16px;
	}

	.doc-price-median {
		font-size: 36px;
		font-weight: 700;
		color: var(--doc-primary);
		margin: 0;
		line-height: 1;
		font-family: var(--doc-font, 'Inter'), serif;
	}

	.doc-price-range {
		font-size: 14px;
		color: #555;
		margin: 8px 0 0 0;
	}

	.doc-breakdown {
		margin: 0;
	}

	.doc-breakdown > div {
		display: flex;
		justify-content: space-between;
		padding: 6px 0;
		border-bottom: 1px dashed #ddd;
	}

	.doc-breakdown > div:last-child {
		border-bottom: none;
	}

	.doc-breakdown dt {
		color: #555;
		margin: 0;
	}

	.doc-breakdown dd {
		color: #1a1a1a;
		margin: 0;
		font-weight: 600;
	}

	.doc-no-quote {
		font-size: 14px;
		color: #555;
		margin: 0;
	}

	.doc-disclaimer {
		font-size: 12px;
		color: #777;
		font-style: italic;
		padding: 12px 0;
		border-top: 1px dashed #ccc;
		margin-bottom: 32px;
	}

	.doc-disclaimer p {
		margin: 0;
	}

	.doc-footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding-top: 24px;
		border-top: 2px solid var(--doc-primary);
	}

	.doc-footer-name {
		font-size: 16px;
		font-weight: 700;
		color: var(--doc-primary);
		margin: 0 0 4px 0;
	}

	.doc-footer-line {
		margin: 2px 0;
		color: #444;
		font-size: 13px;
	}

	.doc-jonlabs {
		font-size: 11px;
		color: #aaa;
		margin: 0;
	}
</style>
