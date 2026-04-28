# Style Guide — EG Page Devis

## Direction artistique

**Ton** : chaleureux, artisan, professionnel
**Ambiance** : nature, authenticité, proximité

## Palette par défaut

| Rôle | Couleur | Hex |
|------|---------|-----|
| Fond principal | Beige chaud | `#F4F1EA` |
| Fond secondaire | Beige clair | `#FAF7EE` |
| Accent primaire | Vert naturel | `#2D5016` |
| Accent secondaire | Vert sauge | `#5C7C3F` |
| Accent tertiaire | Terracotta | `#D4A574` |
| Texte principal | Noir doux | `#1A1A1A` |
| Texte secondaire | Gris chaud | `#6B6B6B` |

> Les couleurs du prospect surchargent cette palette via CSS variables.

## Typographie

| Usage | Font | Poids |
|-------|------|-------|
| Titres (H1-H3) | Source Serif / Playfair Display | 600-700 |
| Corps de texte | Inter | 400-500 |
| Boutons / labels | Inter | 500-600 |

Font choisie par prospect via `branding.fontFamily` dans la config.

## Structure des fichiers

```
src/lib/components/     → Composants réutilisables (PascalCase.svelte)
src/lib/components/Quiz/ → Sous-composants du quiz
src/lib/stores/         → State Svelte 5 runes (.svelte.ts)
src/lib/types/          → Types TypeScript
src/lib/utils/          → Fonctions utilitaires
src/routes/eg/[slug]/   → Route dynamique par prospect
src/routes/api/         → API endpoints (soumission lead)
static/clients/         → Config JSON + assets par prospect
static/_fallback/       → Photos génériques de secours
```

## Patterns utilisés

- **Config-driven rendering** : chaque prospect a un `config.json` qui pilote toute la page
- **CSS variables pour theming** : les couleurs du prospect sont injectées en CSS vars au chargement
- **Svelte 5 runes pour le state** : `$state`, `$derived`, `$effect` — pas de stores legacy
- **Zod pour la validation** : schémas Zod côté serveur (obligatoire) et côté client (UX)
- **Honeypot anti-spam** : champ caché CSS `display:none`, rejet silencieux si rempli

## Composants UI

- **Photos** : grandes, immersives, toujours optimisées WebP
- **Espacement** : généreux, beaucoup de blanc
- **Boutons CTA** : arrondis, couleur accent, padding généreux
- **Cards** : ombre subtile, coins arrondis, fond blanc
- **Animations** : slide transitions entre étapes du quiz, accordion smooth pour FAQ
- **Header** : sticky, backdrop-blur, translucide

## Responsive

- Mobile-first approach
- Breakpoints Tailwind standard : `sm` (640), `md` (768), `lg` (1024), `xl` (1280)
- Quiz : plein écran mobile, centré desktop
- Grilles : 1 col mobile → 2-3 cols desktop

## Accessibilité

- Contraste WCAG AA minimum
- `aria-label` sur tous les boutons interactifs
- Navigation clavier complète dans le quiz
- Labels HTML explicites sur les champs de formulaire
