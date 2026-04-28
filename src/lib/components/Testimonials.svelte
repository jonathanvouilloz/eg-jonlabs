<script lang="ts">
	import type { Testimonial } from '$types/prospect';

	let { testimonials }: { testimonials: Testimonial[] } = $props();

	// Duplicate for infinite scroll illusion
	let items = $derived([...testimonials, ...testimonials]);
</script>

<section class="overflow-hidden bg-secondary py-16">
	<div class="mx-auto max-w-6xl px-4">
		<h2 class="mb-8 text-center text-3xl font-bold text-primary md:text-4xl">
			Ce que disent nos clients
		</h2>
	</div>

	<div class="relative">
		<div class="scroll-track flex gap-6 px-4">
			{#each items as testimonial, i (i)}
				<div class="w-[320px] shrink-0 border border-gray-200 bg-white p-6 md:w-[380px]">
					<div class="mb-3 flex gap-0.5">
						{#each Array(5) as _, s (s)}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="h-4 w-4 {s < testimonial.rating ? 'text-primary' : 'text-gray-200'}"
							>
								<path
									fill-rule="evenodd"
									d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
									clip-rule="evenodd"
								/>
							</svg>
						{/each}
					</div>
					<p class="mb-4 text-sm leading-relaxed text-text">
						"{testimonial.text}"
					</p>
					<div class="text-sm">
						<span class="font-medium">{testimonial.name}</span>
						<span class="text-text-muted"> — {testimonial.location}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.scroll-track {
		animation: scroll 30s linear infinite;
	}

	.scroll-track:hover {
		animation-play-state: paused;
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
