<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Audit Présence Google — {data.slug}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="audit-page min-h-screen bg-white">
	<div class="mx-auto max-w-2xl px-6 py-12">
		<article class="audit-prose prose prose-neutral max-w-none">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- HTML is server-rendered from a trusted markdown source we control. -->
			{@html data.intro}
		</article>

		{#if data.toc.length > 0}
			<nav class="my-10 border-y border-neutral-200 py-6 text-sm">
				<p class="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">Sommaire</p>
				<ol class="list-none space-y-1.5 pl-0">
					{#each data.toc as item (item.id)}
						<li>
							<a
								href="#{item.id}"
								class="text-neutral-700 no-underline hover:text-black hover:underline"
							>
								{item.text}
							</a>
						</li>
					{/each}
				</ol>
			</nav>
		{/if}

		<article class="audit-prose prose prose-neutral max-w-none">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- HTML is server-rendered from a trusted markdown source we control. -->
			{@html data.body}
		</article>
	</div>
</div>

<style>
	:global(body:has(.audit-page)) {
		background-color: white;
		font-family: 'Inter', sans-serif;
	}

	.audit-page,
	.audit-page :global(*) {
		font-family: 'Inter', sans-serif !important;
	}

	.audit-prose :global(h1),
	.audit-prose :global(h2),
	.audit-prose :global(h3),
	.audit-prose :global(h4) {
		font-family: 'Inter', sans-serif !important;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: #0a0a0a;
	}

	.audit-prose :global(h1) {
		font-size: 2.34rem;
		margin-top: 0;
	}

	.audit-prose :global(h2) {
		font-size: 1.5625rem;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		scroll-margin-top: 2rem;
	}

	.audit-prose :global(blockquote) {
		border-left-color: #e5e5e5;
		color: #525252;
		font-size: 0.9rem;
		font-style: normal;
	}

	.audit-prose :global(table) {
		font-size: 0.95rem;
	}

	.audit-prose :global(img) {
		border: 1px solid #e5e5e5;
		border-radius: 6px;
	}

	.audit-prose :global(hr) {
		border-color: #e5e5e5;
		margin: 2.5rem 0;
	}

	.audit-prose :global(a) {
		color: #0a0a0a;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
