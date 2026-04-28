# Feature 4 — Sections page

**Complexité** : M (3-4h)
**Statut** : ⬜ TODO

## Description

Sections complémentaires de la page devis qui renforcent la crédibilité et incitent à l'action : réalisations, témoignages, FAQ, CTA final, et le theming dynamique par prospect.

## Tâches

- [ ] Créer `Realizations.svelte` — galerie avant/après (3x2 desktop, 2x3 mobile)
- [ ] Lightbox au clic sur les réalisations
- [ ] Créer `Testimonials.svelte` — 3 colonnes desktop, carrousel mobile
- [ ] Étoiles de notation (1-5) dans chaque témoignage
- [ ] Créer `FAQ.svelte` — accordion fermé par défaut, animation smooth
- [ ] Créer `CTAFinal.svelte` — section d'appel à l'action en bas de page
- [ ] Theming dynamique complet : `theme.ts` injecte les CSS variables depuis la config
- [ ] Vérifier le contraste WCAG AA avec les couleurs du prospect
- [ ] Responsive sur toutes les sections (iPhone SE → MacBook 13")

## Décisions techniques

- Lightbox : implémentation native (pas de lib externe), avec fermeture Escape + clic extérieur
- Carrousel témoignages mobile : swipe natif CSS (`scroll-snap`) — pas de JS carousel lib
- FAQ : `<details>` HTML natif avec animation CSS pour le smooth open/close

## Notes

- Les sections sont conditionnelles : si `testimonials` est vide dans la config, la section ne s'affiche pas
- Idem pour `realizations` et `faq`
