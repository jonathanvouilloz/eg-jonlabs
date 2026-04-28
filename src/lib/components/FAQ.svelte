<script lang="ts">
	import type { FAQItem } from '$types/prospect';

	interface Props {
		faq: FAQItem[];
	}

	let { faq }: Props = $props();
</script>

<section class="px-4 py-16">
	<div class="mx-auto max-w-3xl">
		<div class="mb-10 text-center">
			<h2 class="text-3xl font-bold text-primary md:text-4xl">Questions fréquentes</h2>
			<p class="mt-2 text-text-muted">Vous avez d'autres questions ? Posez-les via le devis.</p>
		</div>

		<div class="space-y-3">
			{#each faq as item, i (i)}
				<details class="faq-item border border-gray-200 bg-white">
					<summary
						class="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-base font-medium text-text-default transition-colors hover:bg-secondary/40"
					>
						<span>{item.question}</span>
						<svg
							class="faq-chevron h-5 w-5 shrink-0 text-text-muted transition-transform"
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
					<div class="faq-answer px-5 pb-5 pt-1 text-sm text-text-muted">
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

	.faq-answer {
		animation: slideDown 0.2s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
