# Feature 6 — Déploiement

**Complexité** : S (1h)
**Statut** : ⬜ TODO

## Description

Mise en production sur Vercel avec configuration du domaine, des variables d'environnement et vérification du domaine Resend.

## Tâches

- [ ] Configurer le projet sur Vercel (adapter SvelteKit)
- [ ] Configurer le domaine `jonlabs.ch/eg/` sur Vercel
- [ ] Ajouter les variables d'environnement sur Vercel :
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `INTERNAL_BCC_EMAIL`
  - `PUBLIC_PLAUSIBLE_DOMAIN`
- [ ] Vérifier le domaine `jonlabs.ch` sur Resend (DKIM + SPF)
- [ ] Test production complet (quiz → email → merci)
- [ ] Vérifier score Lighthouse ≥ 85
- [ ] Test Mail-Tester pour délivrabilité

## Notes

- Le repo est GitHub privé
- Vercel auto-déploie sur push vers main
