# Plan d'exécution — EG Page Devis

> Dernière mise à jour : 2026-05-07

## Vue d'ensemble

| #   | Feature                                                         | Complexité | Statut  |
| --- | --------------------------------------------------------------- | ---------- | ------- |
| 1   | [Boilerplate & Setup](features/01-boilerplate.md)               | L          | ✅ Fait |
| 2   | [Quiz multi-étapes](features/02-quiz.md)                        | L          | ✅ Fait |
| 3   | [Devis instantané + PDF + Email](features/03-soumission.md)     | L          | ✅ Fait |
| 4   | [Sections page](features/04-sections-page.md)                   | M          | ✅ Fait |
| 5   | [Template & Premier prospect](features/05-template-prospect.md) | S          | ✅ Fait |
| 6   | [Déploiement](features/06-deploiement.md)                       | S          | ✅ Fait |
| 7   | Pivot landing + site mock                                       | L          | ✅ Fait |

## Pivot architectural (28 avril 2026)

Le PRD initial prévoyait `quiz → email paysagiste → page merci`. Le flow a pivoté vers `quiz → devis instantané affiché → téléchargement PDF`, l'email récap au paysagiste étant toujours envoyé en silence en fond. Justification : le client repart avec un chiffrage en main + PDF brandé, ce qui matérialise la valeur Jon Labs avant la vente.

Composants ajoutés au plan initial :

- **Calculateur tarifaire** : `src/lib/utils/pricing.ts` + `src/lib/data/pricingRates.ts` (médianes Suisse romande 2025-2026, 11 catégories)
- **Génération PDF côté client** : `html2canvas` + `jspdf` avec template A4 brandé (`QuoteDocument.svelte`)
- **API serveur** : `/api/submit` recalcule le devis indépendamment + envoie l'email récap via Resend

## Ce qui est fait (Phases 1 à 5)

### Phase 1 — Boilerplate

- ESLint v10 (flat config) + Prettier + Husky pre-commit + lint-staged
- `@sveltejs/enhanced-img` installé et activé
- Reset du quiz state via `{#key config.slug}` dans `+page.svelte`
- Plausible Analytics + fonts Google déjà en place

### Phase 2 — Moteur tarifaire

- Types `PricingCategory` (11 valeurs) + `QuoteResult`
- Tables `PRICING_RATES` (médianes CHF) + modulateurs timing + frais déplacement
- Fonction pure `calculateQuote(category, surface, timing)` testée (11 tests Vitest)
- Field `pricingCategory` ajouté à `ProspectService` + Zod schema

### Phase 3 — Devis instantané + PDF

- `QuoteResult.svelte` : UI affichée à la place du dernier step quand `submissionStatus === 'sent'`
- `QuoteDocument.svelte` : DOM A4 (794×1123 px) brandé aux couleurs prospect, capturé pour PDF
- `pdfQuote.ts` : `generateQuotePdf` avec imports dynamiques (`html2canvas` + `jspdf`)
- État du quiz étendu : `submissionStatus` (`idle | submitting | sent | error`) + `quote: QuoteResult | null`

### Phase 4 — API submit + email

- `POST /api/submit` avec validation Zod (`requestBodySchema`)
- Honeypot silent reject (200 sans envoi)
- Recalcule le quote serveur indépendamment du client
- Email HTML inline via Resend, Reply-To client, BCC `INTERNAL_BCC_EMAIL` + `ccEmails`
- Fallback gracieux si Resend non configuré (warning + quote retournée)
- Helper `loadProspectConfig` partagé entre `+page.server.ts` et `/api/submit`

### Phase 5 — Sections page

- `Realizations.svelte` : galerie 2-3 cols + lightbox natif (Escape, ←/→, clic backdrop)
- `FAQ.svelte` : `<details>` natif + animation CSS
- `CTAFinal.svelte` : section bas de page avec deux CTA (devis + appel)

### Prospects demo + tests E2E variantes

- `demo` (variante B) : 4 services entretien/création/taille/aménagement + 6 réalisations
- `demo-c` (variante C) : 3 services + galerie inspiration + couleurs Genève
- `demo-d` (variante D) : 3 services + champ libre + couleurs Nyon

Tous testés via curl en dev :

- `GET /eg/{demo,demo-c,demo-d}` → 200 ✅
- `POST /api/submit` valide → renvoie `{ ok: true, quote: {...} }` ✅
- Honeypot rempli → 200 silencieux ✅
- Surface `unknown` → quote.available=false ✅

## Phase 6 — Déploiement Vercel (✅ fait)

- Projet lié à Vercel, déployé sur `eg.jonlabs.ch`
- Env vars configurées (Resend, Plausible)
- Premier prospect réel `gt-paysages` publié

> Note : le build SvelteKit fonctionne (Vite OK), seule l'étape symlink de l'adapter Vercel échoue sur Windows (problème connu, pas Linux/Vercel CI). Aucune action requise.

## Phase 7 — Pivot landing + site mock (7 mai 2026)

EG est passé d'une page unique (formulaire de devis) à 2 artefacts par prospect :

- `/landing/[slug]` — page de vente perso minimaliste : H1 + screenshot du mock + CTA + vidéo Loom générique → drive vers le mock
- `/site/[slug]` — mock du site paysagiste complet (9 sections : Hero perso avec bandeau de transparence, "Ta zone aujourd'hui" avec chiffres marché local, Services, Carte + grille communes, Témoignages, Galerie, Quiz qualifiant, "Comment ce site te fait monter sur Google", FAQ, CTA final)

Migration : `/cadeau/[slug]` → `/site/[slug]` (301), `/cadeau/[slug]/audit` → `/landing/[slug]/audit` (301) via `src/hooks.server.ts`.

Composants ajoutés :

- `LocalMarketStats.svelte` — 3 KPIs marché local (recherches/mois, % top 3, part actuelle)
- `Services.svelte` — grille de cards services info-only (distincte du Quiz qui utilise `pricingCategory`)
- `SeoEducation.svelte` — section éditoriale 4 points expliquant la mécanique SEO local (page-villes, articles, fiche Google, multiplication des recherches captées)

Composants étendus :

- `Hero.svelte` — prop `showTransparencyNote` (mention "Aperçu : tes vraies photos s'intègrent en 1h...")
- `InterventionMap.svelte` — layout grid carte Leaflet + grille de communes lisibles à droite (md+) ou dessous (sm). Tape dans `config.communes` avec fallback sur `credibility.zones`.

Schema config étendu (4 champs optionnels, pas de breaking change) :

- `salesPage` (loomVideoId, screenshotUrl, subtitleObservation)
- `localMarket` (monthlySearches, topThreeCaptureRate)
- `communes` (string[])
- `transparencyNote` (boolean)

## Améliorations potentielles (post-V1)

- Photos fallback réelles dans `static/_fallback/` (pour l'instant chaque prospect utilise ses propres URLs Unsplash ou locales)
- Test Playwright/Vitest browser sur le flow complet quiz → PDF
- Affinage des fourchettes de prix après retours premiers paysagistes
- Automatisation des screenshots `/site/[slug]` via Playwright (réutiliser le pipeline du skill `paysagiste-audit`)
- Section split-screen GMB vs concurrent dans `LocalMarketStats`
- Pages-villes individuelles cliquables (`/site/[slug]/[commune]`)
- Plausible custom events pour mesurer le funnel landing → site → form
