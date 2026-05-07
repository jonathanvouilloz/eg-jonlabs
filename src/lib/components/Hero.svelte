<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';

	let {
		config,
		showTransparencyNote = false
	}: { config: ProspectConfig; showTransparencyNote?: boolean } = $props();
</script>

<section
	class="relative flex min-h-[92vh] flex-col justify-end pb-20 pt-32"
	style="background-image: url('{config.heroImage}'); background-size: cover; background-position: center;"
>
	<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15"></div>
	<div class="absolute inset-0 -z-10 bg-primary"></div>

	<div class="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-12">
		<p
			class="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-white/65"
			style="font-family: var(--font-body);"
		>
			{config.business.tagline}
		</p>

		<h1
			class="max-w-[14ch] text-[clamp(3rem,8vw,6.5rem)] leading-[1.02] text-white"
			style="text-shadow: 0 2px 32px oklch(0% 0 0 / 0.3);"
		>
			Votre jardin mérite un expert
		</h1>

		<a
			href="#devis"
			class="mt-10 inline-flex cursor-pointer items-center gap-3 bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-primary transition-opacity duration-200 hover:opacity-90"
			style="font-family: var(--font-body);"
		>
			<span>Démarrer la consultation</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-4 w-4"
			>
				<path
					fill-rule="evenodd"
					d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
					clip-rule="evenodd"
				/>
			</svg>
		</a>

		{#if showTransparencyNote}
			<p
				class="mt-8 max-w-xl text-xs italic leading-relaxed text-white/55"
				style="font-family: var(--font-body);"
			>
				Aperçu : structure et identité construites. Tes vraies photos s'intègrent en 1h une fois
				qu'on attaque.
			</p>
		{/if}
	</div>
</section>
