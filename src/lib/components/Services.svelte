<script lang="ts">
	import type { ProspectService } from '$types/prospect';

	let { services }: { services: ProspectService[] } = $props();

	let activeServices = $derived(services.filter((s) => s.active));

	const ICON_PATHS: Record<string, string> = {
		leaf: 'M2 22c1.25-.987 2.27-1.975 3.9-2.32M5.9 19.68c1.13-1.13 1.32-3.4 1.32-3.4S5.62 18.45 4.5 17.5C2 14 5 5 19.5 4.5c-.5 4-2.91 11.65-7.95 13.97-1.84.84-3.91.65-5.65 1.21M16.5 8.5h-9M16.5 13H9',
		scissors:
			'M14.121 14.121 19 19m-7-7 7-7m-7 7-2.879 2.879M12 12 9.121 9.121m0 5.758a3 3 0 1 0-4.243 4.243 3 3 0 0 0 4.243-4.243Zm0-5.758a3 3 0 1 0-4.243-4.243 3 3 0 0 0 4.243 4.243Z',
		tree: 'M12 4 7 11h3v3h4v-3h3l-5-7Zm0 10v8m-3 0h6',
		seedling:
			'M12 22V12M12 12c0-3 1.5-5 4.5-5.5C16 9 14.5 11 12 12Zm0 0c0-3-1.5-5-4.5-5.5.5 2.5 2 4.5 4.5 5.5Z',
		terrace: 'M3 9h18M3 9v12h18V9M3 9l9-6 9 6M8 21V13m4 8v-8m4 8v-8',
		home: 'M3 9.5 12 3l9 6.5V21h-6v-7h-6v7H3V9.5Z',
		grass:
			'M4 22V12M4 12c0-3 2-6 4-6M8 22V8M8 8c0-2 2-4 4-4M12 22V6M12 6c0-2 2-4 4-4M16 22V8M16 8c2 0 4 3 4 6v8',
		'watering-can':
			'M3 12v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-6m-12 0V8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4m-12 0h12m0 0 5-3v9'
	};
</script>

<section id="services" class="scroll-mt-28 bg-white px-6 py-20 md:px-12">
	<div class="mx-auto max-w-6xl">
		<div class="mb-12">
			<p
				class="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-text-muted"
				style="font-family: var(--font-body);"
			>
				Services
			</p>
			<h2 class="max-w-2xl text-3xl font-normal text-text md:text-4xl">Ce qu'on fait pour vous</h2>
		</div>

		<div
			class="grid grid-cols-1 gap-6 sm:grid-cols-2"
			class:lg:grid-cols-3={activeServices.length === 3}
			class:lg:grid-cols-4={activeServices.length >= 4}
			class:lg:grid-cols-2={activeServices.length === 2}
		>
			{#each activeServices as service (service.id)}
				<article
					class="border border-text/10 bg-secondary/30 p-6 transition-colors duration-200 hover:border-primary/30 hover:bg-secondary/60"
				>
					<div class="mb-4">
						{#if service.iconName && ICON_PATHS[service.iconName]}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-8 w-8 text-primary"
								aria-hidden="true"
							>
								<path d={ICON_PATHS[service.iconName]} />
							</svg>
						{:else}
							<div class="text-3xl">{service.icon}</div>
						{/if}
					</div>
					<h3 class="mb-2 text-xl font-medium text-text">
						{service.label}
					</h3>
					<p class="text-sm leading-relaxed text-text-muted" style="font-family: var(--font-body);">
						{service.description}
					</p>
				</article>
			{/each}
		</div>
	</div>
</section>
