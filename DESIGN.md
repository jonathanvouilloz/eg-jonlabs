# DESIGN.md — EG Page Devis

## Color Strategy: Committed

The forest green is not an accent — it carries the page. Warm cream breathes between sections. Gold punctuates key moments only.

### Palette

| Role          | Token                   | Value (OKLCH)          | Hex reference                    |
| ------------- | ----------------------- | ---------------------- | -------------------------------- |
| Primary       | `--color-primary`       | `oklch(32% 0.09 145)`  | #2D5016                          |
| Primary light | `--color-primary-light` | `oklch(47% 0.08 145)`  | #5c7c3f                          |
| Secondary     | `--color-secondary`     | `oklch(95% 0.015 80)`  | #F4F1EA                          |
| Accent (gold) | `--color-accent`        | `oklch(74% 0.08 60)`   | #D4A574                          |
| Background    | `--color-bg`            | `oklch(97% 0.01 80)`   | #faf7ee                          |
| Text          | `--color-text`          | `oklch(18% 0.008 145)` | (tinted near-black, not #1a1a1a) |
| Text muted    | `--color-text-muted`    | `oklch(52% 0.008 145)` | (tinted gray, not #6b6b6b)       |

**Rules:**

- Never use `#000`, `#fff`, or pure neutral grays. All neutrals tinted toward the green hue (chroma 0.005–0.01 minimum).
- Accent (gold) appears on ≤10% of any screen. Used for price reveal, key callouts, progress marker.
- Primary green covers 30–40% of total surface (hero, section backgrounds, CTA blocks). It earns the page.
- Background is warm paper (#faf7ee) — never cold white.

## Typography

### Type System

- **Display / H1**: Playfair Display, italic, weight 400, letterspacing –0.03em, line-height 1.05
- **Headlines / H2–H3**: Playfair Display, weight 400, letterspacing –0.025em, line-height 1.2
- **Labels / UI**: Inter, weight 500–600, uppercase, letterspacing 0.08em (for section eyebrows and step counters)
- **Body**: Inter, weight 400, line-height 1.6, max 65ch per line
- **Captions / muted**: Inter, weight 400, size 0.875rem, line-height 1.5

**Rules:**

- Italic is a voice choice for display type — not emphasis in body. Use it for the H1 hero and key quote moments.
- Body line-height is locked at 1.6.
- Headlines use `clamp()` for fluid sizing; body uses fixed `rem`.
- Scale steps: 0.75 / 0.875 / 1 / 1.125 / 1.25 / 1.5 / 1.875 / 2.25 / 3 / 3.75 / 4.5rem

### Font Loading

Inter and Playfair Display — preloaded via Google Fonts in `app.html`.

## Spatial Design

Spacing tokens (skip 4px — use 8px as minimum):
`8 / 16 / 24 / 32 / 48 / 80 / 120px`

**Section rhythm**: sections alternate between warm paper (bg) and deep forest green (primary). The contrast creates breathing and visual momentum.

**Content max-width**: 640px for quiz/form, 768px for editorial content, 1200px for gallery/full-bleed.

**Cards**: used sparingly. The quiz is NOT in a card — it floats on the section background. Cards only appear for testimonials and realizations.

## Elevation & Shadow

- **Flat by default**: no shadow at rest
- **Hover lift**: `box-shadow: 0 4px 24px oklch(18% 0.009 145 / 0.12)` — tinted, never pure black
- **Maximum alpha**: 0.15 at max blur
- No nested cards. Ever.

## Component Conventions

### Buttons

- **Primary CTA**: background primary green, text white, no border-radius (sharp), uppercase label, letterspacing 0.06em, padding 16px 32px
- **Secondary**: border 1.5px primary, transparent background, primary text — same sharp edges
- **Ghost / back**: text-only, no border, muted color, hover underline

### Form inputs

- Border 1.5px, color `--color-text-muted/40` at rest, `--color-primary` on focus
- No border-radius
- Background: warm white (`oklch(99% 0.005 80)`)
- Label above input, weight 500, size 0.875rem

### Quiz progress

- Not a bar. A step counter: "2 / 4" or dot sequence.
- Accent gold dot for current step, filled primary for completed, empty for future.

### Service cards (StepService)

- Full-bleed image, overlay gradient bottom-to-top, label in white at bottom
- Selected state: accent gold border 2px + gold checkmark top-right
- No card radius

### Quote result

- No `border-left` stripe. Ever.
- Price reveal: large display number in primary on secondary background — full-width block, centered, breathing room above and below (80px padding)
- Breakdown: clean `<dl>` with dotted separator line, no colored borders
- Explanation items: indented with a typographic em-dash or numbered list, not a side stripe

## Motion

- Transitions: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for all interactions
- Duration: 200ms for micro (hover), 320ms for step transitions, 480ms for reveals
- Quiz step change: `fly` with `x: ±60px` + `opacity` — current implementation is fine, keep it
- Quote result appear: `scale(0.97) → scale(1)` + `opacity 0→1`, 480ms — marks the reveal moment
- No bounce, no elastic, no layout-property animation
- Respect `prefers-reduced-motion`: all transitions → instant

## Section-by-section layout

| Section      | Background                      | Treatment                                    |
| ------------ | ------------------------------- | -------------------------------------------- |
| Hero         | Full-bleed image + dark overlay | Display italic H1, CTA sharp white           |
| Reassurance  | primary green                   | White text, 3 stats with gold accent numbers |
| Quiz         | bg (warm paper)                 | Floats free, no card container               |
| Realizations | secondary (cream)               | Masonry-style 2–3 col, sharp image frames    |
| Testimonials | bg (warm paper)                 | Simple text cards, no avatar photos          |
| Map          | primary green                   | White text, minimal                          |
| FAQ          | bg (warm paper)                 | Accordion, clean border separators           |
| CTA Final    | primary green                   | Strong, full-width, single action            |
| Footer       | Dark (primary darkened)         | Single line, minimal                         |

## Absolute Bans (inherited from impeccable)

- `border-left` or `border-right` colored accent stripes on cards/callouts
- `background-clip: text` gradient fills
- Glassmorphism used decoratively (hero CTA backdrop-blur is borderline — replace with solid semi-transparent)
- Nested cards
- Bounce or elastic easing
- Identical card grids
- `#000` or `#fff` anywhere
- Gray text on colored backgrounds without sufficient contrast
