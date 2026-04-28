# Feature 2 — Quiz multi-étapes

**Complexité** : L (4-6h)
**Statut** : ⬜ TODO

## Description

Quiz interactif multi-étapes au coeur de la page devis. Gère 3 variantes (B, C, D) avec un state machine propre en Svelte 5 runes. Chaque étape qualifie le client final (prestation, timing, surface, coordonnées).

## Tâches

- [ ] Créer `quizState.svelte.ts` — state machine avec `$state` et `$derived`
- [ ] Créer `Quiz.svelte` — orchestrateur principal, gère les transitions
- [ ] Créer `QuizProgress.svelte` — barre de progression visuelle
- [ ] Créer `StepService.svelte` — Étape 1 : choix de prestation (cartes visuelles avec photos)
- [ ] Créer `StepWhenWhere.svelte` — Étape 2 : urgence (4 options) + commune (champ texte)
- [ ] Créer `StepSurface.svelte` — Étape 3 : fourchette de surface + option "Je ne sais pas"
- [ ] Créer `StepContact.svelte` — Étape 4 : nom, email, tel, préférence contact, RGPD
- [ ] Créer `StepInspiration.svelte` — Étape bonus (variante C) : galerie d'inspiration
- [ ] Logique de switch B/C/D selon `quizVariant` dans la config
- [ ] Animations slide entre étapes (transition Svelte)
- [ ] Validation côté client (Zod) pour feedback immédiat
- [ ] Boutons Retour/Suivant avec conservation du state
- [ ] Champ honeypot caché (`display:none`) pour anti-spam
- [ ] Champ libre optionnel (variante D uniquement)

## Variantes

| Variante | Étapes                                               |
| -------- | ---------------------------------------------------- |
| B        | Service → Quand+Où → Surface → Contact               |
| C        | Service → Inspiration → Quand+Où → Surface → Contact |
| D        | Service → Quand+Où → Surface → Contact + champ libre |

## Décisions techniques

- State : `$state` pour les réponses, `$derived` pour l'étape courante et la validation
- Le state est réinitialisé si le slug change (navigation vers un autre prospect)
- Validation téléphone : format suisse (commence par 0 ou +41, 10 chiffres)
- Le bouton Envoyer est désactivé tant que la case RGPD n'est pas cochée

## Edge cases

- Retour en arrière : les réponses sont conservées
- Rafraîchissement page : state perdu (acceptable en V1)
- Manipulation DevTools : la validation serveur empêche les soumissions incomplètes
