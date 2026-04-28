<script lang="ts">
	import Header from '$components/Header.svelte';
	import Hero from '$components/Hero.svelte';
	import Reassurance from '$components/Reassurance.svelte';
	import Quiz from '$components/Quiz/Quiz.svelte';
	import Testimonials from '$components/Testimonials.svelte';
	import InterventionMap from '$components/InterventionMap.svelte';
	import Footer from '$components/Footer.svelte';
	import { generateThemeStyle } from '$utils/theme';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let config = $derived(data.config);
	let themeStyle = $derived(generateThemeStyle(config.branding));
</script>

<svelte:head>
	<title>Devis {config.business.name} — Votre jardin mérite un expert</title>
	<meta
		name="description"
		content="Recevez un devis gratuit de {config.business.name} en 2 minutes. {config.business.tagline}."
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div style={themeStyle}>
	<Header {config} />
	<main>
		<Hero {config} />
		<Reassurance credibility={config.credibility} />
		<Quiz {config} />
		{#if config.testimonials.length > 0}
			<Testimonials testimonials={config.testimonials} />
		{/if}
		<InterventionMap credibility={config.credibility} businessName={config.business.name} />
	</main>
	<Footer businessName={config.business.name} />
</div>
