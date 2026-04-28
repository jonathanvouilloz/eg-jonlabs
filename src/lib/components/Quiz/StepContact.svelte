<script lang="ts">
	import type { QuizVariant } from '$types/prospect';
	import type { PreferredContact } from '$stores/quizState.svelte';
	import { formatSwissPhoneInput, isValidSwissPhone } from '$utils/phone';

	let {
		firstName,
		lastName,
		email,
		phone,
		preferredContact,
		consentGdpr,
		honeypot,
		variant,
		freeText,
		onUpdate
	}: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		preferredContact: PreferredContact;
		consentGdpr: boolean;
		honeypot: string;
		variant: QuizVariant;
		freeText: string;
		onUpdate: (field: string, value: string | boolean) => void;
	} = $props();

	let emailTouched = $state(false);
	let phoneTouched = $state(false);
	let emailFocused = $state(false);

	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const EMAIL_DOMAINS = [
		'gmail.com',
		'hotmail.com',
		'outlook.com',
		'icloud.com',
		'bluewin.ch',
		'sunrise.ch',
		'protonmail.com',
		'yahoo.fr',
		'orange.ch'
	];

	let emailInvalid = $derived(emailTouched && email.length > 0 && !EMAIL_RE.test(email));
	let phoneInvalid = $derived(phoneTouched && phone.length > 0 && !isValidSwissPhone(phone));

	let emailSuggestions = $derived.by(() => {
		const at = email.lastIndexOf('@');
		if (at < 0) return [] as string[];
		const local = email.slice(0, at);
		if (local.length < 1) return [];
		const domainTyped = email.slice(at + 1).toLowerCase();
		const matches = EMAIL_DOMAINS.filter((d) => d.startsWith(domainTyped));
		if (matches.length === 1 && matches[0] === domainTyped) return [];
		return matches.slice(0, 5).map((d) => `${local}@${d}`);
	});

	function handlePhone(value: string) {
		const formatted = formatSwissPhoneInput(value);
		onUpdate('phone', formatted);
	}

	function pickEmailSuggestion(s: string) {
		onUpdate('email', s);
		emailFocused = false;
	}
</script>

<div>
	<h3 class="mb-4 text-xl font-semibold">Vos coordonnées</h3>

	<div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<label class="block">
			<span class="mb-1 block text-sm text-text-muted">Prénom *</span>
			<input
				type="text"
				value={firstName}
				oninput={(e) => onUpdate('firstName', e.currentTarget.value)}
				placeholder="Jean"
				class="w-full border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-primary"
			/>
		</label>
		<label class="block">
			<span class="mb-1 block text-sm text-text-muted">Nom</span>
			<input
				type="text"
				value={lastName}
				oninput={(e) => onUpdate('lastName', e.currentTarget.value)}
				placeholder="Dupont"
				class="w-full border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-primary"
			/>
		</label>
	</div>

	<div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div>
			<label class="block">
				<span class="mb-1 block text-sm text-text-muted">Email *</span>
				<div class="relative">
					<input
						type="email"
						value={email}
						oninput={(e) => onUpdate('email', e.currentTarget.value)}
						onfocus={() => (emailFocused = true)}
						onblur={() => {
							emailTouched = true;
							setTimeout(() => (emailFocused = false), 150);
						}}
						placeholder="jean@exemple.ch"
						autocomplete="email"
						class="w-full border-2 bg-white px-4 py-3 text-sm outline-none transition-all duration-200
							{emailInvalid ? 'border-red-400' : 'border-gray-200 focus:border-primary'}"
					/>
					{#if emailFocused && emailSuggestions.length > 0}
						<ul class="absolute z-20 mt-1 w-full border border-gray-200 bg-white shadow-lg">
							{#each emailSuggestions as s (s)}
								<li>
									<button
										type="button"
										class="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-primary/10 hover:text-primary"
										onmousedown={() => pickEmailSuggestion(s)}
									>
										{s}
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</label>
			{#if emailInvalid}
				<p class="mt-1 text-xs text-red-500">Veuillez entrer un email valide</p>
			{/if}
		</div>

		<div>
			<label class="block">
				<span class="mb-1 block text-sm text-text-muted">Téléphone *</span>
				<input
					type="tel"
					value={phone}
					oninput={(e) => handlePhone(e.currentTarget.value)}
					onblur={() => (phoneTouched = true)}
					placeholder="079 123 45 67"
					inputmode="tel"
					autocomplete="tel"
					class="w-full border-2 bg-white px-4 py-3 text-sm outline-none transition-all duration-200
						{phoneInvalid ? 'border-red-400' : 'border-gray-200 focus:border-primary'}"
				/>
			</label>
			{#if phoneInvalid}
				<p class="mt-1 text-xs text-red-500">Numéro suisse invalide (ex : 079 123 45 67)</p>
			{/if}
		</div>
	</div>

	<div class="mb-5">
		<span class="mb-2 block text-sm text-text-muted">Comment préférez-vous être contacté ?</span>
		<div class="grid grid-cols-3 gap-3">
			<button
				type="button"
				class="flex flex-col items-center justify-center gap-2 border-2 px-3 py-4 text-sm transition-all duration-200
					{preferredContact === 'phone'
					? 'border-primary bg-primary/5 font-medium text-primary'
					: 'border-gray-200 bg-white hover:border-primary/40'}"
				onclick={() => onUpdate('preferredContact', 'phone')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
					/>
				</svg>
				<span>Téléphone</span>
			</button>
			<button
				type="button"
				class="flex flex-col items-center justify-center gap-2 border-2 px-3 py-4 text-sm transition-all duration-200
					{preferredContact === 'email'
					? 'border-primary bg-primary/5 font-medium text-primary'
					: 'border-gray-200 bg-white hover:border-primary/40'}"
				onclick={() => onUpdate('preferredContact', 'email')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
					/>
				</svg>
				<span>Email</span>
			</button>
			<button
				type="button"
				class="flex flex-col items-center justify-center gap-2 border-2 px-3 py-4 text-sm transition-all duration-200
					{preferredContact === 'any'
					? 'border-primary bg-primary/5 font-medium text-primary'
					: 'border-gray-200 bg-white hover:border-primary/40'}"
				onclick={() => onUpdate('preferredContact', 'any')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6.633 10.25c.806 1.533 2.084 2.811 3.617 3.617l1.27-.765a1.125 1.125 0 0 1 1.172.072l2.912 2.12c.396.289.546.804.353 1.25a8.993 8.993 0 0 1-3.57 3.96c-.5.276-1.115.28-1.596-.046a16.07 16.07 0 0 1-6.836-6.836c-.326-.481-.322-1.096-.046-1.596a8.993 8.993 0 0 1 3.96-3.57c.446-.193.961-.043 1.25.353l2.12 2.912a1.125 1.125 0 0 1 .072 1.172l-.765 1.27ZM15.75 3.75v3m0 0v3m0-3h3m-3 0h-3"
					/>
				</svg>
				<span>Peu importe</span>
			</button>
		</div>
	</div>

	{#if variant === 'D'}
		<div class="mb-4">
			<label class="block">
				<span class="mb-1 block text-sm text-text-muted">Décrivez votre projet (optionnel)</span>
				<textarea
					value={freeText}
					oninput={(e) => onUpdate('freeText', e.currentTarget.value)}
					placeholder="Décrivez vos besoins, vos envies…"
					rows="3"
					class="w-full resize-none border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-primary"
				></textarea>
			</label>
		</div>
	{/if}

	<!-- Honeypot anti-spam -->
	<div class="absolute -left-[9999px] opacity-0" aria-hidden="true">
		<input
			type="text"
			name="website"
			tabindex="-1"
			autocomplete="off"
			value={honeypot}
			oninput={(e) => onUpdate('honeypot', e.currentTarget.value)}
		/>
	</div>

	<label class="flex items-start gap-3">
		<input
			type="checkbox"
			checked={consentGdpr}
			onchange={(e) => onUpdate('consentGdpr', e.currentTarget.checked)}
			class="mt-1 h-4 w-4 accent-primary"
		/>
		<span class="text-xs text-text-muted">
			J'accepte que mes données soient transmises à l'entreprise pour recevoir un devis. Aucune
			utilisation commerciale tierce. *
		</span>
	</label>
</div>
