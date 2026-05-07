<script lang="ts">
	let { businessName }: { businessName: string } = $props();
</script>

<footer class="bg-primary-dark py-8 text-center">
	<p
		class="text-xs font-medium uppercase tracking-[0.12em] text-white/30"
		style="font-family: var(--font-body);"
	>
		&copy; {new Date().getFullYear()}
		{businessName}
		&nbsp;&middot;&nbsp; Page par
		<a
			href="https://jonlabs.ch"
			target="_blank"
			rel="noopener"
			class="text-white/40 transition-colors hover:text-white/60">Jon Labs</a
		>
	</p>
</footer>
