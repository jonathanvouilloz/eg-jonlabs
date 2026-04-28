<script lang="ts">
	let { businessName }: { businessName: string } = $props();
</script>

<footer class="bg-gray-900 py-6 text-center text-sm text-gray-400">
	<p>
		Page creee par
		<a href="https://jonlabs.ch" target="_blank" rel="noopener" class="underline hover:text-white">
			Jon Labs
		</a>
	</p>
	<p class="mt-1">&copy; {new Date().getFullYear()} {businessName}</p>
</footer>
