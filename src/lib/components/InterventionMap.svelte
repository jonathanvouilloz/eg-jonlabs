<script lang="ts">
	import { onMount } from 'svelte';
	import type { ProspectConfig } from '$types/prospect';

	let {
		credibility,
		businessName,
		communes,
		address,
		googleProfileUrl,
		googleMapsEmbedUrl,
		phone,
		email
	}: {
		credibility: ProspectConfig['credibility'];
		businessName: string;
		communes?: string[];
		address?: string | null;
		googleProfileUrl?: string | null;
		googleMapsEmbedUrl?: string | null;
		phone?: string | null;
		email?: string | null;
	} = $props();

	let displayCommunes = $derived(communes && communes.length > 0 ? communes : credibility.zones);
	let useEmbed = $derived(Boolean(googleMapsEmbedUrl));

	let mapContainer: HTMLDivElement;
	let mapInstance: { remove: () => void } | null = null;
	let cssLink: HTMLLinkElement | null = null;

	onMount(() => {
		if (useEmbed) return;
		initMap();
		return () => {
			mapInstance?.remove();
			cssLink?.remove();
		};
	});

	async function initMap() {
		const L = await import('leaflet');

		cssLink = document.createElement('link');
		cssLink.rel = 'stylesheet';
		cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
		document.head.appendChild(cssLink);

		await new Promise((resolve) => {
			cssLink!.onload = resolve;
			setTimeout(resolve, 1000);
		});

		const map = L.map(mapContainer, {
			scrollWheelZoom: false,
			zoomControl: true
		}).setView([credibility.latitude, credibility.longitude], 11);
		mapInstance = map;

		L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 19
		}).addTo(map);

		L.circle([credibility.latitude, credibility.longitude], {
			radius: credibility.radiusKm * 1000,
			color: 'var(--color-primary)',
			fillColor: 'var(--color-primary)',
			fillOpacity: 0.08,
			weight: 1.5
		}).addTo(map);

		const popupParts = [`<strong>${businessName}</strong>`];
		if (address) popupParts.push(address);
		if (googleProfileUrl) {
			popupParts.push(
				`<a href="${googleProfileUrl}" target="_blank" rel="noopener" style="color: var(--color-primary); text-decoration: underline;">Voir sur Google</a>`
			);
		}

		L.marker([credibility.latitude, credibility.longitude], {
			icon: L.divIcon({
				html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="color: var(--color-primary); width: 28px; height: 28px;"><path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.713 2.956l.114.068ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" /></svg>`,
				className: '',
				iconSize: [28, 28],
				iconAnchor: [14, 28]
			})
		})
			.addTo(map)
			.bindPopup(popupParts.join('<br />'));
	}
</script>

<section id="zones" class="scroll-mt-28 bg-primary px-6 py-20 md:px-12">
	<div class="mx-auto max-w-6xl">
		<div class="mb-10">
			<p
				class="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-white/50"
				style="font-family: var(--font-body);"
			>
				Zone d'intervention
			</p>
			<h2 class="text-4xl text-white md:text-5xl">
				{credibility.radiusKm} km autour de {credibility.zones[0]}
			</h2>
			{#if address}
				<p class="mt-3 text-sm text-white/70" style="font-family: var(--font-body);">
					{address}
					{#if googleProfileUrl}
						<a
							href={googleProfileUrl}
							target="_blank"
							rel="noopener"
							class="ml-2 inline-flex items-center gap-1 border-b border-white/30 pb-px text-white/85 transition-colors hover:border-white hover:text-white"
						>
							Voir sur Google
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="h-3 w-3"
							>
								<path
									fill-rule="evenodd"
									d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
									clip-rule="evenodd"
								/>
								<path
									fill-rule="evenodd"
									d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					{/if}
				</p>
			{/if}
		</div>

		<div class="grid gap-8 md:grid-cols-5 md:gap-10">
			{#if useEmbed && googleMapsEmbedUrl}
				<iframe
					src={googleMapsEmbedUrl}
					class="h-[320px] w-full md:col-span-3 md:h-[440px]"
					style="border:0"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					allowfullscreen
					title="Carte {businessName}"
				></iframe>
			{:else}
				<div bind:this={mapContainer} class="h-[320px] w-full md:col-span-3 md:h-[440px]"></div>
			{/if}

			<div class="md:col-span-2">
				<p
					class="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-white/50"
					style="font-family: var(--font-body);"
				>
					Communes desservies
				</p>
				<p class="mb-4 text-sm text-white/75" style="font-family: var(--font-body);">
					Vos zones d'intervention personnalisées
				</p>
				<div class="grid grid-cols-2 gap-2">
					{#each displayCommunes as commune (commune)}
						<div
							class="border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white/85 transition-colors duration-200 hover:border-white/30 hover:bg-white/10"
							style="font-family: var(--font-body);"
						>
							{commune}
						</div>
					{/each}
				</div>
				<p
					class="mt-4 text-xs leading-relaxed text-white/45"
					style="font-family: var(--font-body);"
				>
					Devis gratuit dans toute la zone. Hors zone, nous contacter pour étude.
				</p>
			</div>
		</div>

		<!-- ── Carte contact : email + tél + adresse + CTA ── -->
		<div
			class="mt-10 grid gap-6 border-t border-white/15 pt-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10"
		>
			<dl
				class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3"
				style="font-family: var(--font-body);"
			>
				{#if phone}
					<div>
						<dt class="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-white/50">
							Téléphone
						</dt>
						<dd>
							<a href="tel:{phone}" class="text-white/90 transition-colors hover:text-white">
								{phone}
							</a>
						</dd>
					</div>
				{/if}
				{#if email}
					<div>
						<dt class="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-white/50">
							Email
						</dt>
						<dd class="break-all">
							<a href="mailto:{email}" class="text-white/90 transition-colors hover:text-white">
								{email}
							</a>
						</dd>
					</div>
				{/if}
				{#if address}
					<div>
						<dt class="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-white/50">
							Adresse
						</dt>
						<dd class="text-white/90">{address}</dd>
					</div>
				{/if}
			</dl>

			<a
				href="#devis"
				class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-white/90 md:justify-self-end"
				style="font-family: var(--font-body);"
			>
				Obtenir un devis gratuit
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
</section>
