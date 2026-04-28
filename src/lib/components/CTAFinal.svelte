<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';

	interface Props {
		config: ProspectConfig;
	}

	let { config }: Props = $props();
</script>

<section class="bg-primary px-4 py-16 text-white">
	<div class="mx-auto max-w-3xl text-center">
		<h2 class="text-3xl font-bold md:text-4xl" style="font-family: var(--font-heading)">
			Prêt à donner vie à votre projet ?
		</h2>
		<p class="mt-3 text-lg text-white/80">
			Recevez votre estimation en 2 minutes. Sans engagement.
		</p>
		<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href="#devis"
				class="inline-flex items-center gap-2 bg-accent px-8 py-4 text-base font-semibold text-primary transition-all hover:opacity-90"
			>
				<span>Démarrer mon devis</span>
				<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
						clip-rule="evenodd"
					/>
				</svg>
			</a>
			<a
				href="tel:{config.business.phone.replace(/\s+/g, '')}"
				class="inline-flex items-center gap-2 border-2 border-white px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white hover:text-primary"
			>
				<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.328-.43A13.022 13.022 0 0 1 2.43 8.328 13.019 13.019 0 0 1 2 5V3.5Z"
						clip-rule="evenodd"
					/>
				</svg>
				<span>Appeler {config.business.ownerFirstName}</span>
			</a>
		</div>
	</div>
</section>
