<script lang="ts">
	import type { SurfaceValue } from '$stores/quizState.svelte';
	import { SURFACE_LABELS } from '$stores/quizState.svelte';

	let {
		selected,
		onSelect
	}: {
		selected: SurfaceValue | '';
		onSelect: (value: SurfaceValue) => void;
	} = $props();

	const options: { value: SurfaceValue; hint: string }[] = [
		{ value: 'less_100', hint: 'Petit jardin, cour, terrasse' },
		{ value: '100_300', hint: 'Jardin de villa standard' },
		{ value: '300_800', hint: 'Grande propriété' },
		{ value: 'more_800', hint: 'Domaine, parc privé' },
		{ value: 'unknown', hint: "Je n'ai pas mesuré" }
	];
</script>

<div>
	<h3 class="mb-6 text-xl font-normal text-text">Quelle est la surface approximative ?</h3>
	<div class="flex flex-col gap-2">
		{#each options as opt (opt.value)}
			<button
				type="button"
				class="flex items-center justify-between border px-5 py-4 text-left transition-all duration-150
					{selected === opt.value
					? 'border-primary bg-primary text-white'
					: 'border-text/10 bg-bg hover:border-primary/40 hover:bg-secondary/60'}"
				onclick={() => onSelect(opt.value)}
			>
				<div>
					<span
						class="block text-sm font-medium {selected === opt.value ? 'text-white' : 'text-text'}"
						style="font-family: var(--font-body);"
					>
						{SURFACE_LABELS[opt.value]}
					</span>
					<span
						class="block text-xs {selected === opt.value ? 'text-white/70' : 'text-text-muted'}"
						style="font-family: var(--font-body);"
					>
						{opt.hint}
					</span>
				</div>
				{#if selected === opt.value}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-4 w-4 shrink-0 text-white"
					>
						<path
							fill-rule="evenodd"
							d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</button>
		{/each}
	</div>
</div>
