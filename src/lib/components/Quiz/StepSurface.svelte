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
</script>

<div>
	<h3 class="mb-4 text-xl font-semibold">Quelle est la surface approximative ?</h3>
	<div class="flex flex-col gap-2">
		<button
			type="button"
			class="flex items-center gap-3 border-2 px-4 py-3 text-left transition-all duration-200
				{selected === 'less_100'
				? 'border-primary bg-primary/5'
				: 'border-gray-200 bg-white hover:border-primary/40'}"
			onclick={() => onSelect('less_100')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-5 w-5 shrink-0 text-primary"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
				/>
			</svg>
			<span class="text-sm font-medium">{SURFACE_LABELS['less_100']}</span>
		</button>
		<button
			type="button"
			class="flex items-center gap-3 border-2 px-4 py-3 text-left transition-all duration-200
				{selected === '100_300'
				? 'border-primary bg-primary/5'
				: 'border-gray-200 bg-white hover:border-primary/40'}"
			onclick={() => onSelect('100_300')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-5 w-5 shrink-0 text-primary"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
				/>
			</svg>
			<span class="text-sm font-medium">{SURFACE_LABELS['100_300']}</span>
		</button>
		<button
			type="button"
			class="flex items-center gap-3 border-2 px-4 py-3 text-left transition-all duration-200
				{selected === '300_800'
				? 'border-primary bg-primary/5'
				: 'border-gray-200 bg-white hover:border-primary/40'}"
			onclick={() => onSelect('300_800')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-5 w-5 shrink-0 text-primary"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
				/>
			</svg>
			<span class="text-sm font-medium">{SURFACE_LABELS['300_800']}</span>
		</button>
		<button
			type="button"
			class="flex items-center gap-3 border-2 px-4 py-3 text-left transition-all duration-200
				{selected === 'more_800'
				? 'border-primary bg-primary/5'
				: 'border-gray-200 bg-white hover:border-primary/40'}"
			onclick={() => onSelect('more_800')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-5 w-5 shrink-0 text-primary"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
				/>
			</svg>
			<span class="text-sm font-medium">{SURFACE_LABELS['more_800']}</span>
		</button>
		<button
			type="button"
			class="flex items-center gap-3 border-2 px-4 py-3 text-left transition-all duration-200
				{selected === 'unknown'
				? 'border-primary bg-primary/5'
				: 'border-gray-200 bg-white hover:border-primary/40'}"
			onclick={() => onSelect('unknown')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-5 w-5 shrink-0 text-primary"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
				/>
			</svg>
			<span class="text-sm font-medium">{SURFACE_LABELS['unknown']}</span>
		</button>
	</div>
</div>
