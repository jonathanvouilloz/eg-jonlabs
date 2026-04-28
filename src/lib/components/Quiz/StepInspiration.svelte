<script lang="ts">
	import type { InspirationItem } from '$types/prospect';

	let {
		items,
		selectedIds,
		onToggle
	}: {
		items: InspirationItem[];
		selectedIds: string[];
		onToggle: (id: string) => void;
	} = $props();
</script>

<div>
	<h3 class="mb-2 text-lg font-semibold">Qu'est-ce qui vous inspire ?</h3>
	<p class="mb-4 text-sm text-text-muted">Sélectionnez une ou plusieurs images (optionnel)</p>
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
		{#each items as item (item.id)}
			<button
				type="button"
				class="group relative aspect-square overflow-hidden border-2 transition-all duration-200
					{selectedIds.includes(item.id)
					? 'border-primary shadow-md'
					: 'border-gray-200 hover:border-primary/40'}"
				onclick={() => onToggle(item.id)}
			>
				<img
					src={item.image}
					alt={item.label}
					class="h-full w-full object-cover"
					loading="lazy"
				/>
				<span
					class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2 text-xs font-medium text-white"
				>
					{item.label}
				</span>
				{#if selectedIds.includes(item.id)}
					<span
						class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center bg-primary text-white"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
							<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
						</svg>
					</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
