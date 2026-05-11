<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import type { CrmStatus, CrmTier } from '$types/prospect';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let filterTier = $state<CrmTier | 'all'>('all');
	let filterStatus = $state<CrmStatus | 'all'>('all');
	let filterCanton = $state<string>('all');
	let search = $state('');

	const cantons = $derived(
		Array.from(new Set(data.prospects.map((p) => p.canton).filter((c): c is string => !!c))).sort()
	);

	const filtered = $derived(
		data.prospects.filter((p) => {
			if (filterTier !== 'all' && p.tier !== filterTier) return false;
			if (filterStatus !== 'all' && p.status !== filterStatus) return false;
			if (filterCanton !== 'all' && p.canton !== filterCanton) return false;
			if (search) {
				const q = search.toLowerCase();
				if (
					!p.name.toLowerCase().includes(q) &&
					!p.slug.includes(q) &&
					!p.owner.toLowerCase().includes(q)
				) {
					return false;
				}
			}
			return true;
		})
	);

	const STATUS_LABELS: Record<CrmStatus, string> = {
		a_contacter: 'À contacter',
		contacte: 'Contacté',
		repondu: 'Répondu',
		signe: 'Signé',
		pas_interesse: 'Pas intéressé'
	};

	const STATUS_COLORS: Record<CrmStatus, string> = {
		a_contacter: 'bg-slate-100 text-slate-700',
		contacte: 'bg-blue-100 text-blue-700',
		repondu: 'bg-amber-100 text-amber-700',
		signe: 'bg-emerald-100 text-emerald-700',
		pas_interesse: 'bg-rose-100 text-rose-700'
	};

	// Heat map thermique des tiers — du plus chaud (urgence top) au plus froid (low priority).
	// Variant saturé = avec email (facile à contacter), variant clair = tél seul (plus dur).
	const TIER_COLORS: Record<CrmTier, string> = {
		S: 'bg-rose-600 text-white', // sans site + email → urgence max
		A: 'bg-rose-300 text-rose-900', // sans site + tél seul
		B: 'bg-orange-500 text-white', // sans site, 1-4 avis + email
		C: 'bg-orange-200 text-orange-900', // sans site, 1-4 avis + tél seul
		D: 'bg-amber-400 text-amber-950', // site minimal + email
		E: 'bg-amber-200 text-amber-900', // site minimal + tél seul
		F: 'bg-slate-500 text-white', // site fonctionnel + email
		G: 'bg-slate-300 text-slate-700' // site fonctionnel + tél seul → low priority
	};

	function flag(ok: boolean): string {
		return ok ? '✓' : '✗';
	}
</script>

<svelte:head>
	<title>Admin · CRM prospects</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 px-6 py-10">
	<div class="mx-auto max-w-7xl">
		<header class="mb-8 flex items-end justify-between">
			<div>
				<h1 class="text-3xl font-semibold text-slate-900">CRM prospects</h1>
				<p class="text-sm text-slate-500">{filtered.length} / {data.prospects.length} prospects</p>
			</div>
			<a
				href="/admin/new"
				class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
			>
				+ Nouveau prospect
			</a>
		</header>

		{#if form?.success}
			<div
				class="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800"
			>
				Supprimé : <code>{form.deletedSlug}</code>
			</div>
		{/if}
		{#if form?.error}
			<div
				class="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800"
			>
				Erreur : {form.error}
			</div>
		{/if}

		<div
			class="mb-6 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-4"
		>
			<input
				type="search"
				placeholder="Recherche slug, nom, gérant..."
				bind:value={search}
				class="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
			/>
			<select bind:value={filterTier} class="rounded-md border border-slate-300 px-3 py-2 text-sm">
				<option value="all">Tous les tiers</option>
				<option value="S">Tier S</option>
				<option value="A">Tier A</option>
				<option value="B">Tier B</option>
				<option value="C">Tier C</option>
				<option value="D">Tier D</option>
				<option value="E">Tier E</option>
				<option value="F">Tier F</option>
				<option value="G">Tier G</option>
			</select>
			<select
				bind:value={filterStatus}
				class="rounded-md border border-slate-300 px-3 py-2 text-sm"
			>
				<option value="all">Tous les statuts</option>
				<option value="a_contacter">À contacter</option>
				<option value="contacte">Contacté</option>
				<option value="repondu">Répondu</option>
				<option value="signe">Signé</option>
				<option value="pas_interesse">Pas intéressé</option>
			</select>
			{#if cantons.length > 1}
				<select
					bind:value={filterCanton}
					class="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-4"
				>
					<option value="all">Tous les cantons</option>
					{#each cantons as c (c)}
						<option value={c}>{c}</option>
					{/each}
				</select>
			{/if}
		</div>

		<div class="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
			<table class="min-w-full divide-y divide-slate-200 text-sm">
				<thead class="bg-slate-50">
					<tr class="text-left text-xs font-medium uppercase tracking-wider text-slate-500">
						<th class="px-4 py-3">Tier</th>
						<th class="px-4 py-3">Status</th>
						<th class="px-4 py-3">Slug / Nom</th>
						<th class="px-4 py-3">Canton</th>
						<th class="px-4 py-3">Gérant</th>
						<th class="px-4 py-3">Phone</th>
						<th class="px-4 py-3">Email</th>
						<th class="px-4 py-3 text-center" title="Owner">O</th>
						<th class="px-4 py-3 text-center" title="Email réel">M</th>
						<th class="px-4 py-3 text-center" title="GMB">G</th>
						<th class="px-4 py-3 text-center" title="Logo">L</th>
						<th class="px-4 py-3 text-center" title="Hero local">H</th>
						<th class="px-4 py-3"></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100">
					{#each filtered as p (p.slug)}
						<tr class="hover:bg-slate-50">
							<td class="px-4 py-3">
								{#if p.tier}
									<span
										class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold {TIER_COLORS[
											p.tier
										]}"
									>
										{p.tier}
									</span>
								{:else}
									<span class="text-slate-300">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								<span
									class="inline-block rounded-full px-2 py-0.5 text-xs font-medium {STATUS_COLORS[
										p.status
									]}"
								>
									{STATUS_LABELS[p.status]}
								</span>
							</td>
							<td class="px-4 py-3">
								<a href="/admin/{p.slug}" class="block">
									<div class="font-medium text-slate-900">{p.name}</div>
									<div class="font-mono text-xs text-slate-500">{p.slug}</div>
								</a>
							</td>
							<td class="px-4 py-3 text-slate-600">{p.canton ?? '—'}</td>
							<td class="px-4 py-3 text-slate-700">{p.owner || '—'}</td>
							<td class="px-4 py-3 font-mono text-xs text-slate-600">{p.phone}</td>
							<td class="px-4 py-3 text-xs text-slate-600">{p.email}</td>
							<td class="px-4 py-3 text-center {p.hasOwner ? 'text-emerald-600' : 'text-slate-300'}"
								>{flag(p.hasOwner)}</td
							>
							<td
								class="px-4 py-3 text-center {p.hasRealEmail
									? 'text-emerald-600'
									: 'text-slate-300'}">{flag(p.hasRealEmail)}</td
							>
							<td class="px-4 py-3 text-center {p.hasGmb ? 'text-emerald-600' : 'text-slate-300'}"
								>{flag(p.hasGmb)}</td
							>
							<td class="px-4 py-3 text-center {p.hasLogo ? 'text-emerald-600' : 'text-slate-300'}"
								>{flag(p.hasLogo)}</td
							>
							<td class="px-4 py-3 text-center {p.hasHero ? 'text-emerald-600' : 'text-slate-300'}"
								>{flag(p.hasHero)}</td
							>
							<td class="px-4 py-3 text-right">
								<div class="flex justify-end gap-2">
									<a
										href="/atelier/{p.slug}"
										target="_blank"
										rel="noopener"
										class="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
										title="Voir l'atelier"
									>
										↗
									</a>
									<a
										href="/admin/{p.slug}"
										class="rounded bg-slate-900 px-3 py-1 text-xs text-white hover:bg-slate-700"
									>
										Éditer
									</a>
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
													`Supprimer définitivement ${p.slug} ?\n(Le dossier static/clients/${p.slug}/ sera effacé)`
												)
											) {
												e.preventDefault();
											}
										}}
									>
										<input type="hidden" name="slug" value={p.slug} />
										<button
											type="submit"
											class="rounded border border-rose-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
											title="Supprimer"
										>
											🗑
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
					{#if filtered.length === 0}
						<tr>
							<td colspan="13" class="px-4 py-12 text-center text-slate-400">
								Aucun prospect trouvé.
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>

		<footer class="mt-6 text-xs text-slate-400">
			<p>
				Légende colonnes : <strong>O</strong> = owner rempli · <strong>M</strong> = email réel (pas
				leads@jonlabs.ch) · <strong>G</strong> = fiche Google · <strong>L</strong> = logo ·
				<strong>H</strong> = hero local (pas Unsplash)
			</p>
			<p class="mt-1">
				Admin dev-only · {data.prospects.length} prospects sous <code>static/clients/</code>
			</p>
		</footer>
	</div>
</div>
