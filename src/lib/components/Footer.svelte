<script lang="ts">
	import type { ProspectConfig } from '$types/prospect';

	let { config }: { config: ProspectConfig } = $props();

	const business = $derived(config.business);
	const year = new Date().getFullYear();

	// "Paysagiste à Genève" / "au Chenit" / "aux Ulis" / "à La Chaux-de-Fonds"
	const zone0 = $derived(config.credibility.zones[0] ?? '');
	const cityPrefix = $derived(/^les\s/i.test(zone0) ? 'aux' : /^le\s/i.test(zone0) ? 'au' : 'à');
	const cityName = $derived(cityPrefix === 'à' ? zone0 : zone0.replace(/^les?\s+/i, ''));

	// Split adresse "Rue X 12, 1200 Genève" → ["Rue X 12", "1200 Genève"] pour rendu multi-ligne propre.
	const addressLines = $derived(
		business.address
			? business.address
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean)
			: []
	);

	const hasSocial = $derived(
		Boolean(
			business.googleProfileUrl ||
			business.googleReviewUrl ||
			business.facebookUrl ||
			business.instagramUrl
		)
	);
</script>

<footer class="bg-primary-dark text-white" style="font-family: var(--font-body);">
	<div class="mx-auto max-w-6xl px-6 py-14 md:px-12">
		<div class="grid gap-10 md:grid-cols-12">
			<!-- ── Bloc identité + NAP ── -->
			<div class="md:col-span-5">
				{#if business.logoUrl}
					<img
						src={business.logoUrl}
						alt={business.name}
						class="h-14 w-auto max-w-[220px] object-contain"
					/>
				{:else}
					<div>
						<p class="text-xl font-semibold leading-tight text-white">{business.name}</p>
						<p class="mt-1 text-sm text-white/55">
							Paysagiste {cityPrefix}
							{cityName}
						</p>
					</div>
				{/if}

				<dl class="mt-6 space-y-3 text-sm">
					{#if addressLines.length > 0}
						<div class="flex gap-3">
							<dt class="mt-0.5 w-5 shrink-0 text-white/40" aria-label="Adresse">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="h-4 w-4"
								>
									<path
										fill-rule="evenodd"
										d="M9.69 18.933A1.533 1.533 0 0 0 10.31 19a1.532 1.532 0 0 0 .622-.067c.246-.094.451-.247.703-.486a18.27 18.27 0 0 0 1.84-2.045 17.18 17.18 0 0 0 1.96-3.114C16.21 11.523 17 9.516 17 7.616 17 4.246 14.077 1.5 10.5 1.5S4 4.246 4 7.616c0 1.9.79 3.907 1.566 5.672a17.18 17.18 0 0 0 1.96 3.114 18.27 18.27 0 0 0 1.84 2.045c.252.24.457.392.704.486 0 0 .29.114.62.067ZM10.5 9.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"
										clip-rule="evenodd"
									/>
								</svg>
							</dt>
							<dd class="text-white/80">
								{#each addressLines as line, i (i)}
									<span class="block">{line}</span>
								{/each}
							</dd>
						</div>
					{/if}
					{#if business.phone}
						<div class="flex gap-3">
							<dt class="mt-0.5 w-5 shrink-0 text-white/40" aria-label="Téléphone">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="h-4 w-4"
								>
									<path
										fill-rule="evenodd"
										d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z"
										clip-rule="evenodd"
									/>
								</svg>
							</dt>
							<dd>
								<a
									href="tel:{business.phone}"
									class="text-white/80 transition-colors hover:text-white"
								>
									{business.phone}
								</a>
							</dd>
						</div>
					{/if}
					{#if business.email}
						<div class="flex gap-3">
							<dt class="mt-0.5 w-5 shrink-0 text-white/40" aria-label="Email">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="h-4 w-4"
								>
									<path
										d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z"
									/>
									<path
										d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z"
									/>
								</svg>
							</dt>
							<dd class="break-all">
								<a
									href="mailto:{business.email}"
									class="text-white/80 transition-colors hover:text-white"
								>
									{business.email}
								</a>
							</dd>
						</div>
					{/if}
				</dl>
			</div>

			<!-- ── Navigation ── -->
			<div class="md:col-span-3">
				<p class="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-white/40">Navigation</p>
				<ul class="space-y-2.5 text-sm">
					<li>
						<a href="#services" class="text-white/70 transition-colors hover:text-white">Services</a
						>
					</li>
					<li>
						<a href="#zones" class="text-white/70 transition-colors hover:text-white"
							>Zones d'intervention</a
						>
					</li>
					<li>
						<a href="#temoignages" class="text-white/70 transition-colors hover:text-white">Avis</a>
					</li>
					<li>
						<a href="#realisations" class="text-white/70 transition-colors hover:text-white"
							>Réalisations</a
						>
					</li>
					<li><a href="#faq" class="text-white/70 transition-colors hover:text-white">FAQ</a></li>
					<li>
						<a href="#devis" class="text-white/70 transition-colors hover:text-white"
							>Demander un devis</a
						>
					</li>
				</ul>
			</div>

			<!-- ── Présence en ligne + horaires ── -->
			<div class="md:col-span-4">
				{#if hasSocial}
					<p class="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-white/40">
						Retrouvez-nous
					</p>
					<div class="flex flex-wrap gap-2">
						{#if business.googleProfileUrl}
							<a
								href={business.googleProfileUrl}
								target="_blank"
								rel="noopener"
								class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
								aria-label="Fiche Google"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="h-4 w-4"
								>
									<path
										fill-rule="evenodd"
										d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.713 2.956l.114.068ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
										clip-rule="evenodd"
									/>
								</svg>
							</a>
						{/if}
						{#if business.googleReviewUrl}
							<a
								href={business.googleReviewUrl}
								target="_blank"
								rel="noopener"
								class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
								aria-label="Avis Google"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="h-4 w-4"
								>
									<path
										fill-rule="evenodd"
										d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
										clip-rule="evenodd"
									/>
								</svg>
							</a>
						{/if}
						{#if business.facebookUrl}
							<a
								href={business.facebookUrl}
								target="_blank"
								rel="noopener"
								class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
								aria-label="Facebook"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="h-4 w-4"
								>
									<path
										d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V12h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12Z"
									/>
								</svg>
							</a>
						{/if}
						{#if business.instagramUrl}
							<a
								href={business.instagramUrl}
								target="_blank"
								rel="noopener"
								class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
								aria-label="Instagram"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="h-4 w-4"
								>
									<path
										d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.331 3.608 1.306.975.975 1.244 2.242 1.306 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.331 2.633-1.306 3.608-.975.975-2.242 1.244-3.608 1.306-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.331-3.608-1.306-.975-.975-1.244-2.242-1.306-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.331-2.633 1.306-3.608.975-.975 2.242-1.244 3.608-1.306C8.416 2.175 8.796 2.163 12 2.163Zm0 1.802c-3.155 0-3.527.012-4.77.068-1.034.047-1.595.218-1.967.362-.495.193-.85.423-1.222.795-.372.372-.602.727-.795 1.222-.144.372-.315.933-.362 1.967-.056 1.243-.068 1.615-.068 4.77 0 3.155.012 3.527.068 4.77.047 1.034.218 1.595.362 1.967.193.495.423.85.795 1.222.372.372.727.602 1.222.795.372.144.933.315 1.967.362 1.243.056 1.615.068 4.77.068 3.155 0 3.527-.012 4.77-.068 1.034-.047 1.595-.218 1.967-.362.495-.193.85-.423 1.222-.795.372-.372.602-.727.795-1.222.144-.372.315-.933.362-1.967.056-1.243.068-1.615.068-4.77 0-3.155-.012-3.527-.068-4.77-.047-1.034-.218-1.595-.362-1.967-.193-.495-.423-.85-.795-1.222-.372-.372-.727-.602-1.222-.795-.372-.144-.933-.315-1.967-.362-1.243-.056-1.615-.068-4.77-.068Zm0 3.063A5.135 5.135 0 1 1 12 17.13a5.135 5.135 0 0 1 0-10.102Zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666Zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"
									/>
								</svg>
							</a>
						{/if}
					</div>
				{/if}

				<a
					href="#devis"
					class="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-white/90"
				>
					Demander un devis
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-3.5 w-3.5"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
			</div>
		</div>

		<!-- ── Barre de crédit ── -->
		<div
			class="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between"
		>
			<p class="uppercase tracking-[0.12em]">
				&copy; {year}
				{business.name}
			</p>
			<p>
				Page par
				<a
					href="https://jonlabs.ch"
					target="_blank"
					rel="noopener"
					class="text-white/55 transition-colors hover:text-white/80"
				>
					Jon Labs
				</a>
			</p>
		</div>
	</div>
</footer>
