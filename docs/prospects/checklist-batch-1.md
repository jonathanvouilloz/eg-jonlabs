# Checklist Batch 1 — 10 paysagistes prioritaires

> Sélection : **Tier S complet (7)** + **3 premiers Tier A non-borderline** (sans site, avec ou sans email).
> Source du classement : `docs/prospects/prospects-paysagistes-romande.md`.
> Mis à jour : 2026-05-08 — adresses + coords patchées automatiquement

## Mode d'emploi

1. Pour chaque prospect, remplir les champs manquants ci-dessous (sources suggérées en bas).
2. Quand tout est rempli, ouvrir `static/clients/[slug]/config.json` et coller les valeurs aux bons endroits.
3. Cocher `[x]` une fois copié dans la config.
4. `npm run check-client [slug]` pour valider.

## Tableau de bord

| #   | Prospect                 | Slug                 | Tier | Owner | Mail | Phone | Logo | Adresse | GMB |  Cover  |
| --- | ------------------------ | -------------------- | ---- | :---: | :--: | :---: | :--: | :-----: | :-: | :-----: |
| 1   | GT Paysages Sàrl         | `gt-paysages`        | S    |   ✗   |  ✓   |   ✓   |  ✗   |    ✓    |  ✓  |   ⚠️    |
| 2   | M.E.J. — Paysagiste Sàrl | `mej-paysagiste`     | S    |   ✗   |  ✓   |   ✓   |  ✗   |    ✓    |  ✗  | doublon |
| 3   | Paillard Paysages        | `paillard-paysages`  | S    |   ✗   |  ✓   |   ✓   |  ✗   |    ✓    |  ✗  |    ✓    |
| 4   | BERISHA Jardins Sàrl     | `berisha-jardins`    | S    |   ✓   |  ✓   |   ✓   |  ✗   |    ✓    |  ✗  |    ✓    |
| 5   | BS Paysagiste Sàrl       | `bs-paysagiste`      | S    |   ✗   |  ✓   |   ✓   |  ✗   |    ✓    |  ✗  |    ✓    |
| 6   | Pillonel Sébastien       | `pillonel-sebastien` | S    |   ✓   |  ✓   |   ✓   |  ✗   |    ✓    |  ✗  |    ✓    |
| 7   | Germa Paysages Sàrl      | `germa-paysages`     | S    |   ✗   |  ✓   |   ✓   |  ✗   |    ✓    |  ✗  |    ✓    |
| 8   | Paysage Dos Santos Sàrl  | `paysage-dos-santos` | A    |   ✗   |  ✗   |   ✓   |  ✗   |    ~    |  ✗  |    ✗    |
| 9   | Art & Paysage Sàrl       | `art-paysage`        | A    |   ✗   |  ✗   |   ✓   |  ✗   |    ✓    |  ✗  |    ✓    |
| 10  | Lami Paysagiste          | `lami-paysagiste`    | A    |   ✗   |  ✗   |   ✓   |  ✗   |    ✓    |  ✗  |    ✓    |

**Légende** : ✓ = OK / ✗ = manquant / ~ = ville seule / ⚠️ = à vérifier

---

## 1. GT Paysages Sàrl — `gt-paysages` 🟢 (déjà en prod)

- [ ] **ownerFirstName / ownerLastName** : `_____________` → [Zefix GT Paysages](https://www.zefix.ch/fr/search/entity/list?name=GT+Paysages&searchType=0)
- [x] **business.email** : `contact@gtpaysages.ch` ✓ (déjà en config)
- [x] **business.address** : `Rue du Pré-Jérôme 19, 1205 Genève` ✓ (patché)
- [x] **business.googleProfileUrl** : `https://share.google/4RFeCGDz2qxnWpjzH` ✓ (déjà OK)
- [ ] **business.logoUrl** : `_____________` (logo introuvable sans site — laisser `null`)
- [ ] **heroImage** : remplacer URL Unsplash par `/clients/gt-paysages/hero.jpg` après `node scripts/fetch-heroes.mjs --slug gt-paysages`

**Maps direct** : `https://maps.google.com/maps/place/GT+Paysages+Sàrl/@46.192803,6.146403,17z`

---

## 2. M.E.J. — Paysagiste Sàrl — `mej-paysagiste`

- [ ] **ownerFirstName / ownerLastName** : `_____________` → [Zefix MEJ](https://www.zefix.ch/fr/search/entity/list?name=MEJ+Paysagiste&searchType=0)
- [x] **business.email** : `info@mejsarl.ch` ✓
- [x] **business.address** : `Rue Maunoir 35, 1207 Genève` ✓ (patché)
- [ ] **business.googleProfileUrl** : `https://share.google/_____________` → Maps → Partager
- [ ] **business.logoUrl** : `_____________` (laisser `null` si pas de site)
- [ ] **🚨 cover doublon** : la photo actuelle = celle de lami. Corriger :
  ```bash
  # 1. Google Maps → M.E.J. Paysagiste → onglet Photos → clic photo → bouton droit → Copier l'adresse
  # 2. Mettre l'URL dans docs/prospects/hero-photos.json (ligne "mej-paysagiste")
  # 3. rm static/clients/mej-paysagiste/hero.jpg
  # 4. node scripts/fetch-heroes.mjs --slug mej-paysagiste
  ```
  Si pas de photo propre sur GMB → utiliser une Unsplash ou laisser fallback.

**Maps direct** : `https://maps.google.com/maps/place/M.E.J.+-+Paysagiste+Sàrl/@46.202722,6.161768,17z`

---

## 3. Paillard Paysages — `paillard-paysages`

- [ ] **ownerFirstName** : `_____________` (Paillard = nom de famille OK) → Zefix ou local.ch
- [x] **business.email** : `paillardpaysages@hotmail.ch` ✓
- [x] **business.address** : `Rue du Village 22, 1347 Le Chenit` ✓ (patché — Vallée de Joux)
- [ ] **business.googleProfileUrl** : `https://share.google/_____________` → Maps → Partager
- [ ] **business.logoUrl** : `_____________`
- [x] **heroImage** : `/clients/paillard-paysages/hero.jpg` ✓ (à télécharger avec fetch-heroes)

**Maps direct** : `https://maps.google.com/maps/place/Paillard+Paysages/@46.6182806,6.2314287,17z`

> ⚠️ Note : adresse réelle = Le Chenit (Vallée de Joux), pas "Le Solliat" comme initialement listé sur GMB. Zones et communes corrigées dans config.

---

## 4. BERISHA Jardins Sàrl — `berisha-jardins` ✅ (le plus avancé)

- [x] **ownerFirstName / ownerLastName** : `Remzi Berisha` ✓
- [x] **business.email** : `berishajardins@hotmail.com` ✓
- [x] **business.address** : `Chemin de Vers 14, 1228 Plan-les-Ouates` ✓ (patché)
- [ ] **business.googleProfileUrl** : `https://share.google/_____________` → Maps → Partager
- [ ] **business.logoUrl** : `_____________`
- [x] **heroImage** : `/clients/berisha-jardins/hero.jpg` ✓

**Maps direct** : `https://maps.google.com/maps/place/BERISHA+Jardins+Sàrl/@46.1681835,6.1218747,17z`

---

## 5. BS Paysagiste Sàrl — `bs-paysagiste`

- [ ] **ownerFirstName / ownerLastName** : `_____________` → [Zefix BS Paysagiste](https://www.zefix.ch/fr/search/entity/list?name=BS+Paysagiste&searchType=0)
- [x] **business.email** : `bspaysagiste@gmail.com` ✓
- [x] **business.address** : `Route de la Saussaz 2, 1816 Montreux` ✓ (patché)
- [ ] **business.googleProfileUrl** : `https://share.google/_____________` → Maps → Partager
- [ ] **business.logoUrl** : `_____________`
- [x] **heroImage** : `/clients/bs-paysagiste/hero.jpg` ✓

**Maps direct** : `https://maps.google.com/maps/place/BS+Paysagiste+Sàrl/@46.4503544,6.8901625,17z`

---

## 6. Pillonel Sébastien — `pillonel-sebastien` ✅

- [x] **ownerFirstName / ownerLastName** : `Sébastien Pillonel` ✓
- [x] **business.email** : `seb.pillonel@bluewin.ch` ✓
- [x] **business.address** : `Rue Saint-Georges 27C, 1400 Yverdon-les-Bains` ✓ (patché)
- [ ] **business.googleProfileUrl** : `https://share.google/_____________` → Maps → Partager
- [ ] **business.logoUrl** : `_____________`
- [x] **heroImage** : `/clients/pillonel-sebastien/hero.jpg` ✓

**Maps direct** : `https://maps.google.com/maps/place/Pillonel+Sébastien/@46.782583,6.628955,17z`

---

## 7. Germa Paysages Sàrl — `germa-paysages`

- [ ] **ownerFirstName** : `_____________` (Germa = nom de famille OK) → [Zefix Germa](https://www.zefix.ch/fr/search/entity/list?name=Germa+Paysages&searchType=0)
- [x] **business.email** : `secretariat@germa-paysages.ch` ✓
- [x] **business.address** : `Route Boeuferrant-Nord 19, 1870 Monthey` ✓ (patché)
- [ ] **business.googleProfileUrl** : `https://share.google/_____________` → Maps → Partager
- [ ] **business.logoUrl** : `_____________`
- [x] **heroImage** : `/clients/germa-paysages/hero.jpg` ✓

**Maps direct** : `https://maps.google.com/maps/place/Germa+Paysages+Sàrl/@46.276605,6.959127,17z`

---

## 8. Paysage Dos Santos Sàrl — `paysage-dos-santos`

- [ ] **ownerFirstName** : `_____________` (Dos Santos = nom de famille OK)
- [x] **ownerLastName** : `Dos Santos` ✓
- [ ] **business.email** : `_____________` → essayer [local.ch](https://www.local.ch/fr/q?what=Paysage+Dos+Santos&where=Vandoeuvres) ou contact direct tél
- [x] **business.address** : `_____________, 1253 Vandoeuvres` → à confirmer (GMB affiche Vandoeuvres mais Zefix peut avoir l'adresse exacte)
- [ ] **business.googleProfileUrl** : `https://share.google/_____________`
- [ ] **business.logoUrl** : `_____________`
- [ ] **heroImage** : pas de photo GMB → garder Unsplash fallback ou récupérer manuellement

> ⚠️ Note : un agent a trouvé "VENDEIRA DOS SANTOS Sàrl" à Av. Pictet-de-Rochemont 28, 1207 Genève (tél 022 700 37 22 identique). Vérifier si c'est la même entité ou une homonyme avant d'utiliser cette adresse.

**Zefix** : [recherche Dos Santos](https://www.zefix.ch/fr/search/entity/list?name=Dos+Santos&searchType=0)

---

## 9. Art & Paysage Sàrl — `art-paysage`

- [ ] **ownerFirstName / ownerLastName** : `_____________` → [Zefix Art Paysage](https://www.zefix.ch/fr/search/entity/list?name=Art+%26+Paysage&searchType=0)
- [ ] **business.email** : `_____________` → essayer local.ch ou contact direct tél 022 341 30 00
- [x] **business.address** : `Chemin Delay 7, 1214 Vernier` ✓ (patché)
- [ ] **business.googleProfileUrl** : `https://share.google/_____________`
- [ ] **business.logoUrl** : `_____________`
- [x] **heroImage** : `/clients/art-paysage/hero.jpg` ✓

**Maps direct** : `https://maps.google.com/maps/place/Art+%26+Paysage+Sàrl/@46.2180042,6.078157,17z`

---

## 10. Lami Paysagiste — `lami-paysagiste`

> Note : nom corrigé `"Lami Paysagiste"` (capitale) dans config.json.

- [ ] **ownerFirstName** : `_____________` (Lami = nom de famille OK) → Zefix / local.ch
- [x] **ownerLastName** : `Lami` ✓
- [ ] **business.email** : `_____________` → essayer local.ch ou contact direct tél 079 487 84 16
- [x] **business.address** : `Rue de la Corraterie 24, 1204 Genève` ✓ (patché)
- [ ] **business.googleProfileUrl** : `https://share.google/_____________`
- [ ] **business.logoUrl** : `_____________`
- [x] **heroImage** : `/clients/lami-paysagiste/hero.jpg` ✓

**Maps direct** : `https://maps.google.com/maps/place/lami+paysagiste/@46.2022359,6.1434094,17z`

---

## Ce qui reste à faire manuellement

| Champ                | Entreprises concernées                                      | Source rapide                                         |
| -------------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| **Owner prénom**     | GT, MEJ, Paillard, BS, Germa, Dos Santos, Art&Paysage, Lami | [zefix.ch](https://zefix.ch) → nom Sàrl → "Mutations" |
| **share.google URL** | Tous sauf GT (déjà ok)                                      | Maps → fiche → "Partager" → copier lien               |
| **Email manquant**   | Dos Santos, Art&Paysage, Lami                               | local.ch / appel direct                               |
| **Logo**             | Tous                                                        | Sans site = pas de logo → laisser `null`              |
| **Cover MEJ**        | MEJ uniquement                                              | GMB → Photos → clic photo → copier URL                |
| **heroImage GT**     | GT uniquement                                               | `node scripts/fetch-heroes.mjs --slug gt-paysages`    |

## Sources

| Champ                 | Source           | Lien direct                                             |
| --------------------- | ---------------- | ------------------------------------------------------- |
| **Owner Sàrl**        | Zefix RC         | https://zefix.ch → recherche nom                        |
| **Owner indépendant** | local.ch         | https://local.ch/fr/q?what=lami+paysagiste&where=Genève |
| **Email**             | local.ch / appel | Composer le 022/078/079 si rien en ligne                |
| **share.google URL**  | Google Maps      | Fiche → "Partager" → copier `https://share.google/...`  |
| **Logo**              | —                | Ces entreprises n'ont pas de site → `null` dans config  |

## Une fois les 10 remplis

```bash
node scripts/fetch-heroes.mjs          # télécharger les photos manquantes
npm run check-client gt-paysages       # valider config par config
npm run dev                            # tester http://localhost:5173/site/[slug]
```

Déploiement : push sur master → Vercel build auto → `eg.jonlabs.ch/site/[slug]` et `/landing/[slug]` actifs.
