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
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = previousOverflow;
		};
	});

	function close() {
		open = false;
		dismissed = true;
	}
</script>

{#if !mounted}
	<aside class="fallback" aria-label={label}>
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
{:else if open}
	<div class="backdrop" onclick={close} role="presentation">
		<div
			class="modal"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			aria-label={label}
			tabindex="-1"
		>
			<header class="meta-header">
				<div class="meta-avatar">J</div>
				<div class="meta-meta">
					<span class="meta-label">{label}</span>
					<span class="meta-sub">Jon Labs Local</span>
				</div>
				<button class="close" onclick={close} aria-label="Fermer la note" type="button">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						width="16"
						height="16"
					>
						<path
							d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
						/>
					</svg>
				</button>
			</header>
			<div class="meta-body">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: oklch(0% 0 0 / 0.6);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		animation: fadeIn 0.25s ease-out;
	}

	.modal {
		position: relative;
		width: 100%;
		max-width: 520px;
		max-height: 85vh;
		overflow-y: auto;
		padding: 1.75rem 1.75rem 1.75rem;
		background: oklch(18% 0.008 250);
		color: oklch(96% 0.005 250);
		border-radius: 1.25rem;
		box-shadow:
			0 24px 70px -12px oklch(0% 0 0 / 0.5),
			0 0 0 1px oklch(100% 0 0 / 0.06);
		animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		outline: none;
	}

	.fallback {
		position: relative;
		margin: 2rem auto;
		max-width: 720px;
		padding: 1.5rem 1.75rem;
		background: oklch(18% 0.008 250);
		color: oklch(96% 0.005 250);
		border-radius: 1.25rem;
	}

	.meta-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-bottom: 1rem;
		margin-bottom: 1.25rem;
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
		font-family: 'Inter', sans-serif;
	}

	.meta-meta {
		flex: 1;
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.meta-label {
		font-size: 0.875rem;
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

	.close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		background: oklch(100% 0 0 / 0.06);
		color: oklch(80% 0.005 250);
		border: none;
		cursor: pointer;
		flex-shrink: 0;
		transition:
			background 0.15s ease,
			color 0.15s ease;
	}

	.close:hover {
		background: oklch(100% 0 0 / 0.12);
		color: oklch(96% 0.005 250);
	}

	.close:focus-visible {
		outline: 2px solid #00d9a3;
		outline-offset: 2px;
	}

	.meta-body {
		font-family: 'Inter', sans-serif;
		font-size: 0.9375rem;
		line-height: 1.55;
		color: oklch(88% 0.005 250);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(16px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
