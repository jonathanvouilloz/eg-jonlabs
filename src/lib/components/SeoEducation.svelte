<script lang="ts">
	let { communes }: { communes: string[] } = $props();

	let displayCommunes = $derived(
		communes.length > 3 ? communes.slice(0, 3).join(', ') + '...' : communes.join(', ')
	);
</script>

<section class="bg-white px-6 py-24 md:px-12">
	<div class="mx-auto max-w-5xl">
		<div class="mb-14">
			<p
				class="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-text-muted"
				style="font-family: var(--font-body);"
			>
				Comment ça marche
			</p>
			<h2 class="max-w-3xl text-3xl font-normal text-text md:text-4xl">
				Comment ce site vous fait monter sur Google
			</h2>
		</div>

		<ol class="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
			<li class="flex gap-4">
				<div class="flex-shrink-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="h-7 w-7 text-primary"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
						/>
					</svg>
				</div>
				<div>
					<h3 class="mb-2 text-lg font-medium text-text">
						Une page par commune que vous desservez
					</h3>
					<p class="text-sm leading-relaxed text-text-muted" style="font-family: var(--font-body);">
						{displayCommunes}{#if communes.length > 0}
							— chacune optimisée pour sortir sur "paysagiste {communes[0]}".{/if}
					</p>
				</div>
			</li>

			<li class="flex gap-4">
				<div class="flex-shrink-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="h-7 w-7 text-primary"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
						/>
					</svg>
				</div>
				<div>
					<h3 class="mb-2 text-lg font-medium text-text">
						Des articles courts publiés chaque mois
					</h3>
					<p class="text-sm leading-relaxed text-text-muted" style="font-family: var(--font-body);">
						Pour que Google voie que vous êtes vivant. Pas un blog SEO bourré de mots-clés — du
						contenu utile que vos clients liront.
					</p>
				</div>
			</li>

			<li class="flex gap-4">
				<div class="flex-shrink-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="h-7 w-7 text-primary"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .32-.988l5.519-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
						/>
					</svg>
				</div>
				<div>
					<h3 class="mb-2 text-lg font-medium text-text">Votre fiche Google connectée au site</h3>
					<p class="text-sm leading-relaxed text-text-muted" style="font-family: var(--font-body);">
						Les avis qui tombent rappellent à Google que vous existez. Le site renforce la fiche, la
						fiche renforce le site.
					</p>
				</div>
			</li>

			<li class="flex gap-4">
				<div class="flex-shrink-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="h-7 w-7 text-primary"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
						/>
					</svg>
				</div>
				<div>
					<h3 class="mb-2 text-lg font-medium text-text">50× plus de recherches captées</h3>
					<p class="text-sm leading-relaxed text-text-muted" style="font-family: var(--font-body);">
						Le tout vous fait sortir sur 50× plus de recherches que vos concurrents qui n'ont qu'une
						fiche Google.
					</p>
				</div>
			</li>
		</ol>
	</div>
</section>
