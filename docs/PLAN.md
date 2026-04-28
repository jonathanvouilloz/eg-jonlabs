# Plan d'exécution — EG Page Devis

> Dernière mise à jour : 2026-04-28

## Vue d'ensemble

| #   | Feature                                                         | Complexité | Statut  |
| --- | --------------------------------------------------------------- | ---------- | ------- |
| 1   | [Boilerplate & Setup](features/01-boilerplate.md)               | L          | ✅ Fait |
| 2   | [Quiz multi-étapes](features/02-quiz.md)                        | L          | ✅ Fait |
| 3   | [Devis instantané + PDF + Email](features/03-soumission.md)     | L          | ✅ Fait |
| 4   | [Sections page](features/04-sections-page.md)                   | M          | ✅ Fait |
| 5   | [Template & Premier prospect](features/05-template-prospect.md) | S          | ✅ Fait |
| 6   | [Déploiement](features/06-deploiement.md)                       | S          | ⬜ TODO |

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

## Reste à faire — Phase 6 : Déploiement Vercel

- [ ] Lier le projet à Vercel (CLI ou dashboard)
- [ ] Configurer le sous-chemin `jonlabs.ch/eg/` (rewrite ou domaine dédié)
- [ ] Renseigner les env vars sur Vercel :
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL=devis@jonlabs.ch`
  - `INTERNAL_BCC_EMAIL=leads@jonlabs.ch`
  - `PUBLIC_PLAUSIBLE_DOMAIN=jonlabs.ch`
- [ ] Vérifier le domaine `jonlabs.ch` sur Resend (DKIM + SPF)
- [ ] Test E2E en prod sur les 3 prospects demo
- [ ] Score Lighthouse cible ≥ 85
- [ ] Test Mail-Tester pour la délivrabilité

> Note : le build SvelteKit fonctionne (Vite OK), seule l'étape symlink de l'adapter Vercel échoue sur Windows (problème connu, pas Linux/Vercel CI). Aucune action requise.

## Améliorations potentielles (post-V1)

- Photos fallback réelles dans `static/_fallback/` (pour l'instant chaque prospect utilise ses propres URLs Unsplash ou locales)
- Test Playwright/Vitest browser sur le flow complet quiz → PDF
- Affinage des fourchettes de prix après retours premiers paysagistes
