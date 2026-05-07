<script lang="ts">
	import type { TimingValue } from '$stores/quizState.svelte';
	import { TIMING_LABELS } from '$stores/quizState.svelte';
	import { COMMUNES_SUISSE_ROMANDE } from '$lib/data/communes';

	let {
		timing,
		commune,
		zones = [],
		onTimingSelect,
		onCommuneChange
	}: {
		timing: TimingValue | '';
		commune: string;
		zones?: string[];
		onTimingSelect: (value: TimingValue) => void;
		onCommuneChange: (value: string) => void;
	} = $props();

	let showSuggestions = $state(false);
	let activeIndex = $state(-1);
	let localCommune = $state('');

	$effect(() => {
		localCommune = commune;
	});

	let allCommunes = $derived.by(() => {
		const zoneSet = new Set(zones);
		const others = COMMUNES_SUISSE_ROMANDE.filter((c) => !zoneSet.has(c));
		return [...zones, ...others];
	});

	let suggestions = $derived.by(() => {
		if (!localCommune || localCommune.length < 2) return [];
		const query = localCommune.toLowerCase();
		return allCommunes.filter((c) => c.toLowerCase().includes(query)).slice(0, 5);
	});

	const timingOptions: TimingValue[] = ['urgent', 'few_weeks', 'this_season', 'planning'];

	function handleInput(value: string) {
		localCommune = value;
		onCommuneChange(value);
		showSuggestions = true;
		activeIndex = -1;
	}

	function selectSuggestion(value: string) {
		localCommune = value;
		onCommuneChange(value);
		showSuggestions = false;
		activeIndex = -1;
	}

	function handleKeydown(e: KeyboardEvent) {
		const list = suggestions;
		if (!list.length || !showSuggestions) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % list.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = activeIndex <= 0 ? list.length - 1 : activeIndex - 1;
		} else if (e.key === 'Enter' && activeIndex >= 0) {
			e.preventDefault();
			selectSuggestion(list[activeIndex]);
		} else if (e.key === 'Escape') {
			showSuggestions = false;
		}
	}
</script>

<div>
	<h3 class="mb-6 text-xl font-normal text-text">Quand et où ?</h3>

	<p
		class="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-text-muted"
		style="font-family: var(--font-body);"
	>
		Votre délai
	</p>
	<div class="mb-8 flex flex-col gap-2">
		{#each timingOptions as t (t)}
			<button
				type="button"
				class="flex items-center justify-between border px-5 py-3.5 text-left transition-all duration-150
					{timing === t
					? 'border-primary bg-primary text-white'
					: 'border-text/10 bg-bg hover:border-primary/40 hover:bg-secondary/60'}"
				onclick={() => onTimingSelect(t)}
			>
				<span
					class="text-sm font-medium {timing === t ? 'text-white' : 'text-text'}"
					style="font-family: var(--font-body);"
				>
					{TIMING_LABELS[t]}
				</span>
				{#if timing === t}
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

	<label class="block">
		<span
			class="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-text-muted"
			style="font-family: var(--font-body);"
		>
			Votre commune
		</span>
		<div class="relative">
			<input
				type="text"
				bind:value={localCommune}
				oninput={(e) => handleInput(e.currentTarget.value)}
				onfocus={() => (showSuggestions = true)}
				onblur={() => setTimeout(() => (showSuggestions = false), 150)}
				onkeydown={handleKeydown}
				placeholder="Ex : Lausanne, Pully, Morges…"
				autocomplete="off"
				class="w-full border border-text/15 bg-bg px-4 py-3.5 text-sm text-text outline-none transition-all duration-150 focus:border-primary"
				style="font-family: var(--font-body);"
			/>
			{#if showSuggestions && suggestions.length > 0}
				<ul class="absolute z-20 mt-0.5 w-full border border-text/10 bg-bg shadow-md">
					{#each suggestions as suggestion, i (suggestion)}
						<li>
							<button
								type="button"
								class="w-full px-4 py-2.5 text-left text-sm transition-colors
									{i === activeIndex ? 'bg-primary/8 text-primary' : 'hover:bg-secondary/60'}"
								style="font-family: var(--font-body);"
								onmousedown={() => selectSuggestion(suggestion)}
							>
								{suggestion}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</label>
</div>
