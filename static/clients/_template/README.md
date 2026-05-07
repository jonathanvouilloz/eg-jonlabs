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

## Page de vente + mock site

Depuis le pivot `landing/site`, chaque prospect a deux URLs :

- `/landing/[slug]` — page de vente perso (screenshot + Loom + CTA vers le mock)
- `/site/[slug]` — mock du site complet (9 sections : hero, marché local, services, zones, témoignages, galerie, devis, SEO, CTA)

### salesPage (optionnel)

- **loomVideoId** : ID Loom de la vidéo générique (la même pour tous les prospects, ex la "vidéo Léo").
- **screenshotUrl** : chemin du screenshot du mock site, ex `/screenshots/[slug].png`. À placer dans `static/screenshots/`.
- **subtitleObservation** : observation perso entre parenthèses, ex `(j'ai pris le vert sur ta camionnette)`. Vide si rien à dire.

### localMarket (optionnel)

Affiche les chiffres de marché local dans la section "Ta zone aujourd'hui" du mock.

- **monthlySearches** : nombre de recherches "paysagiste" sur la commune principale (DataForSEO ou estimé).
- **topThreeCaptureRate** : part captée par le top 3 du local pack (0-1, typiquement 0.5).

### communes (optionnel)

Liste des communes desservies pour la grille SEO local. Si absent, on utilise `credibility.zones`.

### transparencyNote (optionnel)

Si `true`, affiche le bandeau de transparence sous le hero ("Aperçu : tes vraies photos s'intègrent en 1h une fois qu'on attaque").

## Validation

À la première navigation `/site/[slug]`, la config est validée par Zod (`src/lib/utils/validation.ts`). Si invalide :

- En dev : message d'erreur détaillé.
- En prod : 404 "Page introuvable".

## Test

Une fois la config créée, lance `npm run dev` et navigue vers `http://localhost:5173/landing/[slug]` puis `http://localhost:5173/site/[slug]`.
