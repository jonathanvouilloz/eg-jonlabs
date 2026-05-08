<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let slug = $state('');
	let name = $state('');
	let phone = $state('');
	let email = $state('');
	let locality = $state('');
	let latitude = $state(46.2);
	let longitude = $state(6.15);
	let saving = $state(false);

	function slugifyFromName() {
		if (!slug && name) {
			slug = name
				.toLowerCase()
				.normalize('NFD')
				.replace(/[̀-ͯ]/g, '')
				.replace(/sàrl|s\.a\.|sa\b|sàrl\b|gmbh|snc/gi, '')
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '')
				.slice(0, 64);
		}
	}
</script>

<svelte:head>
	<title>Nouveau prospect · Admin</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 px-6 py-10">
	<div class="mx-auto max-w-3xl">
		<header class="mb-6">
			<a href="/admin" class="text-sm text-slate-500 hover:text-slate-700">← Retour à la liste</a>
			<h1 class="mt-1 text-2xl font-semibold text-slate-900">Nouveau prospect</h1>
			<p class="text-sm text-slate-500">
				Crée un prospect minimal — tu pourras enrichir après dans la page d'édition.
			</p>
		</header>

		{#if form?.error}
			<div
				class="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800"
			>
				<strong>Erreur :</strong>
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				saving = true;
				return async ({ update }) => {
					await update();
					saving = false;
				};
			}}
			class="space-y-4 rounded-lg border border-slate-200 bg-white p-6"
		>
			<label class="block">
				<span class="text-xs font-medium text-slate-700">Nom de l'entreprise *</span>
				<input
					name="name"
					bind:value={name}
					onblur={slugifyFromName}
					required
					placeholder="GT Paysages Sàrl"
					class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
				/>
			</label>

			<label class="block">
				<span class="text-xs font-medium text-slate-700"
					>Slug * (auto-rempli depuis le nom au tab)</span
				>
				<input
					name="slug"
					bind:value={slug}
					required
					pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
					placeholder="gt-paysages"
					class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
				/>
				<span class="mt-1 inline-block text-xs text-slate-400"
					>kebab-case, sans accents, a-z 0-9 -</span
				>
			</label>

			<div class="grid grid-cols-2 gap-4">
				<label class="block">
					<span class="text-xs font-medium text-slate-700">Téléphone (E.164) *</span>
					<input
						name="phone"
						bind:value={phone}
						required
						pattern="\+\d{'{10,15}'}"
						placeholder="+41788580404"
						class="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
					/>
				</label>

				<label class="block">
					<span class="text-xs font-medium text-slate-700">Email (vide = leads@jonlabs.ch)</span>
					<input
						name="email"
						type="email"
						bind:value={email}
						placeholder="contact@example.ch"
						class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
					/>
				</label>
			</div>

			<label class="block">
				<span class="text-xs font-medium text-slate-700">Localité *</span>
				<input
					name="locality"
					bind:value={locality}
					required
					placeholder="Genève"
					class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
				/>
			</label>

			<div class="grid grid-cols-2 gap-4">
				<label class="block">
					<span class="text-xs font-medium text-slate-700">Latitude</span>
					<input
						name="latitude"
						type="number"
						step="any"
						bind:value={latitude}
						class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
					/>
				</label>

				<label class="block">
					<span class="text-xs font-medium text-slate-700">Longitude</span>
					<input
						name="longitude"
						type="number"
						step="any"
						bind:value={longitude}
						class="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
					/>
				</label>
			</div>

			<p class="rounded bg-slate-50 px-3 py-2 text-xs text-slate-500">
				Auto-rempli après création : 4 services standard, branding par défaut (palette deep),
				zones=[localité], transparencyNote=true, status CRM "à contacter". Tu pourras tout modifier
				dans la page d'édition.
			</p>

			<div class="flex justify-end pt-2">
				<button
					type="submit"
					disabled={saving}
					class="rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
				>
					{saving ? 'Création…' : 'Créer le prospect'}
				</button>
			</div>
		</form>
	</div>
</div>
