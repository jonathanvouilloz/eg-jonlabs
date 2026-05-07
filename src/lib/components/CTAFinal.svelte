<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';

	interface Props {
		config: ProspectConfig;
	}

	let { config }: Props = $props();
</script>

<section class="bg-primary px-6 py-24 md:px-12">
	<div class="mx-auto max-w-2xl text-center">
		<h2
			class="text-3xl font-normal italic text-white md:text-4xl lg:text-5xl"
			style="font-variation-settings: 'opsz' 48;"
		>
			Prêt à donner vie à votre jardin ?
		</h2>
		<p class="mt-4 text-sm text-white/60" style="font-family: var(--font-body);">
			Estimation gratuite. Sans engagement.
		</p>
		<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href="#devis"
				class="inline-flex items-center gap-2 bg-accent px-10 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-opacity duration-200 hover:opacity-90"
				style="font-family: var(--font-body);"
			>
				Démarrer la consultation
			</a>
			<a
				href="tel:{config.business.phone.replace(/\s+/g, '')}"
				class="inline-flex items-center gap-2 border border-white/30 px-8 py-4 text-xs font-medium uppercase tracking-[0.1em] text-white/80 transition-colors duration-200 hover:border-white/60 hover:text-white"
				style="font-family: var(--font-body);"
			>
				<svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.328-.43A13.022 13.022 0 0 1 2.43 8.328 13.019 13.019 0 0 1 2 5V3.5Z"
						clip-rule="evenodd"
					/>
				</svg>
				Appeler directement
			</a>
		</div>
	</div>
</section>
