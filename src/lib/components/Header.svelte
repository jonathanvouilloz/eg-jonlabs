<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';
	import { formatPhone } from '$utils/theme';

	let { config }: { config: ProspectConfig } = $props();
</script>

<header class="fixed top-0 z-50 w-full bg-transparent">
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
		<div class="flex items-center gap-3">
			{#if config.business.logoUrl}
				<img
					src={config.business.logoUrl}
					alt={config.business.name}
					class="h-10 w-auto object-contain"
				/>
			{:else}
				<span class="text-lg font-semibold text-white" style="font-family: var(--font-heading)">
					{config.business.name}
				</span>
			{/if}
		</div>

		<a
			href="tel:{config.business.phone}"
			class="flex items-center gap-2 bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
			aria-label="Appeler {config.business.name}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-4 w-4"
			>
				<path
					fill-rule="evenodd"
					d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z"
					clip-rule="evenodd"
				/>
			</svg>
			<span class="hidden sm:inline">{formatPhone(config.business.phone)}</span>
			<span class="sm:hidden">Appeler</span>
		</a>
	</div>
</header>
