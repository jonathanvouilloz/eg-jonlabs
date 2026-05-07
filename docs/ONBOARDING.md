# Onboarding client — Setup en 12 minutes

## 1. Ce qu'il faut collecter avant de commencer (~3 min)

Demande au prospect (email ou appel rapide) :

| Info                      | Exemple                           | Obligatoire |
| ------------------------- | --------------------------------- | ----------- |
| Nom de l'entreprise       | Jardins Dupont Sàrl               | ✓           |
| Prénom / nom du gérant    | Marc Dupont                       | ✓           |
| Phrase de positionnement  | Paysagiste à Genève depuis 12 ans | ✓           |
| Numéro de téléphone       | +41 79 123 45 67                  | ✓           |
| Email professionnel       | marc@jardins-dupont.ch            | ✓           |
| Années d'expérience       | 12                                | ✓           |
| Zones d'intervention      | Genève, Carouge, Lancy            | ✓           |
| Rayon d'intervention (km) | 20                                | ✓           |
| Services proposés (liste) | Entretien, Création, Élagage      | ✓           |
| Nb de chantiers réalisés  | 230                               | optionnel   |
| Note Google / nb avis     | 4.8 / 37 avis                     | optionnel   |
| Logo (URL ou fichier)     | —                                 | optionnel   |

---

## 2. Créer le dossier client (~1 min)

```bash
# Remplace [slug] par kebab-case sans accents
# Ex: "Jardins Dupont" → jardins-dupont
cp -r static/clients/_template static/clients/[slug]
```

Ouvrir `static/clients/[slug]/config.json` dans l'éditeur.

---

## 3. Remplir la config (~6 min)

### Identité & crédibilité

Remplis directement depuis les infos collectées à l'étape 1.

**Trouver lat/long en 30 secondes :**

1. Google Maps → cherche la ville du prospect
2. Clic droit sur le centre de sa zone → "Plus d'informations"
3. Les coordonnées apparaissent en haut (format : `46.2044, 6.1432`)

**Format téléphone E.164 :**
`+41 79 123 45 67` → `+41791234567` (supprimer espaces et le 0 initial)

### Branding — 3 palettes recommandées

**Vert naturel** (paysagiste classique)

```json
"primaryColor": "#2D5016",
"secondaryColor": "#F4F1EA",
"accentColor": "#D4A574",
"fontFamily": "Playfair Display"
```

**Bois & chaud** (artisan terrasse / élagage)

```json
"primaryColor": "#5C3D2E",
"secondaryColor": "#FDF6EC",
"accentColor": "#C17D3C",
"fontFamily": "Source Serif"
```

**Épuré moderne** (haut de gamme, Genève/Zurich)

```json
"primaryColor": "#1A1A2E",
"secondaryColor": "#F8F8F8",
"accentColor": "#4CAF50",
"fontFamily": "Inter"
```

**Vérifier le contraste :** [coolors.co/contrast-checker](https://coolors.co/contrast-checker) — primaryColor sur blanc doit passer WCAG AA (ratio ≥ 4.5).

### Hero image — URLs Unsplash prêtes à l'emploi

```
# Jardin/pelouse
https://images.unsplash.com/photo-1591383496652-db773e57b1d0?w=1400&q=80

# Terrasse/aménagement
https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80

# Taille/élagage
https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&q=80

# Création jardin
https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1400&q=80
```

### Quiz variant — lequel choisir ?

| Variante | Quand l'utiliser                                                  |
| -------- | ----------------------------------------------------------------- |
| `B`      | Prospect classique, services standards                            |
| `C`      | Prospect avec galerie d'inspiration (ajoute `inspirationGallery`) |
| `D`      | Prospect avec besoins spécifiques/sur-mesure (ajoute champ libre) |

**En cas de doute : utilise `B`.**

### Services — pricingCategory à choisir

| Service             | pricingCategory       |
| ------------------- | --------------------- |
| Entretien régulier  | `entretien_annuel`    |
| Tonte seule         | `tonte`               |
| Taille de haies     | `taille_haies`        |
| Élagage / abattage  | `elagage`             |
| Création de jardin  | `creation_jardin`     |
| Aménagement complet | `amenagement_complet` |
| Terrasse en dalles  | `terrasse_dalle`      |
| Terrasse en bois    | `terrasse_bois`       |
| Gazon en rouleau    | `gazon_rouleau`       |
| Plantation massifs  | `plantation`          |
| Autre / génériq.    | `horaire_simple`      |

### Réalisations — si pas de photos du prospect

Utilise des photos Unsplash thématiques pour le MVP, à remplacer par les vraies photos après :

```json
{
	"before": null,
	"after": "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1200&q=80",
	"caption": "Création d'un jardin paysager"
}
```

### Témoignages — si le prospect n'en a pas encore

Laisse `"testimonials": []` — la section est masquée si vide.

### FAQ — base minimale à adapter

```json
[
	{
		"question": "Combien coûte un entretien de jardin ?",
		"answer": "Le tarif dépend de la surface et de la fréquence. Faites notre devis instantané ci-dessus pour une estimation personnalisée."
	},
	{
		"question": "Intervenez-vous dans toute la région ?",
		"answer": "Nous intervenons dans un rayon de XX km autour de [ville], notamment à [zones]."
	},
	{
		"question": "Quel délai pour une intervention ?",
		"answer": "Sous 48h pour les urgences, 1 à 2 semaines pour les chantiers planifiés."
	}
]
```

---

## 4. Valider la config (~1 min)

```bash
npm run check-client [slug]
```

Si erreurs → les champs problématiques sont listés avec le message exact. Corrige et relance.

---

## 5. Tester en local (~1 min)

```bash
npm run dev
# Ouvre http://localhost:5173/eg/[slug]
```

Vérifie :

- [ ] La page s'affiche (pas de 404)
- [ ] Les couleurs/branding sont corrects
- [ ] Le quiz se lance avec les bons services
- [ ] Le devis s'affiche après soumission (sans envoyer l'email en dev)

---

## 6. Déployer

Commit + push → Vercel déploie automatiquement. La page est live sur `jonlabs.ch/eg/[slug]`.

```bash
git add static/clients/[slug]/
git commit -m "feat(clients): ajoute prospect [slug]"
git push
```

---

## Récap des temps

| Étape              | Temps       |
| ------------------ | ----------- |
| Collecte infos     | ~3 min      |
| Création dossier   | ~1 min      |
| Remplissage config | ~6 min      |
| Validation + test  | ~2 min      |
| **Total**          | **~12 min** |
