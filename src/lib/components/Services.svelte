<script lang="ts">
	import type { ProspectService } from '$types/prospect';

	let { services }: { services: ProspectService[] } = $props();

	let activeServices = $derived(services.filter((s) => s.active));
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
					<div class="mb-4 text-3xl">{service.icon}</div>
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
