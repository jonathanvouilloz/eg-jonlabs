<script lang="ts">
	import type { LocalMarketConfig } from '$types/prospect';

	let { localMarket, mainZone }: { localMarket: LocalMarketConfig; mainZone: string } = $props();

	let captureRatePct = $derived(Math.round(localMarket.topThreeCaptureRate * 100));
</script>

<section class="bg-secondary px-6 py-20 md:px-12">
	<div class="mx-auto max-w-5xl">
		<div class="mb-12">
			<p
				class="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-text-muted"
				style="font-family: var(--font-body);"
			>
				Ta zone aujourd'hui
			</p>
			<h2 class="max-w-3xl text-3xl font-normal text-text md:text-4xl">
				Sur {mainZone} en ce moment, ~{localMarket.monthlySearches} personnes par mois cherchent un paysagiste
				sur Google.
			</h2>
			<p
				class="mt-4 max-w-2xl text-base leading-relaxed text-text-muted"
				style="font-family: var(--font-body);"
			>
				La moitié appelle l'un des 3 affichés sur la carte Google. Ta part actuelle : 0%.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
			<div class="border-l-2 border-primary/30 pl-5">
				<p
					class="text-[clamp(2.25rem,4.5vw,3rem)] font-normal leading-none text-primary"
					style="font-family: var(--font-heading); font-variation-settings: 'opsz' 48;"
				>
					{localMarket.monthlySearches}
				</p>
				<p
					class="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-text-muted"
					style="font-family: var(--font-body);"
				>
					recherches / mois
				</p>
			</div>

			<div class="border-l-2 border-primary/30 pl-5">
				<p
					class="text-[clamp(2.25rem,4.5vw,3rem)] font-normal leading-none text-primary"
					style="font-family: var(--font-heading); font-variation-settings: 'opsz' 48;"
				>
					{captureRatePct}%
				</p>
				<p
					class="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-text-muted"
					style="font-family: var(--font-body);"
				>
					captés par le top 3 Google
				</p>
			</div>

			<div class="border-l-2 border-accent pl-5">
				<p
					class="text-[clamp(2.25rem,4.5vw,3rem)] font-normal leading-none text-accent"
					style="font-family: var(--font-heading); font-variation-settings: 'opsz' 48;"
				>
					0%
				</p>
				<p
					class="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-text-muted"
					style="font-family: var(--font-body);"
				>
					ta part actuelle
				</p>
			</div>
		</div>
	</div>
</section>
