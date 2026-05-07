<script lang="ts">
	import { onMount } from 'svelte';
	import type { ProspectConfig } from '$types/prospect';

	let {
		credibility,
		businessName
	}: { credibility: ProspectConfig['credibility']; businessName: string } = $props();

	let mapContainer: HTMLDivElement;
	let mapInstance: { remove: () => void } | null = null;
	let cssLink: HTMLLinkElement | null = null;

	onMount(() => {
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

		L.marker([credibility.latitude, credibility.longitude], {
			icon: L.divIcon({
				html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="color: var(--color-primary); width: 28px; height: 28px;"><path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.713 2.956l.114.068ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" /></svg>`,
				className: '',
				iconSize: [28, 28],
				iconAnchor: [14, 28]
			})
		})
			.addTo(map)
			.bindPopup(`Siège de ${businessName}`);
	}
</script>

<section class="bg-primary px-6 py-20 md:px-12">
	<div class="mx-auto max-w-4xl">
		<div class="mb-10">
			<p
				class="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-white/50"
				style="font-family: var(--font-body);"
			>
				Zone d'intervention
			</p>
			<h2 class="text-3xl font-normal text-white md:text-4xl">
				{credibility.radiusKm} km autour de {credibility.zones[0]}
			</h2>
		</div>
	</div>

	<div bind:this={mapContainer} class="h-[380px] w-full md:h-[460px]"></div>

	{#if credibility.zones.length > 1}
		<div class="mx-auto mt-6 max-w-4xl">
			<div class="flex flex-wrap gap-2">
				{#each credibility.zones as zone (zone)}
					<span
						class="border border-white/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-white/60"
						style="font-family: var(--font-body);"
					>
						{zone}
					</span>
				{/each}
			</div>
		</div>
	{/if}
</section>
