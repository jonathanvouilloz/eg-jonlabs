# Feature 1 — Boilerplate & Setup

**Complexité** : L (8-10h)
**Statut** : ⬜ TODO

## Description

Initialisation complète du projet SvelteKit avec toutes les dépendances, configuration du tooling, création des types TypeScript et des composants de base de la page.

## Tâches

- [ ] Init projet SvelteKit + Svelte 5 + TypeScript
- [ ] Installer et configurer Tailwind CSS v4
- [ ] Setup ESLint + Prettier + Husky pre-commit
- [ ] Créer les types TypeScript (`prospect.ts`, `lead.ts`) avec les interfaces du PRD
- [ ] Setup `@sveltejs/enhanced-img` pour optimisation images
- [ ] Intégrer Plausible Analytics (script côté frontend)
- [ ] Installer Resend SDK
- [ ] Créer la route `/eg/[slug]` avec `+page.server.ts` qui charge `config.json`
- [ ] Gestion 404 si slug inexistant ou config invalide
- [ ] Créer composant `Header.svelte` (sticky, backdrop-blur, logo + tel)
- [ ] Créer composant `Hero.svelte` (photo pleine largeur, overlay, CTA)
- [ ] Créer composant `Footer.svelte` (mention Jon Labs discrète)
- [ ] Créer composant `Reassurance.svelte` (3 colonnes crédibilité)
- [ ] Setup CSS variables pour theming dynamique par prospect
- [ ] Créer `app.css` avec Tailwind + globals
- [ ] Pré-charger les fonts Google (Inter, Source Serif, Playfair Display)
- [ ] Créer `.env.example` avec les variables nécessaires

## Décisions techniques

- Route `[slug]` : le `+page.server.ts` lit `/static/clients/[slug]/config.json` et le parse avec Zod
- Si config absente ou invalide : `throw error(404)` en prod, message d'erreur détaillé en dev
- CSS variables injectées dans `+layout.svelte` via un helper `theme.ts`

## Notes

- Les fonts sont limitées à 3 choix pré-compilés pour éviter le FOUT
- Le header doit être responsive : logo + tel visibles sur mobile, navigation minimale
