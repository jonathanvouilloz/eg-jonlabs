<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';

	let { config }: { config: ProspectConfig } = $props();
</script>

<section
	class="relative flex min-h-[50vh] items-end pb-16 pt-16 md:min-h-[55vh]"
	style="background-image: url('{config.heroImage}'); background-size: cover; background-position: center;"
>
	<!-- Gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>

	<!-- Fallback si pas d'image -->
	<div class="absolute inset-0 -z-10 bg-gradient-to-br from-primary to-primary-light"></div>

	<div
		class="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center text-white"
	>
		<h1
			class="text-balance text-5xl italic leading-[1.05] text-white drop-shadow-lg md:text-6xl lg:text-7xl"
			style="font-family: var(--font-heading); text-shadow: 0 2px 24px rgba(0, 0, 0, 0.45);"
		>
			Votre jardin mérite un expert
		</h1>

		<p class="mt-6 text-lg text-white/85 drop-shadow md:text-xl">
			{config.business.tagline}
		</p>

		<a
			href="#devis"
			class="mt-8 inline-flex cursor-pointer items-center gap-2 bg-white/20 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
		>
			<span>Démarrer mon devis gratuit</span>
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
