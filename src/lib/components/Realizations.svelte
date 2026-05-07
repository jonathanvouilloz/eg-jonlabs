<script lang="ts">
	import type { Realization } from '$types/prospect';

	interface Props {
		realizations: Realization[];
		businessName: string;
	}

	let { realizations, businessName }: Props = $props();
	let lightboxIndex = $state<number | null>(null);

	const isOpen = $derived(lightboxIndex !== null);
	const current = $derived(lightboxIndex !== null ? realizations[lightboxIndex] : null);

	function openAt(idx: number) {
		lightboxIndex = idx;
	}
	function close() {
		lightboxIndex = null;
	}
	function prev() {
		if (lightboxIndex === null) return;
		lightboxIndex = (lightboxIndex - 1 + realizations.length) % realizations.length;
	}
	function next() {
		if (lightboxIndex === null) return;
		lightboxIndex = (lightboxIndex + 1) % realizations.length;
	}
	function onKey(e: KeyboardEvent) {
		if (!isOpen) return;
		if (e.key === 'Escape') close();
		else if (e.key === 'ArrowLeft') prev();
		else if (e.key === 'ArrowRight') next();
	}
</script>

<svelte:window onkeydown={onKey} />

<section id="realisations" class="scroll-mt-28 bg-primary py-20">
	<div class="mx-auto mb-12 max-w-6xl px-6 md:px-12">
		<p
			class="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-white/50"
			style="font-family: var(--font-body);"
		>
			{businessName}
		</p>
		<h2 class="text-3xl font-normal text-white md:text-4xl">Nos réalisations</h2>
	</div>

	<div class="px-3 md:px-4">
		<div class="columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
			{#each realizations as r, i (i)}
				<button
					type="button"
					onclick={() => openAt(i)}
					class="group relative mb-3 block w-full overflow-hidden break-inside-avoid"
					aria-label="Voir : {r.caption}"
				>
					<img
						src={r.after}
						alt={r.caption}
						loading="lazy"
						class="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					></div>
					<div
						class="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
					>
						<p
							class="text-xs font-medium uppercase tracking-[0.1em] text-white"
							style="font-family: var(--font-body);"
						>
							{r.caption}
						</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</section>

{#if isOpen && current}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-8"
		role="dialog"
		aria-modal="true"
		aria-label="Visionneuse"
		onclick={close}
		onkeydown={onKey}
		tabindex="-1"
	>
		<button
			type="button"
			onclick={close}
			aria-label="Fermer"
			class="absolute right-6 top-6 flex h-10 w-10 items-center justify-center text-white/60 transition hover:text-white"
		>
			<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M4.28 3.22a.75.75 0 0 0-1.06 1.06L8.94 10l-5.72 5.72a.75.75 0 1 0 1.06 1.06L10 11.06l5.72 5.72a.75.75 0 1 0 1.06-1.06L11.06 10l5.72-5.72a.75.75 0 0 0-1.06-1.06L10 8.94 4.28 3.22Z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		{#if realizations.length > 1}
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					prev();
				}}
				aria-label="Précédent"
				class="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
			>
				<svg class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M12.79 5.23a.75.75 0 0 1 0 1.06L8.06 11l4.73 4.73a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.08l5.25-5.25a.75.75 0 0 1 1.06 0Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					next();
				}}
				aria-label="Suivant"
				class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
			>
				<svg class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M7.21 14.77a.75.75 0 0 1 0-1.06L11.94 9l-4.73-4.73a.75.75 0 1 1 1.06-1.06l5.25 5.25a.75.75 0 0 1 0 1.08l-5.25 5.25a.75.75 0 0 1-1.06 0Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		{/if}

		<div
			class="relative max-h-[85vh] max-w-5xl"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<img
				src={current.after}
				alt={current.caption}
				class="block max-h-[85vh] w-auto max-w-full object-contain"
			/>
			<p
				class="mt-3 text-center text-xs font-medium uppercase tracking-[0.1em] text-white/60"
				style="font-family: var(--font-body);"
			>
				{current.caption}
			</p>
		</div>
	</div>
{/if}
