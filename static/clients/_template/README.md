# Template prospect — Guide de remplissage

Duplique ce dossier (`_template/`) en `[slug-prospect]/` et remplis `config.json`.

## Conventions

- **slug** : `kebab-case`, sans accents (ex : `paysages-de-grange`).
- **createdAt** : format `YYYY-MM-DD`.
- **phone** : format E.164 (`+41XXXXXXXXX`, sans espace).
- **branding.fontFamily** : une de `Inter`, `Source Serif`, `Playfair Display`, `Raleway`.
- **branding colors** : hex 6 caractères (`#RRGGBB`). Vérifier le contraste WCAG AA avec le texte.
- **quizVariant** : `B` (4 étapes), `C` (+ inspiration), `D` (+ champ libre).

## Photos

- **heroImage** : peut être une URL externe (Unsplash) ou un chemin local `/clients/[slug]/hero.jpg` (à placer dans `static/clients/[slug]/`).
- **services[].image** : idem, ou `null` pour utiliser l'icône emoji seule.
- **realizations[].after** / `.before` : photos avant/après. Si pas de photo `before`, mets `null`.

## Calcul automatique du devis

Le champ **`pricingCategory`** sur chaque service détermine comment le devis instantané est calculé. Valeurs possibles :

| Catégorie             | Cas d'usage                                             | Calcul                         |
| --------------------- | ------------------------------------------------------- | ------------------------------ |
| `tonte`               | Tonte de pelouse                                        | CHF/m²                         |
| `creation_jardin`     | Création complète                                       | CHF/m²                         |
| `amenagement_complet` | Aménagement extérieur (terrasse + plantations + allées) | CHF/m²                         |
| `taille_haies`        | Taille de haies seule                                   | CHF/ml estimé                  |
| `elagage`             | Élagage / abattage d'arbres                             | Forfait par taille de chantier |
| `terrasse_dalle`      | Pose de dalles                                          | CHF/m²                         |
| `terrasse_bois`       | Terrasse bois                                           | CHF/m²                         |
| `gazon_rouleau`       | Pose de gazon en rouleau                                | CHF/m²                         |
| `entretien_annuel`    | Contrat d'entretien régulier                            | CHF/an forfait                 |
| `plantation`          | Plantation arbustes / massifs                           | CHF/m²                         |
| `horaire_simple`      | Fallback générique (heures × tarif)                     | Forfait heures                 |

**Si tu ne sais pas quelle catégorie choisir**, omets le champ ou utilise `horaire_simple` — le client recevra une estimation basée sur le tarif horaire moyen.

Les fourchettes de prix sont définies dans `src/lib/data/pricingRates.ts` (médianes Suisse romande 2025-2026).

## leadDelivery

- **recipientEmail** : où le paysagiste reçoit les leads. Reply-To = email du client final, BCC = `leads@jonlabs.ch`.
- **subjectPrefix** : ex `[DEVIS PAYSAGES DE GRANGE]` — apparaît dans l'objet de l'email.

## Validation

À la première navigation `/eg/[slug]`, la config est validée par Zod (`src/lib/utils/validation.ts`). Si invalide :

- En dev : message d'erreur détaillé.
- En prod : 404 "Page introuvable".

## Test

Une fois la config créée, lance `npm run dev` et navigue vers `http://localhost:5173/eg/[slug]`.
