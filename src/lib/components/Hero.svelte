<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';

	let { config }: { config: ProspectConfig } = $props();

	let mainZone = $derived(config.credibility.zones[0] ?? 'votre commune');
	let prefix = $derived(config.heroPrefix ?? 'à');
	let subline = $derived(config.heroSubline ?? config.business.tagline);
</script>

<section
	class="relative flex min-h-[92vh] flex-col justify-end pb-20 pt-32"
	style="background-image: url('{config.heroImage}'); background-size: cover; background-position: center;"
>
	<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15"></div>
	<div class="absolute inset-0 -z-10 bg-primary"></div>

	<div class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-12">
		<h1
			class="max-w-[20ch] text-[clamp(2.75rem,7.5vw,6rem)] font-medium leading-[1.05] text-white"
			style="text-shadow: 0 2px 32px oklch(0% 0 0 / 0.3);"
		>
			Votre paysagiste<br />
			<span class="italic" style="color: #E8F0CA;">{prefix} {mainZone}</span> - {subline}
		</h1>

		<a
			href="#devis"
			class="mt-10 inline-flex cursor-pointer items-center gap-3 bg-white/30 px-10 py-5 text-base font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/40"
			style="font-family: var(--font-body);"
		>
			<span>Obtenir un devis personnalisé</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-5 w-5"
			>
				<path
					fill-rule="evenodd"
					d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
					clip-rule="evenodd"
				/>
			</svg>
		</a>
	</div>
</section>
