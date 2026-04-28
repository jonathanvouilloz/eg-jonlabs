<script lang="ts">
	let { current, total }: { current: number; total: number } = $props();
	let stepNumber = $derived(current + 1);
	let percent = $derived(total > 1 ? (current / (total - 1)) * 100 : 0);
</script>

<div class="mb-6">
	<div class="mb-2 flex items-center justify-between text-sm text-text-muted">
		<span>Étape {stepNumber} sur {total}</span>
		<span>{Math.round(percent)}%</span>
	</div>
	<div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
		<div
			class="h-full rounded-full bg-primary transition-all duration-500 ease-out"
			style="width: {percent}%"
		></div>
	</div>
</div>
