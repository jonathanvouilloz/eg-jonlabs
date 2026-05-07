<script lang="ts">
	import type { Testimonial } from '$types/prospect';

	let { testimonials }: { testimonials: Testimonial[] } = $props();
</script>

<section id="temoignages" class="scroll-mt-28 px-6 py-20 md:px-12">
	<div class="mx-auto max-w-4xl">
		<div class="mb-12">
			<p
				class="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-text-muted"
				style="font-family: var(--font-body);"
			>
				Témoignages
			</p>
			<h2 class="text-4xl text-primary md:text-5xl">Ce que disent nos clients</h2>
		</div>

		<div class="grid gap-10 md:grid-cols-3">
			{#each testimonials as testimonial, i (i)}
				<div>
					<p
						class="text-3xl font-normal leading-none text-accent"
						style="font-family: var(--font-heading);"
						aria-hidden="true"
					>
						"
					</p>
					<p
						class="mt-2 text-base leading-relaxed text-text"
						style="font-family: var(--font-body); line-height: 1.6;"
					>
						{testimonial.text}
					</p>
					<div class="mt-4 flex items-center gap-2">
						<div class="flex gap-0.5">
							{#each Array(5) as _, s (s)}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="h-3 w-3 {s < testimonial.rating ? 'text-accent' : 'text-text/15'}"
								>
									<path
										fill-rule="evenodd"
										d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
										clip-rule="evenodd"
									/>
								</svg>
							{/each}
						</div>
						<span
							class="text-xs font-medium uppercase tracking-[0.1em] text-text-muted"
							style="font-family: var(--font-body);"
						>
							{testimonial.name} — {testimonial.location}
						</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
