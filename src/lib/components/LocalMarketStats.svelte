<script lang="ts">
	import type { LocalMarketConfig } from '$types/prospect';

	let { localMarket, mainZone }: { localMarket: LocalMarketConfig; mainZone: string } = $props();

	let captureRatePct = $derived(Math.round(localMarket.topThreeCaptureRate * 100));
</script>

<div class="annotation-content">
	<p class="lead">
		Sur <strong>{mainZone}</strong>, ~<strong>{localMarket.monthlySearches}</strong>
		personnes par mois cherchent un paysagiste sur Google.
	</p>

	<div class="kpi-grid">
		<div class="kpi">
			<span class="kpi-value">{localMarket.monthlySearches}</span>
			<span class="kpi-label">recherches / mois</span>
		</div>
		<div class="kpi">
			<span class="kpi-value">{captureRatePct}%</span>
			<span class="kpi-label">captés top&nbsp;3</span>
		</div>
		<div class="kpi accent">
			<span class="kpi-value">0%</span>
			<span class="kpi-label">ta part</span>
		</div>
	</div>

	<p class="aside">
		La moitié appelle l'un des 3 paysagistes affichés sur la carte Google. Tu n'es pas dedans.
	</p>
</div>

<style>
	.annotation-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.lead {
		margin: 0;
	}

	.lead strong {
		color: oklch(96% 0.005 250);
		font-weight: 600;
	}

	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		padding: 0.75rem 0;
		border-top: 1px solid oklch(100% 0 0 / 0.06);
		border-bottom: 1px solid oklch(100% 0 0 / 0.06);
	}

	.kpi {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.kpi-value {
		font-size: 1.375rem;
		font-weight: 600;
		color: oklch(96% 0.005 250);
		line-height: 1.1;
	}

	.kpi.accent .kpi-value {
		color: #00d9a3;
	}

	.kpi-label {
		font-size: 0.6875rem;
		color: oklch(65% 0.005 250);
		letter-spacing: 0.02em;
	}

	.aside {
		margin: 0;
		font-size: 0.8125rem;
		color: oklch(75% 0.005 250);
		font-style: italic;
	}
</style>
