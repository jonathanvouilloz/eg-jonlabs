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

<section class="bg-secondary px-4 py-16">
	<div class="mx-auto max-w-6xl">
		<div class="mb-10 text-center">
			<h2 class="text-3xl font-bold text-primary md:text-4xl">Nos réalisations</h2>
			<p class="mt-2 text-text-muted">Quelques exemples de projets menés par {businessName}.</p>
		</div>

		<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
			{#each realizations as r, i (i)}
				<button
					type="button"
					onclick={() => openAt(i)}
					class="group relative aspect-[4/3] overflow-hidden border border-gray-200 bg-white"
					aria-label="Voir : {r.caption}"
				>
					<img
						src={r.after}
						alt={r.caption}
						loading="lazy"
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<div
						class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3"
					>
						<p class="text-left text-sm font-medium text-white">{r.caption}</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</section>

{#if isOpen && current}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-8"
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
			class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
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
				class="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
			>
				<svg class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
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
				class="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
			>
				<svg class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
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
			<p class="mt-3 text-center text-sm text-white/80">{current.caption}</p>
		</div>
	</div>
{/if}
