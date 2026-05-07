<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		anchorSelector,
		label = 'Note de Jonathan',
		position = 'right',
		children
	}: {
		anchorSelector: string;
		label?: string;
		position?: 'right' | 'left';
		children: Snippet;
	} = $props();

	let visible = $state(false);
	let mounted = $state(false);

	$effect(() => {
		mounted = true;
		if (typeof IntersectionObserver === 'undefined') return;
		const target = document.querySelector(anchorSelector);
		if (!target) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
			},
			{ threshold: 0.15 }
		);
		observer.observe(target);
		return () => observer.disconnect();
	});
</script>

<aside
	class="meta-annotation"
	class:visible
	class:mounted
	class:left={position === 'left'}
	aria-label={label}
>
	<div class="meta-header">
		<div class="meta-avatar">J</div>
		<div class="meta-meta">
			<span class="meta-label">{label}</span>
			<span class="meta-sub">Jon Labs Local</span>
		</div>
	</div>
	<div class="meta-body">
		{@render children()}
	</div>
</aside>

<style>
	/* Inline fallback (mobile + pre-hydration) */
	.meta-annotation {
		position: relative;
		margin: 2rem 1.5rem;
		padding: 1.5rem 1.75rem;
		background: oklch(18% 0.008 250);
		color: oklch(96% 0.005 250);
		border-radius: 1.25rem;
		max-width: 720px;
		margin-left: auto;
		margin-right: auto;
	}

	.meta-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-bottom: 1rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid oklch(100% 0 0 / 0.08);
	}

	.meta-avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 9999px;
		background: #00d9a3;
		color: oklch(15% 0.005 250);
		font-weight: 600;
		font-size: 0.875rem;
		flex-shrink: 0;
	}

	.meta-meta {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.meta-label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: oklch(96% 0.005 250);
		font-family: 'Inter', sans-serif;
	}

	.meta-sub {
		font-size: 0.6875rem;
		color: oklch(70% 0.005 250);
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		margin-top: 0.125rem;
	}

	.meta-body {
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		line-height: 1.55;
		color: oklch(88% 0.005 250);
	}

	/* xl + hydrated : floating fixed in margin */
	@media (min-width: 1280px) {
		.meta-annotation.mounted {
			position: fixed;
			right: 1.5rem;
			top: 50%;
			transform: translateY(-50%) translateX(20px);
			width: 320px;
			max-width: none;
			max-height: 80vh;
			overflow-y: auto;
			margin: 0;
			opacity: 0;
			pointer-events: none;
			transition:
				opacity 0.35s ease,
				transform 0.35s ease;
			box-shadow:
				0 20px 60px -12px oklch(0% 0 0 / 0.4),
				0 0 0 1px oklch(100% 0 0 / 0.05);
		}
		.meta-annotation.mounted.left {
			right: auto;
			left: 1.5rem;
			transform: translateY(-50%) translateX(-20px);
		}
		.meta-annotation.mounted.visible {
			transform: translateY(-50%) translateX(0);
			opacity: 1;
			pointer-events: auto;
		}
	}
</style>
