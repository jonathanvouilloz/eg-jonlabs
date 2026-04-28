<script lang="ts">
	import type { ProspectService } from '$types/prospect';

	let {
		services,
		selectedId,
		onSelect
	}: {
		services: ProspectService[];
		selectedId: string;
		onSelect: (id: string, label: string) => void;
	} = $props();

	let activeServices = $derived(services.filter((s) => s.active));
</script>

<div>
	<h3 class="mb-4 text-xl font-semibold">Quel service vous intéresse ?</h3>
	<div class="grid grid-cols-2 gap-3">
		{#each activeServices as service (service.id)}
			<button
				type="button"
				class="group relative aspect-[4/3] cursor-pointer overflow-hidden border-2 text-left transition-all duration-200
					{selectedId === service.id
					? 'border-primary shadow-lg ring-2 ring-primary/30'
					: 'border-gray-200 hover:border-primary/40'}"
				onclick={() => onSelect(service.id, service.label)}
			>
				{#if service.image}
					<img
						src={service.image}
						alt={service.label}
						class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
					/>
				{:else}
					<div class="absolute inset-0 bg-secondary"></div>
				{/if}
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-all duration-200 group-hover:from-black/60
					{selectedId === service.id ? 'from-black/60' : ''}"
				></div>
				<div class="absolute inset-x-0 bottom-0 p-5">
					<span class="text-xl font-semibold text-white drop-shadow-md">{service.label}</span>
				</div>
				{#if selectedId === service.id}
					<div
						class="absolute top-3 right-3 flex h-6 w-6 items-center justify-center bg-primary text-white"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="h-4 w-4"
						>
							<path
								fill-rule="evenodd"
								d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				{/if}
			</button>
		{/each}
	</div>
</div>
