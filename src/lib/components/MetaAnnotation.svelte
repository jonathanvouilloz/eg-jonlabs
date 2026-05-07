<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		anchorSelector,
		label = 'Note de Jonathan',
		children
	}: {
		anchorSelector: string;
		label?: string;
		children: Snippet;
	} = $props();

	let open = $state(false);
	let mounted = $state(false);
	let dismissed = $state(false);

	$effect(() => {
		mounted = true;
		if (typeof IntersectionObserver === 'undefined') return;
		const target = document.querySelector(anchorSelector);
		if (!target) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !dismissed) {
					open = true;
				}
			},
			{ threshold: 0.3 }
		);
		observer.observe(target);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
		};
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('keydown', onKey);
		};
	});

	function close() {
		open = false;
		dismissed = true;
	}
</script>

{#if !mounted}
	<aside class="fallback" aria-label={label}>
		<h3 class="meta-title">{label}</h3>
		<div class="meta-body">
			{@render children()}
		</div>
	</aside>
{:else if open}
	<div class="overlay" onclick={close} role="presentation"></div>
	<div
		class="meta-card"
		role="dialog"
		aria-modal="false"
		aria-label={label}
		tabindex="-1"
		onkeydown={(e) => e.stopPropagation()}
	>
		<h3 class="meta-title">{label}</h3>
		<div class="meta-body">
			{@render children()}
		</div>
		<button class="close-cta" onclick={close} type="button">Fermer</button>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 99;
		background: oklch(0% 0 0 / 0.4);
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
		animation: fadeIn 0.25s ease-out;
	}

	.meta-card {
		position: fixed;
		right: clamp(1.5rem, 12vw, 8rem);
		top: 50%;
		transform: translateY(-50%);
		z-index: 100;
		width: calc(100% - 3rem);
		max-width: 400px;
		max-height: 82vh;
		overflow-y: auto;
		padding: 1.75rem 1.75rem 1.5rem;
		background: #ffffff;
		color: #0a0a0a;
		border-radius: 1rem;
		box-shadow:
			0 30px 80px -12px oklch(0% 0 0 / 0.35),
			0 0 0 1px oklch(0% 0 0 / 0.06);
		animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		outline: none;
	}

	.fallback {
		position: relative;
		margin: 2rem auto;
		max-width: 720px;
		padding: 1.75rem 1.75rem 1.5rem;
		background: #ffffff;
		color: #0a0a0a;
		border: 1px solid #e5e5e5;
		border-radius: 1rem;
	}

	.meta-title {
		font-family: 'Inter', sans-serif;
		font-size: 1.375rem;
		font-weight: 600;
		color: #0a0a0a;
		margin: 0 0 1.25rem 0;
		line-height: 1.25;
		letter-spacing: -0.015em;
	}

	.meta-body {
		font-family: 'Inter', sans-serif;
		font-size: 0.9375rem;
		line-height: 1.55;
		color: #404040;
	}

	.close-cta {
		display: block;
		width: 100%;
		margin-top: 1.5rem;
		padding: 0.75rem 1.25rem;
		background: #0a0a0a;
		color: #ffffff;
		border: none;
		border-radius: 0.625rem;
		font-family: 'Inter', sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.close-cta:hover {
		background: #262626;
	}

	.close-cta:focus-visible {
		outline: 2px solid #00d9a3;
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		.meta-card {
			right: 0.75rem;
			left: 0.75rem;
			bottom: 0.75rem;
			top: auto;
			max-width: none;
			width: auto;
			max-height: 70vh;
			transform: none;
			animation: slideInBottom 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideInRight {
		from {
			opacity: 0;
			transform: translateY(-50%) translateX(20px);
		}
		to {
			opacity: 1;
			transform: translateY(-50%) translateX(0);
		}
	}

	@keyframes slideInBottom {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
