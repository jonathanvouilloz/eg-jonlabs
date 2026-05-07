<script lang="ts">
	import type { FAQItem } from '$types/prospect';

	interface Props {
		faq: FAQItem[];
	}

	let { faq }: Props = $props();
</script>

<section class="px-6 py-20 md:px-12">
	<div class="mx-auto max-w-2xl">
		<div class="mb-12">
			<p
				class="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-text-muted"
				style="font-family: var(--font-body);"
			>
				FAQ
			</p>
			<h2 class="text-3xl font-normal text-primary md:text-4xl">Questions fréquentes</h2>
		</div>

		<div>
			{#each faq as item, i (i)}
				<details class="faq-item border-t border-text/10 {i === faq.length - 1 ? 'border-b' : ''}">
					<summary
						class="flex cursor-pointer items-start justify-between gap-4 py-5 text-base text-text transition-colors hover:text-primary"
						style="font-family: var(--font-body);"
					>
						<span class="font-medium leading-snug">{item.question}</span>
						<svg
							class="faq-chevron mt-0.5 h-4 w-4 shrink-0 text-text-muted transition-transform duration-200"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
								clip-rule="evenodd"
							/>
						</svg>
					</summary>
					<div
						class="pb-6 text-sm leading-relaxed text-text-muted"
						style="font-family: var(--font-body); line-height: 1.6;"
					>
						<p>{item.answer}</p>
					</div>
				</details>
			{/each}
		</div>
	</div>
</section>

<style>
	.faq-item[open] .faq-chevron {
		transform: rotate(180deg);
	}

	.faq-item summary::-webkit-details-marker {
		display: none;
	}

	.faq-item summary {
		list-style: none;
	}
</style>
