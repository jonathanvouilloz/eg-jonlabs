# EG Page Devis - Jon Labs

## Résumé du projet

Page web de demande de devis personnalisée pour paysagistes, déployée en cold prospection à `jonlabs.ch/eg/[slug]`. Chaque page est configurée via un fichier JSON par prospect (nom, couleurs, photos, services) et inclut un quiz multi-étapes qui envoie les leads par email via Resend. L'objectif est de prouver la valeur de Jon Labs avant la vente (taux cible : 20% de conversion EG -> call).

## Stack technique

- **Framework** : SvelteKit (Svelte 5 + runes)
- **Styling** : Tailwind CSS v4 (theming dynamique via CSS variables)
- **Email** : Resend (Reply-To dynamique, BCC silencieux)
- **Hébergement** : Vercel (adapter SvelteKit)
- **Analytics** : Plausible (privacy-friendly)
- **Images** : `@sveltejs/enhanced-img` (WebP auto)
- **Validation** : Zod (côté serveur obligatoire, côté client pour UX)
- **Fonts** : Inter, Source Serif, Playfair Display (pré-chargées)

## Commandes utiles

```bash
npm run dev          # serveur dev
npm run build        # build production
npm run preview      # preview du build
npm run check        # svelte-check + TypeScript
npm run lint         # ESLint
npm run format       # Prettier
```

## Conventions de code

- Components : `PascalCase.svelte`
- Functions / variables : `camelCase`
- Types / interfaces : `PascalCase`
- Constantes : `SCREAMING_SNAKE_CASE`
- Slugs prospects : `kebab-case`, sans accents
- State : Svelte 5 runes (`$state`, `$derived`, `$effect`) — pas de stores legacy
- Validation : Zod côté serveur (pas confiance au client)
- Imports : alias `$lib` pour `src/lib`
- Pas de `console.log` en prod

## Conventions de commits

Format Conventional Commits :
- `feat(scope): description` — nouvelle fonctionnalité
- `fix(scope): description` — correction de bug
- `docs: description` — documentation
- `refactor(scope): description` — refactoring
- `chore: description` — maintenance

## Fichiers de contexte

- `PRD-eg-page-devis.md` — PRD complet du projet
- `docs/PLAN.md` — Plan d'exécution avec statuts
- `docs/DECISIONS.md` — Log des décisions techniques
- `docs/STYLEGUIDE.md` — Conventions UI/UX et design
- `docs/features/` — Détail par feature

## Règles métier clés

- RGPD : case à cocher obligatoire, pas de tracking nominatif
- Reply-To : toujours l'email du client final
- BCC : `leads@jonlabs.ch` sur toutes les soumissions
- Anti-spam : honeypot CSS (champ caché `display:none`)
- Branding Jon Labs : 1 mention discrète en footer uniquement
- Photos : fallback `/static/_fallback/` si prospect sans assets

## État actuel

**Phase** : Initialisation du projet
**Dernière mise à jour** : 2026-04-28
**Prochaine étape** : Validation du plan par Jonathan, puis Phase 1 (Boilerplate)
