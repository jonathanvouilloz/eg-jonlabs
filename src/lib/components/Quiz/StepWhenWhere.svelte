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

	// Sync prop → local state
	$effect(() => {
		localCommune = commune;
	});

	// Combine prospect zones (priority) with general communes, deduplicated
	let allCommunes = $derived.by(() => {
		const zoneSet = new Set(zones);
		const others = COMMUNES_SUISSE_ROMANDE.filter((c) => !zoneSet.has(c));
		return [...zones, ...others];
	});

	let suggestions = $derived.by(() => {
		if (!localCommune || localCommune.length < 2) return [];
		const query = localCommune.toLowerCase();
		return allCommunes
			.filter((c) => c.toLowerCase().includes(query))
			.slice(0, 5);
	});

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
	<h3 class="mb-4 text-xl font-semibold">Quand et où ?</h3>

	<p class="mb-3 text-sm text-text-muted">Quel est votre délai ?</p>
	<div class="mb-6 flex flex-col gap-2">
		<button
			type="button"
			class="flex items-center gap-3 border-2 px-4 py-3 text-left transition-all duration-200
				{timing === 'urgent' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/40'}"
			onclick={() => onTimingSelect('urgent')}
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 shrink-0 text-primary">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
			</svg>
			<span class="text-sm font-medium">{TIMING_LABELS['urgent']}</span>
		</button>
		<button
			type="button"
			class="flex items-center gap-3 border-2 px-4 py-3 text-left transition-all duration-200
				{timing === 'few_weeks' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/40'}"
			onclick={() => onTimingSelect('few_weeks')}
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 shrink-0 text-primary">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
			</svg>
			<span class="text-sm font-medium">{TIMING_LABELS['few_weeks']}</span>
		</button>
		<button
			type="button"
			class="flex items-center gap-3 border-2 px-4 py-3 text-left transition-all duration-200
				{timing === 'this_season' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/40'}"
			onclick={() => onTimingSelect('this_season')}
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 shrink-0 text-primary">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
			</svg>
			<span class="text-sm font-medium">{TIMING_LABELS['this_season']}</span>
		</button>
		<button
			type="button"
			class="flex items-center gap-3 border-2 px-4 py-3 text-left transition-all duration-200
				{timing === 'planning' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/40'}"
			onclick={() => onTimingSelect('planning')}
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 shrink-0 text-primary">
				<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
			</svg>
			<span class="text-sm font-medium">{TIMING_LABELS['planning']}</span>
		</button>
	</div>

	<label class="block">
		<span class="mb-1 block text-sm text-text-muted">Votre commune</span>
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
				class="w-full border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-primary"
			/>
			{#if showSuggestions && suggestions.length > 0}
				<ul class="absolute z-20 mt-1 w-full border border-gray-200 bg-white shadow-lg">
					{#each suggestions as suggestion, i (suggestion)}
						<li>
							<button
								type="button"
								class="w-full px-4 py-2 text-left text-sm transition-colors
									{i === activeIndex ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}"
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
