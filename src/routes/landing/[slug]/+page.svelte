<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let config = $derived(data.config);
	let salesPage = $derived(config.salesPage);

	let prenom = $derived(config.business.ownerFirstName || '');
	let entreprise = $derived(config.business.name);
	let observation = $derived(salesPage?.subtitleObservation ?? '');
	let screenshotUrl = $derived(salesPage?.screenshotUrl ?? '');
	let loomVideoId = $derived(salesPage?.loomVideoId ?? '');
	let siteUrl = $derived(`/atelier/${config.slug}`);
</script>

<svelte:head>
	<title>Le site que j'ai préparé pour {entreprise}</title>
	<meta name="description" content={`Un aperçu personnalisé du site préparé pour ${entreprise}.`} />
	<meta name="robots" content="noindex, nofollow" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="page">
	<section class="hero">
		<h1 class="title">
			Le site que j'ai préparé pour <span class="title-accent">{entreprise}</span>
		</h1>
		<p class="subtitle">
			{#if prenom}Salut {prenom}.{/if} J'ai construit la structure, tes couleurs, ton logo{#if observation}
				{observation}{/if} et le formulaire qui pré-qualifie tes demandes. Clique pour le voir en vrai.
		</p>
	</section>

	<section class="preview">
		{#if screenshotUrl}
			<a href={siteUrl} class="screenshot-link">
				<img
					src={screenshotUrl}
					alt={`Aperçu du site préparé pour ${entreprise}`}
					class="screenshot"
				/>
			</a>
		{:else}
			<a href={siteUrl} class="screenshot-link screenshot-placeholder">
				<div class="screenshot-placeholder-text">
					Aperçu du site
					<small>(screenshot à ajouter dans static/screenshots/{config.slug}.png)</small>
				</div>
			</a>
		{/if}

		<a href={siteUrl} class="cta">
			Voir ton site
			<span class="cta-arrow">→</span>
		</a>

		{#if loomVideoId}
			<a href="#video-section" class="scroll-hint">
				<span>2 min de contexte sur la démarche</span>
				<span class="scroll-hint-arrow" aria-hidden="true">↓</span>
			</a>
		{/if}
	</section>

	{#if loomVideoId}
		<section id="video-section" class="video-section">
			<p class="video-intro">
				Avant de cliquer, regarde 2 minutes ce que j'ai fait pour Léo, avocat à Genève. Ça te
				montrera ce qu'il y a derrière le site.
			</p>

			<div class="video-wrapper">
				<iframe
					src={`https://www.loom.com/embed/${loomVideoId}`}
					frameborder="0"
					allowfullscreen
					class="video-iframe"
					title="Étude de cas Léo Lecureux"
				></iframe>
			</div>

			<a href={siteUrl} class="cta">
				Voir ton site
				<span class="cta-arrow">→</span>
			</a>
		</section>
	{/if}

	<footer class="footer">
		<p>
			Une question : <a href="mailto:jonathan.vouilloz@gmail.com">jonathan.vouilloz@gmail.com</a>
		</p>
		<p class="footer-brand">Jon Labs Local</p>
	</footer>
</main>

<style>
	:root {
		--landing-bg: #ffffff;
		--landing-text: #0a0a0a;
		--landing-text-muted: #525252;
		--landing-border: #e5e5e5;
		--landing-accent: #00d9a3;
		--landing-accent-hover: #00b88a;
		--landing-font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		--landing-max-width: 720px;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		font-family: var(--landing-font);
		background-color: var(--landing-bg);
		color: var(--landing-text);
		line-height: 1.5;
		letter-spacing: 0;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.page {
		max-width: var(--landing-max-width);
		margin: 0 auto;
		padding: 3rem 1.5rem 4rem;
	}

	.hero {
		margin-bottom: 2.25rem;
		animation: fadeInUp 0.6s ease-out;
	}

	.title {
		font-family: var(--landing-font);
		font-size: clamp(2rem, 5vw, 2.8125rem);
		font-weight: 500;
		line-height: 1.2;
		letter-spacing: -0.025em;
		margin-bottom: 1.5rem;
	}

	.title-accent {
		display: block;
		font-weight: 600;
		color: var(--landing-accent);
	}

	.subtitle {
		font-size: 1.0625rem;
		color: var(--landing-text-muted);
		line-height: 1.6;
		letter-spacing: 0;
		max-width: 600px;
	}

	.preview {
		margin-bottom: 4rem;
		animation: fadeInUp 0.6s ease-out 0.15s backwards;
	}

	.screenshot-link {
		display: block;
		margin-bottom: 1.75rem;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--landing-border);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.screenshot-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
	}

	.screenshot {
		display: block;
		width: 100%;
		height: auto;
	}

	.screenshot-placeholder {
		aspect-ratio: 16 / 10;
		background-color: #fafafa;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		color: var(--landing-text-muted);
	}

	.screenshot-placeholder-text {
		text-align: center;
		font-size: 1rem;
		font-weight: 500;
	}

	.screenshot-placeholder-text small {
		display: block;
		margin-top: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 400;
		opacity: 0.7;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background-color: var(--landing-accent);
		color: var(--landing-text);
		text-decoration: none;
		padding: 0.875rem 1.75rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0;
		transition:
			background-color 0.2s ease,
			transform 0.1s ease;
	}

	.cta:hover {
		background-color: var(--landing-accent-hover);
	}

	.cta:active {
		transform: scale(0.98);
	}

	.cta-arrow {
		transition: transform 0.2s ease;
	}

	.cta:hover .cta-arrow {
		transform: translateX(4px);
	}

	.scroll-hint {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: 1rem;
		color: var(--landing-text-muted);
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 400;
		transition: color 0.2s ease;
	}

	.scroll-hint:hover {
		color: var(--landing-text);
	}

	.scroll-hint-arrow {
		display: inline-block;
		animation: bounceDown 1.8s ease-in-out infinite;
	}

	@keyframes bounceDown {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(4px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-hint-arrow {
			animation: none;
		}
	}

	.video-section {
		margin-bottom: 6rem;
		animation: fadeInUp 0.6s ease-out 0.3s backwards;
	}

	.video-intro {
		font-size: 1rem;
		color: var(--landing-text-muted);
		margin-bottom: 1.5rem;
		max-width: 600px;
	}

	.video-wrapper {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%;
		margin-bottom: 2.5rem;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--landing-border);
		background-color: #fafafa;
	}

	.video-iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.footer {
		padding-top: 2.5rem;
		border-top: 1px solid var(--landing-border);
		font-size: 0.875rem;
		color: var(--landing-text-muted);
	}

	.footer p {
		margin-bottom: 0.5rem;
	}

	.footer a {
		color: var(--landing-text);
		text-decoration: none;
		border-bottom: 1px solid var(--landing-border);
		transition: border-color 0.2s ease;
	}

	.footer a:hover {
		border-color: var(--landing-text);
	}

	.footer-brand {
		font-size: 0.8125rem;
		opacity: 0.6;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 640px) {
		.page {
			padding: 2.5rem 1.5rem 2.5rem;
		}

		.cta {
			width: 100%;
			justify-content: center;
		}

		.scroll-hint {
			display: flex;
			margin-left: 0;
			margin-top: 1rem;
			justify-content: center;
		}
	}
</style>
