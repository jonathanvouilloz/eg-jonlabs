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

	const inputClass =
		'w-full border bg-bg px-4 py-3.5 text-sm text-text outline-none transition-all duration-150 focus:border-primary';
	const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-text-muted';
</script>

<div>
	<h3 class="mb-6 text-xl font-normal text-text">Pour vous recontacter</h3>

	<div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<label class="block">
			<span class={labelClass} style="font-family: var(--font-body);">Prénom *</span>
			<input
				type="text"
				value={firstName}
				oninput={(e) => onUpdate('firstName', e.currentTarget.value)}
				placeholder="Jean"
				class="{inputClass} border-text/15"
				style="font-family: var(--font-body);"
			/>
		</label>
		<label class="block">
			<span class={labelClass} style="font-family: var(--font-body);">Nom</span>
			<input
				type="text"
				value={lastName}
				oninput={(e) => onUpdate('lastName', e.currentTarget.value)}
				placeholder="Dupont"
				class="{inputClass} border-text/15"
				style="font-family: var(--font-body);"
			/>
		</label>
	</div>

	<div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div>
			<label class="block">
				<span class={labelClass} style="font-family: var(--font-body);">Email *</span>
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
						class="{inputClass} {emailInvalid ? 'border-red-400' : 'border-text/15'}"
						style="font-family: var(--font-body);"
					/>
					{#if emailFocused && emailSuggestions.length > 0}
						<ul class="absolute z-20 mt-0.5 w-full border border-text/10 bg-bg shadow-md">
							{#each emailSuggestions as s (s)}
								<li>
									<button
										type="button"
										class="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary/60"
										style="font-family: var(--font-body);"
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
				<p class="mt-1 text-xs text-red-500" style="font-family: var(--font-body);">
					Email invalide
				</p>
			{/if}
		</div>

		<div>
			<label class="block">
				<span class={labelClass} style="font-family: var(--font-body);">Téléphone *</span>
				<input
					type="tel"
					value={phone}
					oninput={(e) => handlePhone(e.currentTarget.value)}
					onblur={() => (phoneTouched = true)}
					placeholder="079 123 45 67"
					inputmode="tel"
					autocomplete="tel"
					class="{inputClass} {phoneInvalid ? 'border-red-400' : 'border-text/15'}"
					style="font-family: var(--font-body);"
				/>
			</label>
			{#if phoneInvalid}
				<p class="mt-1 text-xs text-red-500" style="font-family: var(--font-body);">
					Numéro suisse invalide
				</p>
			{/if}
		</div>
	</div>

	<div class="mb-5">
		<span
			class="mb-2.5 block text-xs font-medium uppercase tracking-[0.1em] text-text-muted"
			style="font-family: var(--font-body);"
		>
			Contact préféré
		</span>
		<div class="flex gap-2">
			{#each [{ value: 'phone', label: 'Téléphone' }, { value: 'email', label: 'Email' }, { value: 'any', label: 'Indifférent' }] as opt (opt.value)}
				<button
					type="button"
					class="flex-1 border py-2.5 text-xs font-medium uppercase tracking-[0.08em] transition-all duration-150
						{preferredContact === opt.value
						? 'border-primary bg-primary text-white'
						: 'border-text/15 bg-bg text-text-muted hover:border-primary/40'}"
					style="font-family: var(--font-body);"
					onclick={() => onUpdate('preferredContact', opt.value)}
				>
					{opt.label}
				</button>
			{/each}
		</div>
	</div>

	{#if variant === 'D'}
		<div class="mb-4">
			<label class="block">
				<span class={labelClass} style="font-family: var(--font-body);">
					Décrivez votre projet (optionnel)
				</span>
				<textarea
					value={freeText}
					oninput={(e) => onUpdate('freeText', e.currentTarget.value)}
					placeholder="Décrivez vos besoins, vos envies…"
					rows="3"
					class="w-full resize-none border border-text/15 bg-bg px-4 py-3.5 text-sm text-text outline-none transition-all duration-150 focus:border-primary"
					style="font-family: var(--font-body);"
				></textarea>
			</label>
		</div>
	{/if}

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
			class="mt-0.5 h-4 w-4 accent-primary"
		/>
		<span class="text-xs leading-relaxed text-text-muted" style="font-family: var(--font-body);">
			J'accepte que mes données soient transmises à l'entreprise pour recevoir un devis. Aucune
			utilisation commerciale tierce. *
		</span>
	</label>
</div>
