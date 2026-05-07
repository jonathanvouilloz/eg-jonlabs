<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';

	let { credibility }: { credibility: ProspectConfig['credibility'] } = $props();
</script>

<section class="bg-primary px-6 py-16 md:px-12">
	<div class="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-3">
		<div class="flex flex-col gap-2">
			<p
				class="text-[clamp(2.5rem,5vw,3.5rem)] font-normal leading-none text-accent"
				style="font-family: var(--font-heading); font-variation-settings: 'opsz' 48;"
			>
				{credibility.yearsExperience}
			</p>
			<p class="text-sm font-medium uppercase tracking-[0.12em] text-white/50">ans d'expérience</p>
		</div>

		{#if credibility.googleRating}
			<div class="flex flex-col gap-2">
				<p
					class="text-[clamp(2.5rem,5vw,3.5rem)] font-normal leading-none text-accent"
					style="font-family: var(--font-heading); font-variation-settings: 'opsz' 48;"
				>
					{credibility.googleRating}<span class="text-2xl text-white/40">/5</span>
				</p>
				<p class="text-sm font-medium uppercase tracking-[0.12em] text-white/50">
					sur Google{#if credibility.googleReviewsCount}&nbsp;({credibility.googleReviewsCount} avis){/if}
				</p>
			</div>
		{:else if credibility.chantiersCount}
			<div class="flex flex-col gap-2">
				<p
					class="text-[clamp(2.5rem,5vw,3.5rem)] font-normal leading-none text-accent"
					style="font-family: var(--font-heading); font-variation-settings: 'opsz' 48;"
				>
					{credibility.chantiersCount}+
				</p>
				<p class="text-sm font-medium uppercase tracking-[0.12em] text-white/50">
					chantiers réalisés
				</p>
			</div>
		{/if}

		<div class="flex flex-col gap-2">
			<p
				class="text-[clamp(2.5rem,5vw,3.5rem)] font-normal leading-none text-accent"
				style="font-family: var(--font-heading); font-variation-settings: 'opsz' 48;"
			>
				{credibility.radiusKm}
			</p>
			<p class="text-sm font-medium uppercase tracking-[0.12em] text-white/50">
				km autour de {credibility.zones[0]}
			</p>
		</div>
	</div>
</section>
