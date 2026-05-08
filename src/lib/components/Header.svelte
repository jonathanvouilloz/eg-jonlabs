<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';

	let { config }: { config: ProspectConfig } = $props();

	let initial = $derived(config.business.name.charAt(0).toUpperCase());
</script>

<header class="fixed left-0 right-0 top-3 z-50 px-3 md:top-5 md:px-6">
	<div
		class="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border border-black/5 bg-white/95 py-2 pl-3 pr-2 shadow-md backdrop-blur-md"
	>
		<a href="#top" class="flex items-center gap-3 pl-1">
			{#if config.business.logoUrl}
				<img
					src={config.business.logoUrl}
					alt={config.business.name}
					class="h-9 w-9 rounded-full object-cover"
				/>
			{:else}
				<div
					class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
					style="font-family: var(--font-body);"
					aria-hidden="true"
				>
					{initial}
				</div>
			{/if}
			<div class="hidden flex-col leading-tight sm:flex">
				<span class="text-[13px] font-semibold text-text" style="font-family: var(--font-body);">
					{config.business.name}
				</span>
				<span class="text-[11px] text-text-muted" style="font-family: var(--font-body);">
					{config.business.tagline}
				</span>
			</div>
		</a>

		<nav
			class="hidden items-center gap-0.5 text-[13px] font-medium text-text-muted lg:flex"
			style="font-family: var(--font-body);"
		>
			<a href="#services" class="rounded-full px-3 py-2 transition-colors hover:bg-black/5"
				>Services</a
			>
			<a href="#zones" class="rounded-full px-3 py-2 transition-colors hover:bg-black/5">Zones</a>
			<a href="#temoignages" class="rounded-full px-3 py-2 transition-colors hover:bg-black/5"
				>Avis</a
			>
			<a href="#realisations" class="rounded-full px-3 py-2 transition-colors hover:bg-black/5"
				>Réalisations</a
			>
			<a href="#faq" class="rounded-full px-3 py-2 transition-colors hover:bg-black/5">FAQ</a>
		</nav>

		<div class="flex items-center gap-2">
			<a
				href="tel:{config.business.phone}"
				class="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium text-text-muted transition-colors hover:bg-black/5 hover:text-text sm:inline-flex"
				style="font-family: var(--font-body);"
				aria-label="Appeler {config.business.name}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-3.5 w-3.5"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z"
						clip-rule="evenodd"
					/>
				</svg>
				<span>{config.business.phone}</span>
			</a>
			<a
				href="#devis"
				class="inline-flex items-center gap-2 rounded-full bg-primary py-1.5 pl-4 pr-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
				style="font-family: var(--font-body);"
			>
				<span>Demander un devis</span>
				<span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-3.5 w-3.5"
					>
						<path
							fill-rule="evenodd"
							d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			</a>
		</div>
	</div>
</header>
