<script lang="ts">
	let { communes }: { communes: string[] } = $props();

	let mainCommune = $derived(communes[0] ?? 'ta commune');
</script>

<div class="annotation-content">
	<p class="lead">
		<strong>Comment ce site te fait monter sur Google.</strong> Le site seul ne suffit pas — il faut le
		système autour.
	</p>

	<ol class="points">
		<li>
			<span class="num">1</span>
			<span class="txt"
				>Une page par commune que tu desserts — chacune optimisée pour "paysagiste {mainCommune}".</span
			>
		</li>
		<li>
			<span class="num">2</span>
			<span class="txt"
				>Articles courts publiés chaque mois pour que Google voie que tu es vivant.</span
			>
		</li>
		<li>
			<span class="num">3</span>
			<span class="txt">Ta fiche Google connectée au site. Les avis renforcent les deux.</span>
		</li>
		<li>
			<span class="num">4</span>
			<span class="txt"
				><strong>50× plus de recherches captées</strong> que tes concurrents qui n'ont qu'une fiche.</span
			>
		</li>
	</ol>
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

	.points {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		padding-top: 0.75rem;
		border-top: 1px solid oklch(100% 0 0 / 0.06);
	}

	.points li {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		font-size: 0.8125rem;
		line-height: 1.5;
	}

	.num {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 9999px;
		background: oklch(100% 0 0 / 0.08);
		color: #00d9a3;
		font-weight: 600;
		font-size: 0.75rem;
		flex-shrink: 0;
	}

	.txt strong {
		color: oklch(96% 0.005 250);
		font-weight: 600;
	}
</style>
