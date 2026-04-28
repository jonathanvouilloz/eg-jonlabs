# Décisions techniques — EG Page Devis

| Date       | Décision                   | Contexte                                                              | Alternatives considérées                                       |
| ---------- | -------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------- |
| 2026-04-28 | SvelteKit + Svelte 5 runes | State interactif du quiz multi-étapes, routes dynamiques natives, SSR | Astro (moins souple pour state), Next.js (overhead inutile)    |
| 2026-04-28 | Tailwind CSS v4            | Theming dynamique par prospect via CSS variables                      | CSS-in-JS, vanilla CSS                                         |
| 2026-04-28 | Resend pour emails         | API simple, 3000 mails/mois gratuit, support Reply-To                 | SendGrid (plus complexe), Nodemailer (pas serverless-friendly) |
| 2026-04-28 | Pas de DB en V1            | Volume faible, config JSON dans Git suffit                            | Turso + Drizzle (reporté V1.2)                                 |
| 2026-04-28 | Honeypot CSS anti-spam     | Léger, pas de tiers, transparent pour l'utilisateur                   | reCAPTCHA (lourd, friction UX)                                 |
| 2026-04-28 | Plausible Analytics        | Privacy-friendly, pas de bandeau cookies, déjà sur jonlabs.ch         | Google Analytics (RGPD problématique)                          |
| 2026-04-28 | Vercel hébergement         | Adapter SvelteKit officiel, déploiement Git auto, gratuit             | Netlify, Cloudflare Pages                                      |
