# PRD — EG Page Devis Personnalisée (Jon Labs)

> **Version :** 1.0
> **Date :** 2026-04-28
> **Auteur :** Jonathan Vouilloz
> **Statut :** Draft → Prêt pour développement
> **Nom de code projet :** `eg-devis` (interne) / `Page Devis Express` (commercial)

---

## 0. Résumé exécutif

**Échantillon Gratuit (EG)** envoyé en cold prospection à des paysagistes solo de Suisse romande dans le cadre du **Pack Paysagistes** de Jon Labs Local.

L'EG est une **page web de demande de devis personnalisée**, déployée à l'URL `jonlabs.ch/eg/[slug-prospect]`, contenant un quiz multi-étapes calibré pour le métier du prospect, ses photos, ses couleurs et son nom.

Le but : déclencher un appel commercial avec le prospect en lui livrant une **transformation tangible** avant la vente (vs un audit ou une promesse).

**Métriques de succès V1 :**

- 🎯 **Conversion EG → call** : ≥ 20 % des prospects à qui un EG est envoyé acceptent un appel
- 🎯 **Conversion call → client Pack Paysagistes** : ≥ 15 %
- 🎯 **Temps de production par EG** (après boilerplate) : ≤ 1h30

---

## 1. Vision & Contexte

### Problème

Les freelances en Suisse romande qui font de la prospection cold envoient majoritairement deux types de "cadeaux" pour décrocher un call :

1. Des **audits gratuits** (PDF impersonnels, lus 1 fois sur 4)
2. Des **appels découverte** (refusés à 90 %)

Aucune des deux approches ne **prouve la valeur** avant la vente. Le prospect doit imaginer le résultat — et n'imagine pas, donc ne convertit pas.

Côté paysagiste prospect spécifiquement, leur vraie douleur n'est pas "ma fiche Google est nulle" mais **"mes leads sont imprévisibles, surtout l'hiver"**. La majorité a un site avec un formulaire de contact basique qui convertit à 1-3 %, et n'a pas conscience qu'un tunnel de devis bien conçu peut tripler ce chiffre.

### Solution

Une page web de demande de devis personnalisée, livrée en cold avant tout engagement, qui :

- Affiche le **nom, les couleurs, les photos et les services réels** du paysagiste prospect
- Propose un **quiz interactif multi-étapes** qui qualifie le client final (type de prestation, surface, urgence, zone)
- Envoie le lead **directement par email au paysagiste**
- Est utilisable telle quelle, même si le prospect ne signe jamais avec Jon Labs

### Utilisateur cible (3 acteurs)

#### 👨 Acteur 1 — Le paysagiste prospect (cible commerciale)

- **Profil** : homme, 40-55 ans, paysagiste solo ou avec 1-2 employés, Genève / Vaud / parfois Valais et Fribourg
- **Présence digitale actuelle** : GMB peu/pas optimisée, site web absent ou daté (souvent fait par un cousin il y a 8 ans), réseaux sociaux irréguliers
- **Source actuelle de leads** : 80 % bouche-à-oreille, 20 % recherche locale Google
- **Anxiété principale** : _"Comment je remplis mon planning d'hiver ? Comment je sais que j'aurai assez de chantiers en mars ?"_
- **Compétences digitales** : faibles à moyennes
- **Tactiques actuelles infructueuses** : tracts, encarts pages jaunes, parfois Google Ads mal calibré

#### 👤 Acteur 2 — Le client final du paysagiste (utilisateur réel du quiz)

- **Profil** : propriétaire d'une maison ou d'un appartement avec jardin/terrasse en Suisse romande
- **Contexte** : cherche un paysagiste pour une prestation ponctuelle ou récurrente
- **Frustrations** : ne sait pas estimer un budget, ne veut pas un appel commercial avant d'avoir une fourchette, hésite entre plusieurs prestataires
- **Comportement** : compare 2-3 paysagistes en parallèle, préfère le formulaire aux appels téléphoniques pour la première prise de contact
- **Device dominant** : 60-70 % mobile, 30-40 % desktop

#### 🛠️ Acteur 3 — Jonathan / Jon Labs (admin invisible)

- **Besoin** : créer un nouveau prospect en 5-10 min une fois les assets collectés
- **Volume cible V1** : capacité à gérer 20-30 EG en parallèle sans dette technique
- **Compétences** : développeur (a Claude Code), pas de friction technique

### Succès

**V1.0 sera un succès si :**

- ✅ 5 paysagistes prospects ont reçu un EG dans le mois suivant le déploiement
- ✅ 1 prospect au minimum accepte un call sur les 5 premiers EG (taux de 20 %)
- ✅ Le temps de production d'un EG (collecte + config + déploiement) tombe à ≤ 1h30 dès le 3ème prospect
- ✅ Au moins 1 lead réel est généré sur les pages déployées (preuve d'efficacité du tunnel)

**Indicateur d'échec à surveiller :**

- ⚠️ Si après 10 EG envoyés, taux de réponse < 10 % → revoir le mail cold ou le ciblage avant de remettre en cause la page
- ⚠️ Si temps de production > 2h après 5 prospects → automatiser la collecte d'assets

---

## 2. Scope V1.0

### ✅ IN — Ce qu'on fait dans la V1.0

- [ ] **Route dynamique** `/eg/[slug]` chargeant une config JSON par prospect
- [ ] **Page devis responsive** (équilibrée mobile + desktop)
- [ ] **Quiz interactif** avec 3 variantes sélectionnables par config :
  - Variante B : 4 étapes (prestation → quand+où → surface → coordonnées)
  - Variante C : 5 étapes (avec galerie d'inspiration)
  - Variante D : 4 étapes + champ libre optionnel
- [ ] **Personnalisation par config** : nom, prénom, logo, photo héros, couleurs, services, photos services, zones, années expérience, témoignages, FAQ, fourchettes prix
- [ ] **Soumission de lead par email** via Resend, envoyée directement au paysagiste avec `Reply-To` du client final
- [ ] **BCC silencieux** à `leads@jonlabs.ch` pour monitoring interne
- [ ] **Page de confirmation** après soumission (`/eg/[slug]/merci`)
- [ ] **Schéma JSON générique** (naming métier-agnostique) pour permettre la V1.1 sans refactor
- [ ] **Plausible Analytics** sur la racine `jonlabs.ch` (pageviews uniquement, pas d'événements custom)
- [ ] **Banque de photos fallback** dans `/static/_fallback/` pour les prospects sans assets
- [ ] **Branding Jon Labs discret** dans le footer (1 ligne mention)

### ❌ OUT — Ce qu'on ne fait PAS en V1.0 (volontairement)

- ❌ Backend / base de données (pas de Turso, pas de Drizzle)
- ❌ Dashboard admin pour Jon Labs
- ❌ Tracking d'événements (start_quiz, step_completed, submit, etc.)
- ❌ Calcul de taux de conversion par page
- ❌ Argument commercial chiffré "votre page convertit à X %"
- ❌ Multi-métiers (électriciens, plombiers, etc.)
- ❌ Authentification / login
- ❌ Système de modification de config par le paysagiste lui-même
- ❌ Domaine custom par paysagiste (`paysages-dupont.ch`)
- ❌ A/B testing intégré
- ❌ SMS / WhatsApp comme canal de soumission alternatif
- ❌ Intégration CRM (HubSpot, Pipedrive)
- ❌ Calendrier intégré pour prendre RDV directement

### 🔮 LATER — Roadmap après V1.0

| Version                                | Contenu                                                                                                                              | Effort estimé | Trigger de lancement                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------- | -------------------------------------------------- |
| **V1.1 — Multi-métiers**               | Étendre config schema avec `industry`, étapes optionnelles selon métier, templates pour électriciens / plombiers / artisans bâtiment | +4-6h         | Quand 1er prospect d'un autre métier accepte un EG |
| **V1.2 — Tracking conversion**         | Backend SvelteKit + DB Turso + tracking événements quiz + dashboard admin Jon Labs simple                                            | +8-12h        | Quand 5+ pages live en production simultanément    |
| **V1.3 — Argument commercial chiffré** | Section "preuve" dans le pitch commercial avec données réelles agrégées sur 3+ mois                                                  | 0h dev        | Quand 3 mois de data sur 10+ pages                 |
| **V2.0 — Page devis SaaS**             | Dashboard self-service où le paysagiste configure sa propre page, tarification mensuelle                                             | +40-60h       | Si V1.x convertit ≥ 20 % en clients Pack           |

---

## 3. User Stories & Flows

### Story 1 : Le paysagiste prospect découvre son EG

**En tant que** paysagiste prospect
**Je veux** voir une version personnalisée d'une page de devis à mon nom
**Afin de** évaluer si Jon Labs comprend mon métier et peut me livrer quelque chose d'utile

**Flow détaillé :**

1. Le prospect reçoit un cold email/appel de Jonathan mentionnant le lien `jonlabs.ch/eg/[son-slug]`
2. Il clique sur le lien depuis son téléphone ou son PC
3. La page se charge en moins de 2 secondes (SSR + assets optimisés)
4. Il voit immédiatement : son nom commercial, son logo (s'il en a un), une photo héros qui ressemble à un de ses chantiers
5. Il scroll : reconnaît ses services, ses zones d'intervention, des photos de ses réalisations (ou photos génériques si pas dispo)
6. Il teste le quiz lui-même comme s'il était un client → reçoit un email-test de la soumission à son adresse
7. Il comprend la valeur en moins de 60 secondes

**Critères d'acceptation :**

- [ ] La page charge en < 2s en 4G mobile (Lighthouse score ≥ 85)
- [ ] Le nom du prospect apparaît en H1 visible dès le premier scroll
- [ ] Au moins 1 photo personnalisée (la sienne ou fallback de qualité) est visible above the fold
- [ ] Le quiz peut être complété en moins de 2 minutes
- [ ] L'email de soumission arrive dans la boîte du prospect en moins de 30 secondes après envoi
- [ ] Les couleurs définies dans la config sont effectivement appliquées (CSS variables fonctionnelles)

**Edge cases :**

- Si le prospect n'a aucune photo récupérable → fallback automatique vers `/static/_fallback/jardins/`
- Si le prospect ouvre la page hors de Suisse → la page fonctionne quand même (pas de geo-blocking)
- Si le prospect partage le lien à un ami → l'ami voit la même page (pas de session, pas de tracking nominatif)

---

### Story 2 : Le client final remplit le quiz

**En tant que** client final cherchant un paysagiste
**Je veux** obtenir un devis sans avoir à passer un appel commercial
**Afin de** comparer plusieurs prestataires rapidement et discrètement

**Flow détaillé :**

1. Le client arrive sur la page (depuis un partage, une recherche locale, une pub future, etc.)
2. Il voit le hero avec la promesse claire : _"Recevez un devis pour votre jardin sous 48h, sans appel."_
3. Il clique sur **"→ Démarrer mon devis"** et le quiz se lance avec un compteur de progression
4. **Étape 1** : il choisit le type de prestation parmi des cartes visuelles avec photos
5. **Étape 2** : il choisit l'urgence (4 options de timing) et tape sa commune dans un champ texte
6. **Étape 3** : il sélectionne une fourchette de surface OU clique "Je ne sais pas"
7. **Étape 4** : il remplit nom, email, téléphone, préférence de contact (email/tel/peu importe), accepte le RGPD via case à cocher
8. _(Si variante D)_ Il peut ajouter un message libre optionnel
9. Il clique **"→ Envoyer ma demande"**
10. Loader bref (< 2s) puis redirection vers `/eg/[slug]/merci`
11. La page de confirmation affiche : _"Merci [Prénom], [Nom paysagiste] revient vers vous sous 48h."_ + numéro de téléphone du paysagiste pour les urgents

**Critères d'acceptation :**

- [ ] Le compteur de progression s'incrémente correctement à chaque étape
- [ ] Les boutons "← Retour" et "Suivant →" fonctionnent et conservent le state
- [ ] Validation des champs obligatoires en étape 4 (email format, téléphone format suisse)
- [ ] Le bouton "Envoyer" est désactivé si la case RGPD n'est pas cochée
- [ ] La soumission échoue gracieusement avec un message clair en cas d'erreur réseau
- [ ] L'email reçu par le paysagiste contient toutes les réponses du quiz formatées lisiblement
- [ ] L'email a un `Reply-To` configuré sur l'adresse du client final
- [ ] Le client peut revenir en arrière sans perdre ses réponses (state persistant pendant la session)

**Edge cases :**

- Si l'utilisateur ferme la page en plein quiz → le state est perdu (pas de localStorage en V1.0, pas critique)
- Si Resend est down → message d'erreur clair "Erreur d'envoi, contactez-nous au [téléphone]"
- Si le mail bounce → BCC à `leads@jonlabs.ch` permet à Jonathan de récupérer la donnée manuellement
- Si l'utilisateur rafraîchit la page de confirmation → elle reste accessible (pas de redirection forcée)
- Si l'utilisateur saute des étapes via DevTools → validation côté serveur empêche la soumission incomplète

---

### Story 3 : Jonathan crée un nouveau prospect

**En tant que** Jonathan / Jon Labs
**Je veux** ajouter un nouveau paysagiste prospect au système en moins de 10 minutes
**Afin de** pouvoir scaler la prospection sans goulot d'étranglement technique

**Flow détaillé :**

1. Jonathan a fait sa reconnaissance du prospect (GMB, FB, site) et a collecté 8-12 photos + infos clés
2. Il duplique le dossier `/static/clients/_template/` en `/static/clients/[slug]/`
3. Il remplace les photos placeholders par celles du prospect (ou fallbacks)
4. Il édite `config.json` avec les infos collectées : nom, prénom, services actifs, zones, témoignages, etc.
5. Il choisit la `quizVariant` (B, C ou D) selon le profil du prospect
6. Il commit + push sur le repo Git
7. Vercel détecte le push et redéploie automatiquement (~ 1-2 min)
8. Il visite `jonlabs.ch/eg/[slug]` pour vérifier visuellement
9. Il fait un quiz-test complet pour valider que l'email arrive bien
10. Il envoie son cold mail avec le lien

**Critères d'acceptation :**

- [ ] Un fichier `config.json.template` documenté est disponible dans `/static/clients/_template/`
- [ ] Tous les champs de la config sont validés au build (TypeScript types stricts)
- [ ] Une erreur de config (fichier manquant, JSON invalide) affiche une erreur claire en dev, et tombe en 404 en prod
- [ ] L'arborescence des fichiers est documentée dans le `README.md` du repo

**Edge cases :**

- Si Jonathan oublie un champ obligatoire → erreur de build Vercel, déploiement bloqué
- Si une photo fait > 1MB → optimisation automatique au build (via `@sveltejs/enhanced-img` ou équivalent)
- Si le slug existe déjà → erreur de validation au build

---

## 4. Data Model

> ⚠️ Pas de base de données en V1.0. Les seules données structurées sont les **fichiers de config JSON** versionnés dans Git.

### Schéma JSON par prospect

Localisation : `/static/clients/[slug]/config.json`

```typescript
// /src/lib/types/prospect.ts

export type QuizVariant = 'B' | 'C' | 'D';

export interface ProspectConfig {
	// Métadonnées
	slug: string; // ex: "dupont"
	industry: 'paysagiste'; // 🔮 Préparé pour V1.1 multi-métiers
	createdAt: string; // ISO date

	// Identité business
	business: {
		name: string; // "Paysages Dupont"
		ownerFirstName: string; // "Marc"
		ownerLastName: string; // "Dupont"
		tagline: string; // courte phrase de positionnement
		phone: string; // format E.164 : "+41220000000"
		email: string; // email pro
		logoUrl: string | null; // chemin relatif ou null
		googleReviewUrl: string | null;
		facebookUrl: string | null;
		instagramUrl: string | null;
	};

	// Crédibilité
	credibility: {
		yearsExperience: number; // 12
		chantiersCount: number | null; // 340 ou null si inconnu
		googleRating: number | null; // 4.8 ou null
		googleReviewsCount: number | null; // 47 ou null
		zones: string[]; // ["Carouge", "Genève", "Veyrier"]
		radiusKm: number; // 15
	};

	// Branding visuel
	branding: {
		primaryColor: string; // "#2D5016"
		secondaryColor: string; // "#F4F1EA"
		accentColor: string; // "#D4A574"
		fontFamily: 'Inter' | 'Source Serif' | 'Playfair Display'; // limité aux fonts précompilées
	};

	// Visuels
	heroImage: string; // chemin relatif

	// Quiz
	quizVariant: QuizVariant;

	// Services (étape 1 du quiz)
	services: ProspectService[];

	// Galerie inspiration (variante C uniquement)
	inspirationGallery?: InspirationItem[];

	// Réalisations (section showcase)
	realizations: Realization[];

	// Témoignages
	testimonials: Testimonial[];

	// FAQ
	faq: FAQItem[];

	// Soumission de lead
	leadDelivery: {
		recipientEmail: string; // email du paysagiste
		ccEmails: string[]; // ["leads@jonlabs.ch"]
		subjectPrefix: string; // "[DEVIS PAYSAGES DUPONT]"
	};
}

export interface ProspectService {
	id: string; // "entretien", "taille", "creation", etc.
	label: string;
	description: string;
	icon: string; // emoji ou code SVG inline
	image: string | null; // photo de cette prestation
	active: boolean; // permet de masquer sans supprimer
}

export interface InspirationItem {
	id: string;
	image: string;
	label: string;
}

export interface Realization {
	before: string | null; // null si pas de avant/après
	after: string;
	caption: string;
}

export interface Testimonial {
	name: string;
	location: string;
	text: string;
	rating: 1 | 2 | 3 | 4 | 5;
}

export interface FAQItem {
	question: string;
	answer: string;
}
```

### Schéma de la soumission de lead (payload → API)

```typescript
// POST /api/submit
export interface LeadSubmission {
	slug: string; // identifie le prospect
	variant: QuizVariant;
	answers: {
		serviceId: string; // étape 1
		serviceLabel: string; // pour affichage dans l'email

		inspirationIds?: string[]; // variante C uniquement

		timing: 'urgent' | 'few_weeks' | 'this_season' | 'planning';
		timingLabel: string;
		commune: string;

		surface: 'less_100' | '100_300' | '300_800' | 'more_800' | 'unknown';
		surfaceLabel: string;

		contact: {
			firstName: string;
			lastName: string | null;
			email: string;
			phone: string;
			preferredContact: 'email' | 'phone' | 'any';
		};

		freeText?: string; // variante D uniquement
	};
	consentGdpr: boolean; // doit être true
	submittedAt: string; // ISO date
}
```

### Architecture des fichiers statiques

```
/static/
├── clients/
│   ├── _template/                      # référence à dupliquer
│   │   ├── config.json
│   │   └── README.md                   # instructions de remplissage
│   ├── dupont/
│   │   ├── config.json
│   │   ├── logo.png                    # 200x60 max recommandé
│   │   ├── hero.jpg                    # 1920x800 max
│   │   ├── services/
│   │   │   ├── entretien.jpg           # 600x400 carré-ish
│   │   │   ├── taille.jpg
│   │   │   └── creation.jpg
│   │   └── realisations/
│   │       ├── 01-avant.jpg
│   │       ├── 01-apres.jpg
│   │       └── ...
│   └── martin/
│       └── ...
└── _fallback/                          # banque de photos génériques libres de droit
    ├── heroes/
    ├── jardins/
    └── services/
```

---

## 5. Stack Technique

### Choix retenu

| Couche          | Techno                                                | Justification                                                                                 |
| --------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Framework**   | SvelteKit (Svelte 5 + runes)                          | State du quiz multi-étapes propre avec `$state`, routes dynamiques natives, SSR               |
| **Styling**     | Tailwind CSS v4                                       | Configuration de design tokens via CSS variables, parfait pour theming dynamique par prospect |
| **Typographie** | Variable fonts Google (Inter, Source Serif, Playfair) | Pré-chargées, choisies par config                                                             |
| **Email**       | Resend                                                | 3000 mails/mois gratuit, API simple, support `Reply-To`                                       |
| **Hébergement** | Vercel                                                | Adapter SvelteKit officiel, déploiement Git auto, gratuit pour ce volume                      |
| **Analytics**   | Plausible (déjà sur jonlabs.ch)                       | Privacy-friendly, pas de bandeau cookies nécessaire                                           |
| **Repo**        | GitHub privé                                          | Versioning des configs prospects                                                              |
| **Domaine**     | jonlabs.ch (chemin `/eg/[slug]`)                      | Pas de sous-domaine, pas de DNS à gérer                                                       |
| **Image optim** | `@sveltejs/enhanced-img`                              | Resize + WebP automatique au build                                                            |

### Stack non-retenue (avec raisons)

- ~~Astro~~ : moins de souplesse pour state interactif du quiz
- ~~Next.js~~ : overhead inutile pour ce besoin
- ~~Turso / Drizzle~~ : reporté à V1.2 (pas de DB en V1)
- ~~Better-Auth~~ : pas d'auth nécessaire en V1
- ~~Webflow / Framer~~ : impossible de gérer la config-driven approche

### Variables d'environnement

```bash
# .env (Vercel)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=devis@jonlabs.ch
INTERNAL_BCC_EMAIL=leads@jonlabs.ch
PUBLIC_PLAUSIBLE_DOMAIN=jonlabs.ch
```

### Configuration Resend

- Domaine vérifié : `jonlabs.ch`
- DKIM + SPF : configurés via Vercel DNS
- Email d'envoi : `devis@jonlabs.ch`
- `Reply-To` dynamique : email du client final qui a soumis le quiz
- Sujet dynamique : `{subjectPrefix} Nouvelle demande de {serviceLabel} – {commune}`

---

## 6. Règles & Conventions

### Structure du repo

```
jonlabs-eg-devis/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte                # landing démo (slug "demo" par défaut)
│   │   ├── eg/
│   │   │   └── [slug]/
│   │   │       ├── +page.server.ts     # charge config.json, throw 404 si absent
│   │   │       ├── +page.svelte        # composition de la page complète
│   │   │       └── merci/
│   │   │           └── +page.svelte
│   │   └── api/
│   │       └── submit/
│   │           └── +server.ts          # POST handler → Resend
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Hero.svelte
│   │   │   ├── Reassurance.svelte
│   │   │   ├── Quiz/
│   │   │   │   ├── Quiz.svelte
│   │   │   │   ├── QuizProgress.svelte
│   │   │   │   ├── StepService.svelte
│   │   │   │   ├── StepInspiration.svelte
│   │   │   │   ├── StepWhenWhere.svelte
│   │   │   │   ├── StepSurface.svelte
│   │   │   │   └── StepContact.svelte
│   │   │   ├── Realizations.svelte
│   │   │   ├── Testimonials.svelte
│   │   │   ├── FAQ.svelte
│   │   │   ├── CTAFinal.svelte
│   │   │   └── Footer.svelte
│   │   ├── stores/
│   │   │   └── quizState.svelte.ts     # Svelte 5 runes
│   │   ├── types/
│   │   │   ├── prospect.ts
│   │   │   └── lead.ts
│   │   └── utils/
│   │       ├── theme.ts                # injecte CSS variables couleurs
│   │       ├── email.ts                # formatte le mail Resend
│   │       └── validation.ts           # zod schemas
│   ├── app.html
│   └── app.css                         # globals + Tailwind
├── static/
│   ├── clients/
│   └── _fallback/
├── tests/
│   └── e2e/                            # Playwright (V1.1+)
├── .env.example
├── package.json
├── svelte.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

### Conventions de code

- **Components** : `PascalCase.svelte`
- **Functions / variables** : `camelCase`
- **Types / interfaces** : `PascalCase`
- **Constantes** : `SCREAMING_SNAKE_CASE`
- **Slugs prospects** : `kebab-case`, sans accents, sans espaces
- **State** : Svelte 5 runes (`$state`, `$derived`, `$effect`) — pas de stores legacy
- **Validation** : Zod côté serveur sur l'API (pas confiance au client)
- **Erreurs** : pattern `Result<T, E>` pour les opérations critiques (envoi email, parsing config)
- **Imports** : alias `$lib` pour tout ce qui vient de `src/lib`
- **Pas de console.log en prod** : ESLint rule activée

### Règles métier

1. **Aucune photo de tiers sans contexte** : si une photo provient du FB/Insta du prospect, c'est uniquement pour LUI montrer sa propre page. Si pas dispo → fallback obligatoire.
2. **RGPD** : case à cocher obligatoire avant soumission ("J'accepte d'être recontacté pour ce devis"). Pas de page mentions légales en V1.0 (à ajouter en V1.2 si volume > 50 leads/mois).
3. **Reply-To** : toujours configuré sur l'email du client final pour que le paysagiste réponde directement au prospect.
4. **BCC silencieux** : `leads@jonlabs.ch` reçoit toutes les soumissions en copie (sans que le paysagiste ne le voie dans les headers).
5. **Branding Jon Labs** : 1 seule mention discrète en bas de page : _"Page créée par Jon Labs — jonlabs.ch"_
6. **Pas de tracking nominatif** : Plausible ne stocke pas d'IP ni de cookies.
7. **Anti-spam** : honeypot CSS — champ texte caché en `display:none` nommé `website` ou `phone_alt`. Si rempli côté serveur → soumission rejetée silencieusement (HTTP 200 mais pas d'envoi email). Pas de reCAPTCHA pour rester léger et sans tiers.
8. **Rétention emails** : suppression manuelle des emails reçus sur `leads@jonlabs.ch` après 7 jours (hygiène RGPD légère, pas de DB en V1.0 donc rien d'autre à purger).

---

## 7. UI / UX

### Style visuel

**Direction artistique** : chaleureux / artisan

- Polices : **Source Serif** ou **Playfair Display** pour les titres, **Inter** pour le corps
- Palette de fond par défaut : beiges (`#F4F1EA`, `#FAF7EE`), blancs cassés
- Palette d'accents par défaut : verts naturels (`#2D5016`, `#5C7C3F`), terracotta (`#D4A574`)
- **Surcharge** : la config du prospect remplace les couleurs par les siennes via CSS variables
- Photo-driven : grandes images, peu de texte, beaucoup d'espace

### Approche responsive

**Responsive équilibré dès la V1**, avec :

- Breakpoints Tailwind standard (`sm`, `md`, `lg`, `xl`)
- Mobile : navigation simplifiée, quiz en plein écran, photos optimisées
- Desktop : layouts à 2-3 colonnes, gallery grid 3x2, plus d'espace blanc
- Test obligatoire sur : iPhone SE (petit), iPhone 14 Pro (standard), iPad, MacBook 13"

### Wireframe page complète

> Voir document séparé `wireframe-page-devis.md` (basé sur l'ASCII layout déjà validé en discussion)

### Composants clés et leur comportement

| Composant        | Comportement                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Header**       | Sticky au scroll, fond blanc translucide avec backdrop-blur, logo + téléphone visible     |
| **Hero**         | Pleine largeur, photo héros avec overlay sombre 30%, CTA principal visible above the fold |
| **Reassurance**  | 3 colonnes desktop, 1 colonne mobile, icônes simples                                      |
| **Quiz**         | State persistant entre étapes, animation slide entre étapes, progress bar                 |
| **Realizations** | Galerie 3x2 desktop, 2x3 mobile, lightbox au clic                                         |
| **Testimonials** | 3 colonnes desktop, carrousel mobile                                                      |
| **FAQ**          | Accordion fermé par défaut, animation smooth                                              |
| **Footer**       | Minimaliste, 1 ligne mention Jon Labs                                                     |

### Accessibilité (priorité V1)

- [ ] Contraste WCAG AA sur tous les textes (vérification automatisée à prévoir)
- [ ] `aria-label` sur tous les boutons
- [ ] Navigation au clavier fonctionnelle dans le quiz (Tab, Enter, flèches)
- [ ] Labels HTML explicites sur tous les champs de formulaire
- [ ] Pas de couleur seule pour communiquer une information (icônes + texte)

### Performance (priorité V1)

- [ ] Lighthouse score ≥ 85 sur Performance
- [ ] LCP < 2.5s en 4G mobile
- [ ] Images optimisées en WebP via `@sveltejs/enhanced-img`
- [ ] Fonts pré-chargées via `<link rel="preload">`
- [ ] Pas de JS bloquant le render initial

---

## 8. Plan de développement

### Phase 1 — Boilerplate (8-10h)

1. Init projet SvelteKit + Tailwind v4 + TypeScript + Svelte 5
2. Setup ESLint, Prettier, Husky pre-commit
3. Création des types TypeScript (`prospect.ts`, `lead.ts`)
4. Setup `enhanced-img` pour optimisation auto
5. Setup Plausible côté frontend
6. Setup Resend côté API
7. Création route `/eg/[slug]` avec chargement config + erreur 404 si absent
8. Création des composants base (Header, Hero, Footer, Reassurance)

### Phase 2 — Quiz (4-6h)

9. Composant `Quiz.svelte` orchestrateur avec state runes
10. 4 sous-composants étapes (Service, WhenWhere, Surface, Contact)
11. Composant Inspiration (variante C)
12. Validation Zod côté client (UX immédiate)
13. Logique de switch B/C/D selon `quizVariant`
14. Animations transition entre étapes

### Phase 3 — Soumission (2-3h)

15. Endpoint `/api/submit/+server.ts`
16. Validation Zod côté serveur
17. Format email HTML pour Resend
18. Configuration `Reply-To` dynamique
19. BCC silencieux à `leads@jonlabs.ch`
20. Page de confirmation `/eg/[slug]/merci`

### Phase 4 — Sections complémentaires (3-4h)

21. Realizations avec lightbox
22. Testimonials carrousel
23. FAQ accordion
24. CTA final
25. Theming dynamique par CSS variables

### Phase 5 — Premier prospect (1-2h)

26. Création du dossier `/static/clients/_template/` avec config.json documentée
27. Création de la banque `/static/_fallback/` (10-20 photos)
28. Création du premier prospect "demo" avec photos fallback
29. Test complet end-to-end (quiz → email → merci)

### Phase 6 — Déploiement (1h)

30. Configuration domaine + DNS sur Vercel
31. Vérification domaine Resend
32. Variables d'environnement
33. Test production

**Total estimé : 19-26h de dev** pour avoir le premier EG prêt à envoyer.

---

## 9. Risques & Mitigations

| Risque                                         | Impact   | Probabilité | Mitigation                                                         |
| ---------------------------------------------- | -------- | ----------- | ------------------------------------------------------------------ |
| **Resend bloque l'envoi** (DKIM mal configuré) | Critique | Moyen       | Test exhaustif avant 1er prospect, monitoring sur leads@jonlabs.ch |
| **Photos prospect non récupérables**           | Moyen    | Élevé       | Banque fallback de qualité prête dès le boilerplate                |
| **Prospect ne clique pas sur le lien**         | Critique | Moyen       | Mail cold travaillé en parallèle, A/B testé                        |
| **Conflit de couleurs prospect / lisibilité**  | Faible   | Moyen       | Validation manuelle des couleurs par Jonathan avant déploiement    |
| **Soumission de spam**                         | Faible   | Élevé       | Honeypot CSS + rate limit Vercel + validation Zod                  |
| **Lead arrive en spam chez le paysagiste**     | Critique | Moyen       | Domaine vérifié Resend, From address pro, BCC permet récupération  |
| **Coûts Vercel/Resend dépassés**               | Faible   | Faible      | Free tier suffisant jusqu'à 50+ pages actives                      |
| **Perte de motivation Jonathan**               | Critique | Moyen       | Phasage strict, ne pas dépasser V1.0 avant 5 EG envoyés            |

---

## 10. Questions ouvertes / À trancher avant le build

- ✅ ~~**Mentions légales**~~ → Pas nécessaire en V1.0 (volume insuffisant). Reportée si > 50 leads/mois.
- ✅ ~~**Politique de rétention emails**~~ → Suppression manuelle des emails dans `leads@jonlabs.ch` après 7 jours (hygiène RGPD légère).
- ✅ ~~**Honeypot ou reCAPTCHA**~~ → **Honeypot CSS** retenu. Champ caché en `display:none` que les bots remplissent et qui invalide la soumission côté serveur.
- [ ] **Test de spam check** : utiliser Mail-Tester pour valider la délivrabilité avant le 1er prospect
- [ ] **Mail cold associé** : à rédiger comme livrable séparé après le PRD
- [ ] **Liste des 5 premiers prospects cibles** : à constituer en parallèle du dev

---

## 11. Annexes

- **Wireframe ASCII complet** : voir conversation Claude (à exporter en doc séparé `wireframe-page-devis.md`)
- **Grille de puissance EG (méthode Robin)** : 24/25 — validé largement
- **Mail cold template** : à rédiger en livrable séparé

---

## Changelog

- **2026-04-28** — V1.0 Draft initial (Jonathan + Claude)
- **2026-04-28** — V1.1 Draft : tranché mentions légales (out V1), honeypot CSS retenu, rétention emails 7j

---

_Fin du PRD. Prêt pour Claude Code._
