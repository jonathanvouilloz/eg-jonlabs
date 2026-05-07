<script lang="ts">
	let { current, total }: { current: number; total: number } = $props();
	let stepNumber = $derived(current + 1);
</script>

<div class="mb-10 flex items-center gap-3">
	{#each Array(total) as _, i (i)}
		<div
			class="transition-all duration-300 {i < current
				? 'h-1.5 w-6 bg-accent'
				: i === current
					? 'h-1.5 w-10 bg-accent'
					: 'h-1.5 w-6 bg-text/10'}"
		></div>
	{/each}
	<span
		class="ml-1 text-xs font-medium uppercase tracking-[0.14em] text-accent"
		style="font-family: var(--font-body);"
	>
		{stepNumber} / {total}
	</span>
</div>
