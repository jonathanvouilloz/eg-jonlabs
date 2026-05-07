<script lang="ts">
	let { communes }: { communes: string[] } = $props();

	let mainCommune = $derived(communes[0] ?? 'ta commune');
</script>

<div class="annotation-content">
	<p class="lead">
		<strong>Le site seul ne suffit pas.</strong> Il faut le système autour pour faire monter ta fiche
		sur Google.
	</p>

	<ol class="points">
		<li>
			<span class="num">1</span>
			<span class="txt"
				>Une page par commune que tu desserts. Chacune optimisée pour "paysagiste {mainCommune}".</span
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
		color: #0a0a0a;
		font-weight: 600;
	}

	.points {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		padding-top: 0.875rem;
		border-top: 1px solid #e5e5e5;
	}

	.points li {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.num {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 9999px;
		background: #ecfdf5;
		color: #00b88a;
		font-weight: 600;
		font-size: 0.75rem;
		flex-shrink: 0;
	}

	.txt strong {
		color: #0a0a0a;
		font-weight: 600;
	}
</style>
