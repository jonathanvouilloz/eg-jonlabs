<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const c = data.config;

	// Auto-scroll vers le banner de statut après chaque save/upload pour visibilité
	$effect(() => {
		if (form?.saved || form?.uploaded || form?.error || form?.uploadError) {
			if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	});

	// Essentiels (state local pour preview avant submit)
	let businessName = $state(c.business.name);
	let ownerFirstName = $state(c.business.ownerFirstName);
	let ownerLastName = $state(c.business.ownerLastName);
	let tagline = $state(c.business.tagline);
	let phone = $state(c.business.phone);
	let email = $state(c.business.email);
	let address = $state(c.business.address ?? '');
	let googleProfileUrl = $state(c.business.googleProfileUrl ?? '');
	let googleMapsEmbedUrl = $state(c.business.googleMapsEmbedUrl ?? '');
	let logoUrl = $state(c.business.logoUrl ?? '');
	let googleReviewUrl = $state(c.business.googleReviewUrl ?? '');
	let facebookUrl = $state(c.business.facebookUrl ?? '');
	let instagramUrl = $state(c.business.instagramUrl ?? '');
	let heroImage = $state(c.heroImage);

	let yearsExperience = $state(c.credibility.yearsExperience);
	let chantiersCount = $state(c.credibility.chantiersCount ?? '');
	let googleRating = $state(c.credibility.googleRating ?? '');
	let googleReviewsCount = $state(c.credibility.googleReviewsCount ?? '');
	let zones = $state(c.credibility.zones.join(', '));
	let radiusKm = $state(c.credibility.radiusKm);
	let latitude = $state(c.credibility.latitude);
	let longitude = $state(c.credibility.longitude);

	let quizVariant = $state(c.quizVariant);
	let heroPrefix = $state(c.heroPrefix ?? 'à');
	let heroSubline = $state(c.heroSubline ?? '');
	let heroH1 = $state(c.heroH1 ?? '');
	let createdAt = $state(c.createdAt);

	let recipientEmail = $state(c.leadDelivery.recipientEmail);
	let ccEmails = $state(c.leadDelivery.ccEmails.join(', '));
	let subjectPrefix = $state(c.leadDelivery.subjectPrefix);

	// CRM
	let crmStatus = $state(c.crm?.status ?? 'a_contacter');
	let crmTier = $state(c.crm?.tier ?? '');
	let crmWebsiteUrl = $state(c.crm?.websiteUrl ?? '');
	let crmNotes = $state(c.crm?.notes ?? '');

	// JSON fields (édition libre)
	let services = $state(JSON.stringify(c.services, null, 2));
	let realizations = $state(JSON.stringify(c.realizations, null, 2));
	let testimonials = $state(JSON.stringify(c.testimonials, null, 2));
	let faq = $state(JSON.stringify(c.faq, null, 2));
	let communes = $state(JSON.stringify(c.communes ?? [], null, 2));
	let branding = $state(JSON.stringify(c.branding, null, 2));
	let salesPage = $state(JSON.stringify(c.salesPage ?? null, null, 2));
	let localMarket = $state(JSON.stringify(c.localMarket ?? null, null, 2));
	let inspirationGallery = $state(JSON.stringify(c.inspirationGallery ?? null, null, 2));

	let saving = $state(false);
	let uploadingHero = $state(false);
	let uploadingLogo = $state(false);

	function fmtBool(s: string): boolean {
		return s.length > 0;
	}
</script>

<svelte:head>
	<title>Éditer {c.business.name} · Admin</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 px-6 py-8">
	<div class="mx-auto max-w-5xl">
		<header class="mb-6 flex items-end justify-between">
			<div>
				<a href="/admin" class="text-sm text-slate-500 hover:text-slate-700">← Retour à la liste</a>
				<h1 class="mt-1 text-2xl font-semibold text-slate-900">{businessName || data.slug}</h1>
				<p class="font-mono text-xs text-slate-500">{data.slug}</p>
			</div>
			<div class="flex gap-2">
				<a
					href="/atelier/{data.slug}"
					target="_blank"
					rel="noopener"
					class="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
				>
					↗ Voir l'atelier
				</a>
				<a
					href="/landing/{data.slug}"
					target="_blank"
					rel="noopener"
					class="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
				>
					↗ Landing
				</a>
			</div>
		</header>

		{#if form?.saved}
			<div
				class="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800"
			>
				Sauvegardé.
			</div>
		{/if}
		{#if form?.uploaded}
			<div
				class="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800"
			>
				Image {form.uploaded} mise à jour : <code>{form.path}</code>
			</div>
		{/if}
		{#if form?.error}
			<div
				class="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800"
			>
				<strong>Erreur :</strong>
				{form.error}
			</div>
		{/if}
		{#if form?.uploadError}
			<div
				class="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800"
			>
				<strong>Upload échoué :</strong>
				{form.uploadError}
				{#if form.uploadDetail}— {form.uploadDetail}{/if}
			</div>
		{/if}

		<!-- ─── Images upload ─── -->
		<section
			class="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-2"
		>
			<div>
				<h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
					Hero (cover)
				</h2>
				{#if heroImage}
					<img
						src={heroImage}
						alt="Hero"
						class="mb-2 h-32 w-full rounded border border-slate-200 object-cover"
					/>
				{:else}
					<div
						class="mb-2 flex h-32 items-center justify-center rounded border border-dashed border-slate-300 text-xs text-slate-400"
					>
						Aucune image
					</div>
				{/if}
				<form
					method="POST"
					action="?/uploadHero"
					enctype="multipart/form-data"
					use:enhance={() => {
						uploadingHero = true;
						return async ({ update }) => {
							await update();
							uploadingHero = false;
						};
					}}
				>
					<input
						type="file"
						name="file"
						accept="image/jpeg,image/png,image/webp"
						required
						class="block w-full text-xs text-slate-600"
					/>
					<button
						type="submit"
						disabled={uploadingHero}
						class="mt-2 rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50"
					>
						{uploadingHero ? 'Upload…' : 'Remplacer hero'}
					</button>
				</form>
				<p class="mt-2 text-xs text-slate-400">Path actuel : <code>{heroImage || '—'}</code></p>
			</div>

			<div>
				<h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">Logo</h2>
				{#if logoUrl}
					<img
						src={logoUrl}
						alt="Logo"
						class="mb-2 h-32 w-full rounded border border-slate-200 bg-slate-50 object-contain p-2"
					/>
				{:else}
					<div
						class="mb-2 flex h-32 items-center justify-center rounded border border-dashed border-slate-300 text-xs text-slate-400"
					>
						Aucun logo
					</div>
				{/if}
				<form
					method="POST"
					action="?/uploadLogo"
					enctype="multipart/form-data"
					use:enhance={() => {
						uploadingLogo = true;
						return async ({ update }) => {
							await update();
							uploadingLogo = false;
						};
					}}
				>
					<input
						type="file"
						name="file"
						accept="image/jpeg,image/png,image/webp"
						required
						class="block w-full text-xs text-slate-600"
					/>
					<button
						type="submit"
						disabled={uploadingLogo}
						class="mt-2 rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50"
					>
						{uploadingLogo ? 'Upload…' : 'Remplacer logo'}
					</button>
				</form>
				<p class="mt-2 text-xs text-slate-400">Path actuel : <code>{logoUrl || '—'}</code></p>
			</div>
		</section>

		<!-- ─── Form principal ─── -->
		<form
			id="main-form"
			method="POST"
			action="?/save"
			use:enhance={() => {
				saving = true;
				return async ({ update }) => {
					await update();
					saving = false;
				};
			}}
		>
			<!-- Section Essentiels -->
			<section class="mb-6 rounded-lg border border-slate-200 bg-white p-5">
				<h2 class="mb-4 text-base font-semibold text-slate-900">Essentiels</h2>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<label class="block">
						<span class="text-xs font-medium text-slate-700">Nom entreprise *</span>
						<input
							name="businessName"
							bind:value={businessName}
							required
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
						/>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Tagline *</span>
						<input
							name="tagline"
							bind:value={tagline}
							required
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
						/>
					</label>

					<label class="block sm:col-span-2">
						<span class="text-xs font-medium text-slate-700">
							Hero H1 personnalisé
							<span class="font-normal text-slate-500"
								>— override complet du H1 (laisser vide pour le default)</span
							>
						</span>
						<textarea
							name="heroH1"
							bind:value={heroH1}
							rows="2"
							placeholder={`Votre paysagiste\n${heroPrefix} ${(zones.split(',')[0] ?? '').trim() || 'votre commune'}.`}
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
						></textarea>
						<span class="mt-1 block text-[11px] text-slate-500">
							Ligne 1 = top (normal). Ligne 2+ = italique accent. Saut de ligne = nouvelle ligne du
							H1.
						</span>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Prénom gérant</span>
						<input
							name="ownerFirstName"
							bind:value={ownerFirstName}
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
						/>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Nom gérant</span>
						<input
							name="ownerLastName"
							bind:value={ownerLastName}
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
						/>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Téléphone (E.164) *</span>
						<input
							name="phone"
							bind:value={phone}
							required
							pattern="\+\d{'{10,15}'}"
							placeholder="+41XXXXXXXXX"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
						/>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Email *</span>
						<input
							name="email"
							type="email"
							bind:value={email}
							required
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
						/>
						{#if email === 'leads@jonlabs.ch'}
							<span class="mt-1 inline-block text-xs text-amber-600"
								>⚠️ Fallback — remplacer par l'email réel du paysagiste</span
							>
						{/if}
					</label>

					<label class="block sm:col-span-2">
						<span class="text-xs font-medium text-slate-700">Adresse complète</span>
						<input
							name="address"
							bind:value={address}
							placeholder="Rue de Carouge 12, 1227 Carouge"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
						/>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Fiche Google (share.google URL)</span>
						<input
							name="googleProfileUrl"
							bind:value={googleProfileUrl}
							placeholder="https://share.google/..."
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
						/>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Google Maps embed URL</span>
						<input
							name="googleMapsEmbedUrl"
							bind:value={googleMapsEmbedUrl}
							placeholder="https://www.google.com/maps/embed?pb=..."
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						/>
						<span class="mt-1 inline-block text-xs text-slate-400">
							Maps → Partager → <strong>Intégrer une carte</strong> → copier le <code>src=</code> de
							l'iframe (ou paste l'iframe entier, le serveur extrait l'URL). Pas
							<code>maps.app.goo.gl</code> (non embeddable).
						</span>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Logo URL (chemin local ou URL)</span>
						<input
							name="logoUrl"
							bind:value={logoUrl}
							placeholder="/clients/[slug]/logo.png"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						/>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Hero Image (path) *</span>
						<input
							name="heroImage"
							bind:value={heroImage}
							required
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						/>
					</label>
				</div>
			</section>

			<!-- Section CRM -->
			<section class="mb-6 rounded-lg border border-slate-200 bg-white p-5">
				<h2 class="mb-4 text-base font-semibold text-slate-900">CRM</h2>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<label class="block">
						<span class="text-xs font-medium text-slate-700">Status</span>
						<select
							name="crmStatus"
							bind:value={crmStatus}
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
						>
							<option value="a_contacter">À contacter</option>
							<option value="contacte">Contacté</option>
							<option value="repondu">Répondu</option>
							<option value="signe">Signé</option>
							<option value="pas_interesse">Pas intéressé</option>
						</select>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Tier</span>
						<select
							name="crmTier"
							bind:value={crmTier}
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
						>
							<option value="">— Aucun —</option>
							<option value="S">S — Sans site + email</option>
							<option value="A">A — Sans site + tél seul</option>
							<option value="B">B — Sans site, 1-4 avis + email</option>
							<option value="C">C — Sans site, 1-4 avis + tél seul</option>
							<option value="D">D — Site minimal + email</option>
							<option value="E">E — Site minimal + tél seul</option>
							<option value="F">F — Site fonctionnel + email</option>
							<option value="G">G — Site fonctionnel + tél seul</option>
						</select>
					</label>

					<label class="block sm:col-span-2">
						<span class="text-xs font-medium text-slate-700"
							>Site web (URL ou vide si pas de site)</span
						>
						<input
							name="crmWebsiteUrl"
							bind:value={crmWebsiteUrl}
							placeholder="https://..."
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
						/>
					</label>

					<label class="block sm:col-span-2">
						<span class="text-xs font-medium text-slate-700">Notes libres</span>
						<textarea
							name="crmNotes"
							bind:value={crmNotes}
							rows="4"
							placeholder="à rappeler vendredi, recommandé par X..."
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
						></textarea>
					</label>
				</div>
			</section>

			<!-- Section Réseaux + Crédibilité -->
			<details class="mb-6 rounded-lg border border-slate-200 bg-white">
				<summary class="cursor-pointer px-5 py-4 text-base font-semibold text-slate-900"
					>Crédibilité, réseaux sociaux</summary
				>
				<div class="border-t border-slate-200 p-5">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Années d'expérience *</span>
							<input
								name="yearsExperience"
								type="number"
								min="1"
								bind:value={yearsExperience}
								required
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Chantiers réalisés (optionnel)</span>
							<input
								name="chantiersCount"
								type="number"
								min="1"
								bind:value={chantiersCount}
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Note Google (0-5)</span>
							<input
								name="googleRating"
								type="number"
								min="0"
								max="5"
								step="0.1"
								bind:value={googleRating}
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Nombre d'avis Google</span>
							<input
								name="googleReviewsCount"
								type="number"
								min="0"
								bind:value={googleReviewsCount}
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block sm:col-span-2">
							<span class="text-xs font-medium text-slate-700"
								>Zones d'intervention (séparées par virgule) *</span
							>
							<input
								name="zones"
								bind:value={zones}
								required
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Rayon (km) *</span>
							<input
								name="radiusKm"
								type="number"
								min="1"
								bind:value={radiusKm}
								required
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Quiz variant *</span>
							<select
								name="quizVariant"
								bind:value={quizVariant}
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							>
								<option value="B">B — 4 étapes</option>
								<option value="C">C — + inspiration</option>
								<option value="D">D — + champ libre</option>
							</select>
						</label>
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Latitude *</span>
							<input
								name="latitude"
								type="number"
								step="any"
								bind:value={latitude}
								required
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Longitude *</span>
							<input
								name="longitude"
								type="number"
								step="any"
								bind:value={longitude}
								required
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Date création (YYYY-MM-DD)</span>
							<input
								name="createdAt"
								bind:value={createdAt}
								pattern="\d{'{4}'}-\d{'{2}'}-\d{'{2}'}"
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
							/>
						</label>
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Hero préfixe</span>
							<input
								name="heroPrefix"
								bind:value={heroPrefix}
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Hero subline</span>
							<input
								name="heroSubline"
								bind:value={heroSubline}
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block sm:col-span-2 grid grid-cols-3 gap-3">
							<div>
								<span class="text-xs font-medium text-slate-700">Avis Google URL</span>
								<input
									name="googleReviewUrl"
									bind:value={googleReviewUrl}
									class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
								/>
							</div>
							<div>
								<span class="text-xs font-medium text-slate-700">Facebook URL</span>
								<input
									name="facebookUrl"
									bind:value={facebookUrl}
									class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
								/>
							</div>
							<div>
								<span class="text-xs font-medium text-slate-700">Instagram URL</span>
								<input
									name="instagramUrl"
									bind:value={instagramUrl}
									class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
								/>
							</div>
						</label>
					</div>
				</div>
			</details>

			<!-- Section Lead Delivery -->
			<details class="mb-6 rounded-lg border border-slate-200 bg-white">
				<summary class="cursor-pointer px-5 py-4 text-base font-semibold text-slate-900"
					>Lead delivery</summary
				>
				<div class="border-t border-slate-200 p-5">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Recipient email *</span>
							<input
								name="recipientEmail"
								type="email"
								bind:value={recipientEmail}
								required
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block">
							<span class="text-xs font-medium text-slate-700">Subject prefix *</span>
							<input
								name="subjectPrefix"
								bind:value={subjectPrefix}
								required
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
						<label class="block sm:col-span-2">
							<span class="text-xs font-medium text-slate-700">CC emails (séparés par virgule)</span
							>
							<input
								name="ccEmails"
								bind:value={ccEmails}
								class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
							/>
						</label>
					</div>
				</div>
			</details>

			<!-- Section JSON avancée -->
			<details class="mb-6 rounded-lg border border-slate-200 bg-white">
				<summary class="cursor-pointer px-5 py-4 text-base font-semibold text-slate-900"
					>Avancé (JSON brut)</summary
				>
				<div class="space-y-4 border-t border-slate-200 p-5">
					<p class="text-xs text-slate-500">
						Édition libre des sections complexes (validées par Zod au save). Touche le format avec
						parcimonie.
					</p>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Branding</span>
						<textarea
							name="branding"
							bind:value={branding}
							rows="6"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						></textarea>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Services</span>
						<textarea
							name="services"
							bind:value={services}
							rows="14"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						></textarea>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Realizations</span>
						<textarea
							name="realizations"
							bind:value={realizations}
							rows="10"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						></textarea>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Testimonials</span>
						<textarea
							name="testimonials"
							bind:value={testimonials}
							rows="10"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						></textarea>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">FAQ</span>
						<textarea
							name="faq"
							bind:value={faq}
							rows="10"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						></textarea>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">Communes (array)</span>
						<textarea
							name="communes"
							bind:value={communes}
							rows="6"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						></textarea>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">salesPage</span>
						<textarea
							name="salesPage"
							bind:value={salesPage}
							rows="5"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						></textarea>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">localMarket</span>
						<textarea
							name="localMarket"
							bind:value={localMarket}
							rows="4"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						></textarea>
					</label>

					<label class="block">
						<span class="text-xs font-medium text-slate-700">inspirationGallery (variante C)</span>
						<textarea
							name="inspirationGallery"
							bind:value={inspirationGallery}
							rows="6"
							class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-xs"
						></textarea>
					</label>
				</div>
			</details>

			<!-- Bouton Save dans le form principal -->
			<div class="flex justify-end rounded-lg border border-slate-200 bg-white p-4">
				<button
					type="submit"
					disabled={saving}
					class="rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
				>
					{saving ? 'Sauvegarde…' : 'Sauvegarder'}
				</button>
			</div>
		</form>

		<!-- Form delete séparé -->
		<form
			method="POST"
			action="?/delete"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
				};
			}}
			onsubmit={(e) => {
				if (
					!confirm(
						`Supprimer définitivement ${data.slug} ?\n\nLe dossier static/clients/${data.slug}/ sera effacé.`
					)
				) {
					e.preventDefault();
				}
			}}
			class="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4"
		>
			<button
				type="submit"
				class="rounded border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
			>
				🗑 Supprimer ce prospect
			</button>
			<p class="mt-2 text-xs text-rose-700">
				Action irréversible — le dossier <code>static/clients/{data.slug}/</code> sera effacé.
			</p>
		</form>
	</div>
</div>
