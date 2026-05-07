<script lang="ts">
	import type { LocalMarketConfig } from '$types/prospect';

	let { localMarket, mainZone }: { localMarket: LocalMarketConfig; mainZone: string } = $props();

	let captureRatePct = $derived(Math.round(localMarket.topThreeCaptureRate * 100));
</script>

<div class="annotation-content">
	<p class="lead">
		Sur <strong>{mainZone}</strong>, environ
		<strong>{localMarket.monthlySearches}</strong> personnes par mois cherchent un paysagiste sur Google.
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
		color: #0a0a0a;
		font-weight: 600;
	}

	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		padding: 0.875rem 0;
		border-top: 1px solid #e5e5e5;
		border-bottom: 1px solid #e5e5e5;
	}

	.kpi {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.kpi-value {
		font-size: 1.375rem;
		font-weight: 600;
		color: #0a0a0a;
		line-height: 1.1;
	}

	.kpi.accent .kpi-value {
		color: #00b88a;
	}

	.kpi-label {
		font-size: 0.6875rem;
		color: #737373;
		letter-spacing: 0.02em;
	}

	.aside {
		margin: 0;
		font-size: 0.8125rem;
		color: #525252;
		font-style: italic;
	}
</style>
