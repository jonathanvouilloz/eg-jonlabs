<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';

	let { credibility }: { credibility: ProspectConfig['credibility'] } = $props();
</script>

<section class="bg-secondary py-6 px-4">
	<div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center md:grid-cols-3">
		<!-- Années d'expérience -->
		<div class="flex flex-col items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-primary">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
			</svg>
			<p class="text-xl font-bold text-primary">{credibility.yearsExperience} ans</p>
			<p class="text-sm text-text-muted">d'expérience</p>
		</div>

		<!-- Note Google ou chantiers -->
		{#if credibility.googleRating}
			<div class="flex flex-col items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-primary">
					<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
				</svg>
				<p class="text-xl font-bold text-primary">
					{credibility.googleRating}/5
				</p>
				<p class="text-sm text-text-muted">
					sur Google{#if credibility.googleReviewsCount}&nbsp;({credibility.googleReviewsCount} avis){/if}
				</p>
			</div>
		{:else if credibility.chantiersCount}
			<div class="flex flex-col items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-primary">
					<path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.193-.14 1.743" />
				</svg>
				<p class="text-xl font-bold text-primary">{credibility.chantiersCount}+</p>
				<p class="text-sm text-text-muted">chantiers réalisés</p>
			</div>
		{/if}

		<!-- Rayon d'intervention -->
		<div class="flex flex-col items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-primary">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
			</svg>
			<p class="text-xl font-bold text-primary">{credibility.radiusKm} km</p>
			<p class="text-sm text-text-muted">
				autour de {credibility.zones[0]}
			</p>
		</div>
	</div>
</section>
