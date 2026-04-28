# Feature 3 — Soumission & Email

**Complexité** : M (2-3h)
**Statut** : ⬜ TODO

## Description

Endpoint API qui reçoit les réponses du quiz, les valide côté serveur, formate un email HTML lisible et l'envoie via Resend au paysagiste prospect avec BCC à Jon Labs.

## Tâches

- [ ] Créer `+server.ts` pour `POST /api/submit`
- [ ] Validation Zod côté serveur du payload `LeadSubmission`
- [ ] Vérification honeypot (rejet silencieux si rempli — HTTP 200 sans envoi)
- [ ] Charger la config du prospect pour récupérer `leadDelivery`
- [ ] Formater l'email HTML (template lisible avec toutes les réponses)
- [ ] Envoyer via Resend avec :
  - `From` : `devis@jonlabs.ch`
  - `To` : email du paysagiste (`leadDelivery.recipientEmail`)
  - `Reply-To` : email du client final
  - `BCC` : `leads@jonlabs.ch`
  - `Subject` : `{subjectPrefix} Nouvelle demande de {serviceLabel} – {commune}`
- [ ] Gestion d'erreur Resend : retour JSON avec message clair
- [ ] Créer page `/eg/[slug]/merci/+page.svelte`
- [ ] Afficher sur la page merci : prénom du client, nom du paysagiste, téléphone d'urgence
- [ ] La page merci reste accessible au refresh (pas de redirect-only)

## Décisions techniques

- L'API charge la config JSON du prospect pour valider que le slug existe
- Rate limiting : confiance dans le rate limit Vercel par défaut en V1
- Le template email est en HTML inline (pas de framework email)
- En cas d'erreur Resend : message utilisateur "Erreur d'envoi, contactez [téléphone]"

## Notes

- Tester avec Mail-Tester avant le premier prospect réel
- Vérifier que les emails n'arrivent pas en spam
