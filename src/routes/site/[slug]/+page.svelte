<script lang="ts">
	import Header from '$components/Header.svelte';
	import Hero from '$components/Hero.svelte';
	import Services from '$components/Services.svelte';
	import InterventionMap from '$components/InterventionMap.svelte';
	import Testimonials from '$components/Testimonials.svelte';
	import Realizations from '$components/Realizations.svelte';
	import Quiz from '$components/Quiz/Quiz.svelte';
	import FAQ from '$components/FAQ.svelte';
	import CTAFinal from '$components/CTAFinal.svelte';
	import Footer from '$components/Footer.svelte';
	import MetaAnnotation from '$components/MetaAnnotation.svelte';
	import LocalMarketStats from '$components/LocalMarketStats.svelte';
	import SeoEducation from '$components/SeoEducation.svelte';
	import { generateThemeStyle } from '$utils/theme';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let config = $derived(data.config);
	let themeStyle = $derived(generateThemeStyle(config.branding));
	let mainZone = $derived(config.credibility.zones[0] ?? 'votre commune');
	let communesForSeo = $derived(
		config.communes && config.communes.length > 0 ? config.communes : config.credibility.zones
	);
</script>

<svelte:head>
	<title>{config.business.name} — Paysagiste à {mainZone}</title>
	<meta
		name="description"
		content="{config.business.name} — {config.business
			.tagline}. Création, entretien, taille, aménagement. Devis gratuit."
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div style={themeStyle}>
	<Header {config} />
	<main id="top">
		<Hero {config} />

		<Services services={config.services} />

		<InterventionMap
			credibility={config.credibility}
			businessName={config.business.name}
			communes={config.communes}
			address={config.business.address}
			googleProfileUrl={config.business.googleProfileUrl}
			googleMapsEmbedUrl={config.business.googleMapsEmbedUrl}
		/>

		{#if config.testimonials.length > 0}
			<Testimonials testimonials={config.testimonials} />
		{/if}

		{#if config.realizations.length > 0}
			<Realizations realizations={config.realizations} businessName={config.business.name} />
		{/if}

		{#key config.slug}
			<Quiz {config} />
		{/key}

		{#if config.faq.length > 0}
			<FAQ faq={config.faq} />
		{/if}

		<CTAFinal {config} />
	</main>
	<Footer businessName={config.business.name} />

	{#if config.localMarket}
		<MetaAnnotation anchorSelector="#zones" label="Le marché local en chiffres">
			<LocalMarketStats localMarket={config.localMarket} {mainZone} />
		</MetaAnnotation>
	{/if}

	<MetaAnnotation anchorSelector="#cta-final" label="Comment ça te fait monter sur Google">
		<SeoEducation communes={communesForSeo} />
	</MetaAnnotation>
</div>
