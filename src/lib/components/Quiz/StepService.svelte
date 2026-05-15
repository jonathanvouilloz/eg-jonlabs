<script lang="ts">
	import type { ProspectService } from '$types/prospect';

	const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
		entretien:
			'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=600&auto=format&fit=crop',
		'taille-haies':
			'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop',
		'creation-jardin':
			'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=600&auto=format&fit=crop',
		'contrat-annuel':
			'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop'
	};

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

	function resolveImage(service: ProspectService): string | null {
		return service.image ?? DEFAULT_SERVICE_IMAGES[service.id] ?? null;
	}
</script>

<div>
	<h3 class="mb-6 text-xl font-normal text-text">Quel service vous intéresse ?</h3>
	<div class="grid grid-cols-2 gap-3">
		{#each activeServices as service (service.id)}
			{@const imageSrc = resolveImage(service)}
			<button
				type="button"
				class="group relative aspect-[4/3] cursor-pointer overflow-hidden text-left transition-all duration-200
					{selectedId === service.id ? 'ring-2 ring-accent ring-offset-1' : 'hover:opacity-95'}"
				onclick={() => onSelect(service.id, service.label)}
			>
				{#if imageSrc}
					<img
						src={imageSrc}
						alt={service.label}
						class="service-image absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
						loading="lazy"
					/>
				{:else}
					<div class="absolute inset-0 bg-secondary"></div>
				{/if}
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
				></div>
				<div class="absolute inset-x-0 bottom-0 p-4">
					<span
						class="text-sm font-semibold uppercase tracking-[0.08em] text-white"
						style="font-family: var(--font-body);"
					>
						{service.label}
					</span>
				</div>
				{#if selectedId === service.id}
					<div
						class="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center bg-accent"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="h-3 w-3 text-white"
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
	<p class="mt-4 text-xs text-text-muted">Sélectionnez pour continuer</p>
</div>

<style>
	.service-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: none;
		object-fit: cover;
	}
</style>
