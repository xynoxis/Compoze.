# Design System — Compoze Reference UI

> A visual design specification based on the supplied Compoze reference image.
> The goal is to reproduce the same calm editorial aesthetic, warm off-white
> surfaces, deep teal accent, strong typographic hierarchy, soft depth, and
> premium tactile UI.

---

## 1. Design Direction

### Core aesthetic

The interface should feel like a **premium editorial publishing platform**, not a conventional SaaS dashboard.

Key characteristics:

- Warm, almost-white canvas
- Deep charcoal editorial typography
- Muted dark teal as the primary accent
- Large serif display typography
- Restrained sans-serif UI typography
- Very soft gray borders
- Large, diffused drop shadows
- Layered cards that appear physically raised from the page
- Subtle glass / frosted-surface treatment
- Generous whitespace
- Thin, elegant dividers
- Rounded containers without becoming overly "app-like"
- Minimal iconography
- Quiet motion and tactile hover states

The visual language should communicate:

**editorial + intellectual + calm + premium + tactile**

Avoid:

- Hard black borders
- Strong saturated colors
- Excessive gradients
- Heavy glassmorphism
- Neon effects
- Excessive corner rounding
- Dense dashboard layouts
- Generic Bootstrap / Material styling
- Strong card outlines
- Excessive shadows that make elements look floating

---

# 2. Color System

The reference is intentionally restrained. Most of the UI lives within a narrow range of warm whites and grays.

## 2.1 Base Colors

```css
:root {
  --color-background: #F2F2F0;
  --color-surface: #F7F7F5;
  --color-surface-raised: #FAFAF8;
  --color-surface-soft: #ECECEA;

  --color-text-primary: #101417;
  --color-text-secondary: #5E6264;
  --color-text-muted: #85898A;
  --color-text-faint: #A7AAAB;

  --color-border: rgba(20, 25, 25, 0.08);
  --color-border-light: rgba(255, 255, 255, 0.82);

  --color-primary: #075E56;
  --color-primary-dark: #064C46;
  --color-primary-soft: #DDEBE8;

  --color-white: #FFFFFF;
}
```

### Visual priority

1. `--color-background`
2. `--color-surface`
3. `--color-text-primary`
4. `--color-primary`
5. `--color-text-secondary`
6. Borders and muted text

The teal accent should remain **rare and intentional**.

Use it for:

- Primary CTA
- Active navigation state
- Small status indicators
- Selected states
- Important editorial accents
- Links when emphasis is required

Do not use teal for every interactive element.

---

# 3. Typography

Typography is one of the most important parts of the design.

The reference combines:

- **Editorial serif** for major statements and article titles
- **Clean sans-serif** for navigation, metadata, buttons, labels, and descriptions

## 3.1 Font Roles

### Display / Editorial Serif

Recommended:

```css
font-family: "DM Serif Display", "Cormorant Garamond", Georgia, serif;
```

Alternative premium pairing:

```css
font-family: "Playfair Display", Georgia, serif;
```

Use for:

- Hero headline
- Large editorial statements
- Article titles
- Featured story headings
- Important quotes

### UI Sans

Recommended:

```css
font-family: "Inter", "SF Pro Display", system-ui, sans-serif;
```

Use for:

- Navigation
- Buttons
- Search
- Metadata
- Labels
- Descriptions
- Form controls
- Utility information

---

# 4. Type Scale

Use a strong contrast between editorial typography and interface typography.

| Token | Size | Weight | Usage |
|---|---:|---:|---|
| Display XL | 56–64px | 500–600 | Hero headline |
| Display L | 42–48px | 500–600 | Major section heading |
| Heading XL | 30–36px | 500–600 | Featured title |
| Heading L | 24–28px | 500–600 | Article title |
| Heading M | 18–21px | 500–600 | Card title |
| Body L | 18px | 400 | Hero description |
| Body M | 15–16px | 400 | General content |
| Body S | 13–14px | 400 | Metadata |
| Label | 11–12px | 600 | Section labels |
| Micro | 10–11px | 600 | Tiny metadata |

### Hero typography

The hero headline should be approximately:

```css
.hero-title {
  font-family: var(--font-editorial);
  font-size: clamp(44px, 4.2vw, 64px);
  line-height: 0.98;
  letter-spacing: -0.035em;
  font-weight: 500;
}
```

The first line is charcoal.

The emphasized second line uses deep teal.

Example:

```text
Keep composing.
Ideas flow, stories build.
```

The contrast between the two lines is intentional and should remain.

---

# 5. Text Hierarchy

The hierarchy should be immediately readable from a distance.

## Level 1 — Hero

Largest element on the page.

Characteristics:

- Serif
- Large
- Tight line height
- Strong contrast
- Two-line composition
- Charcoal + teal emphasis

## Level 2 — Section Heading

Examples:

```text
TRENDING ON COMPOZE
FEATURED STORY
```

Characteristics:

- Sans-serif
- Uppercase
- Small
- Letter-spaced
- Medium/high weight
- Accompanied by a tiny teal indicator

## Level 3 — Content Title

Article titles use serif typography.

They should feel like publication headlines rather than application labels.

## Level 4 — Metadata

Examples:

```text
Aug 19, 2026  •  8 min read
```

Use:

- Small sans-serif
- Muted gray
- Low contrast
- Generous spacing

Metadata should never compete with the article title.

---

# 6. Page Background

The background should not be pure white.

Use:

```css
body {
  background: #F2F2F0;
}
```

A subtle radial illumination can be added:

```css
background:
  radial-gradient(
    circle at 50% -20%,
    rgba(255,255,255,0.92),
    transparent 52%
  ),
  #F2F2F0;
```

Keep the gradient extremely subtle.

The page should still read as a physical warm-white surface.

---

# 7. Main Application Shell

The reference uses a large rounded outer shell rather than allowing content to touch the browser viewport directly.

Recommended:

```css
.app-shell {
  width: calc(100% - 40px);
  max-width: 1600px;
  margin: 16px auto;
  border-radius: 32px;
  overflow: hidden;

  background: rgba(248, 248, 246, 0.86);

  border: 1px solid rgba(255,255,255,0.85);

  box-shadow:
    0 28px 70px rgba(30, 35, 34, 0.10),
    0 8px 24px rgba(30, 35, 34, 0.06);
}
```

The shell should visually sit above the page background.

---

# 8. Header / Navigation

The header is approximately 78–82px tall.

Layout:

```text
[Logo] [Search]              [Home] [Explore] [Dashboard] [Bookmarks] [Write] [Bell] [Avatar]
```

## Header characteristics

- Very light surface
- Thin lower divider
- Horizontal alignment
- Large breathing room
- Minimal icons
- No excessive borders
- Active navigation uses teal

### Logo

The logo should use an editorial serif.

Example:

```css
.logo {
  font-family: var(--font-editorial);
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.04em;
}
```

### Navigation

Inactive:

```css
color: #3F4344;
```

Active:

```css
color: #075E56;
```

Active navigation gets a thin teal underline.

---

# 9. Search Field

The search field is a raised pill-like surface.

```css
.search {
  height: 44px;
  width: 330px;
  border-radius: 24px;

  background: rgba(245,245,243,0.92);

  border: 1px solid rgba(255,255,255,0.85);

  box-shadow:
    inset 0 1px 1px rgba(255,255,255,0.9),
    0 6px 18px rgba(30,35,34,0.07);
}
```

Placeholder:

```text
Search articles, writers, topics
```

Search icon should be muted gray.

---

# 10. Primary Button

The primary CTA is a deep teal pill.

```css
.button-primary {
  background: #075E56;
  color: #FFFFFF;

  border-radius: 999px;

  padding: 13px 24px;

  box-shadow:
    0 7px 18px rgba(7, 94, 86, 0.18),
    inset 0 1px 0 rgba(255,255,255,0.14);
}
```

Hover:

```css
transform: translateY(-1px);

box-shadow:
  0 10px 24px rgba(7, 94, 86, 0.22);
```

Active:

```css
transform: translateY(0);
```

The button should feel slightly physical, not glossy.

---

# 11. Secondary Button

Secondary buttons use the same surface language as the rest of the interface.

```css
.button-secondary {
  background: rgba(250,250,248,0.92);
  color: #242829;

  border: 1px solid rgba(255,255,255,0.95);

  border-radius: 999px;

  box-shadow:
    0 7px 18px rgba(30,35,34,0.08),
    inset 0 1px 0 rgba(255,255,255,0.9);
}
```

The secondary CTA should appear elevated but visually quieter than the primary CTA.

---

# 12. Hero Section

The hero occupies roughly the first 390–420px of the content area.

Recommended layout:

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  HERO TEXT                              HERO OBJECT     │
│                                                         │
│  Keep composing.                                        │
│  Ideas flow, stories build.                             │
│                                                         │
│  Description                                            │
│                                                         │
│  [Start Reading] [Start Writing]                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Use a two-column layout:

```css
.hero {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  align-items: center;
  min-height: 390px;
  padding: 64px 56px 48px;
}
```

---

# 13. Hero Object / Floating Card

The reference uses a physical-looking floating card on the right.

It should feel like a small paper object floating above the interface.

Characteristics:

- White/off-white surface
- Large rounded corners
- Slight rotation
- Very soft shadow
- Deep teal lettermark
- Small serif establishment text
- No hard outline

Example:

```css
.hero-card {
  width: 190px;
  height: 250px;

  border-radius: 24px;

  background: linear-gradient(
    145deg,
    rgba(255,255,255,0.98),
    rgba(242,242,240,0.92)
  );

  border: 1px solid rgba(255,255,255,0.95);

  transform: rotate(5deg);

  box-shadow:
    0 28px 38px rgba(35,38,37,0.14),
    0 10px 16px rgba(35,38,37,0.08),
    inset 0 1px 0 rgba(255,255,255,0.95);
}
```

The card should not look like a generic UI card.

It is a **physical editorial object**.

---

# 14. Depth System

Depth is one of the defining characteristics of this design.

Use multiple subtle shadow layers rather than one dark shadow.

## Shadow 1 — Surface

```css
box-shadow:
  0 4px 12px rgba(30,35,34,0.05);
```

## Shadow 2 — Raised

```css
box-shadow:
  0 8px 24px rgba(30,35,34,0.07),
  0 2px 6px rgba(30,35,34,0.04);
```

## Shadow 3 — Floating

```css
box-shadow:
  0 24px 48px rgba(30,35,34,0.11),
  0 8px 18px rgba(30,35,34,0.07);
```

## Shadow 4 — Hero Object

```css
box-shadow:
  0 30px 48px rgba(30,35,34,0.14),
  0 10px 18px rgba(30,35,34,0.08);
```

### Important

Never use:

```css
box-shadow: 0 0 20px #000;
```

The reference uses **large-radius, low-opacity shadows**.

The shadow should describe the object's relationship to the surface.

---

# 15. Card Material

Cards should feel like slightly raised pieces of paper.

Base:

```css
.card {
  background: rgba(247,247,245,0.82);

  border: 1px solid rgba(255,255,255,0.88);

  box-shadow:
    0 12px 30px rgba(30,35,34,0.06),
    0 2px 8px rgba(30,35,34,0.035);

  backdrop-filter: blur(10px);
}
```

Do not make the backdrop blur visually obvious.

The goal is **soft material depth**, not visible glass.

---

# 16. Trending Section

The trending module is a large rounded elevated container.

```css
.trending {
  margin: 0 56px;
  padding: 28px 34px;

  border-radius: 24px;

  background: rgba(247,247,245,0.82);

  border: 1px solid rgba(255,255,255,0.9);

  box-shadow:
    0 15px 32px rgba(30,35,34,0.07),
    0 3px 8px rgba(30,35,34,0.035);
}
```

---

# 17. Section Label

Every major content section uses a small editorial label.

Structure:

```text
●  TRENDING ON COMPOZE
```

The dot:

```css
width: 7px;
height: 7px;
border-radius: 50%;
background: #075E56;
```

Label:

```css
.section-label {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #262B2C;
}
```

The label is deliberately small.

---

# 18. Trending Grid

Desktop:

```css
.trending-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px 36px;
}
```

Each item contains:

```text
[01]  [Avatar] Writer
      Article title
      Date • Read time
```

The ranking number is oversized but extremely light.

Example:

```css
.rank {
  font-family: var(--font-editorial);
  font-size: 32px;
  color: #C9CBCB;
  text-shadow: 0 3px 7px rgba(30,35,34,0.08);
}
```

The number should visually recede behind the article content.

---

# 19. Article Titles

Article titles use the editorial serif.

```css
.article-title {
  font-family: var(--font-editorial);
  font-size: 15px;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: #171A1B;
}
```

Hover:

```css
.article-title {
  color: #075E56;
}
```

Use a subtle transition rather than an aggressive animation.

---

# 20. Author Metadata

Author information should be compact.

```css
.author {
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 12px;
  font-weight: 500;
  color: #2F3435;
}
```

Avatar:

```css
.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}
```

---

# 21. Featured Story

The featured story is a large content surface beneath trending.

Structure:

```text
┌─────────────────────────────────────────────────────────┐
│ ● FEATURED STORY                       [View all ↗]      │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │                 FEATURED IMAGE                      │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Story title                                             │
│ Description                                             │
└─────────────────────────────────────────────────────────┘
```

Recommended:

```css
.featured {
  margin: 24px 56px;
  padding: 28px 34px 36px;

  border-radius: 24px;

  background: rgba(247,247,245,0.82);

  border: 1px solid rgba(255,255,255,0.9);

  box-shadow:
    0 15px 32px rgba(30,35,34,0.07),
    0 3px 8px rgba(30,35,34,0.035);
}
```

---

# 22. Featured Image

The image should be the visual anchor of the story.

Recommended:

```css
.featured-image {
  width: 100%;
  aspect-ratio: 2.35 / 1;

  object-fit: cover;

  border-radius: 20px;

  box-shadow:
    0 12px 26px rgba(20,30,28,0.10);
}
```

Use a slight dark/teal editorial image treatment when appropriate.

Do not over-saturate the image.

---

# 23. Radius System

The reference uses rounded geometry but avoids overly playful UI.

```css
--radius-sm: 10px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-xl: 32px;
--radius-pill: 999px;
```

Usage:

| Radius | Usage |
|---|---|
| 10px | Inputs, small controls |
| 16px | Small cards |
| 24px | Main content cards |
| 32px | Application shell |
| 999px | Buttons / search |

---

# 24. Spacing System

Use a restrained 4px base scale.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

The interface should favor:

**32 / 48 / 64px**

for major layout spacing.

Whitespace is a primary visual component.

---

# 25. Borders

Borders should be almost invisible.

Preferred:

```css
border: 1px solid rgba(255,255,255,0.82);
```

For separation:

```css
border-color: rgba(30,35,34,0.07);
```

Avoid dark borders.

The distinction between surfaces should primarily come from:

1. Tonal difference
2. Shadow
3. Highlight
4. Spacing

—not outlines.

---

# 26. Highlights / Inner Light

Raised surfaces benefit from a subtle top highlight.

```css
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.92),
  0 12px 30px rgba(30,35,34,0.07);
```

This creates the soft molded appearance visible in the reference.

---

# 27. Hover Motion

Motion should be extremely restrained.

Default:

```css
transition:
  transform 180ms ease,
  box-shadow 180ms ease,
  color 160ms ease;
```

Raised card:

```css
.card:hover {
  transform: translateY(-2px);

  box-shadow:
    0 18px 38px rgba(30,35,34,0.09),
    0 4px 10px rgba(30,35,34,0.04);
}
```

Do not use large rotations or springy animations.

---

# 28. Button Motion

```css
.button:hover {
  transform: translateY(-1px);
}

.button:active {
  transform: translateY(0);
}
```

The interaction should feel like pressing a physical object.

---

# 29. Navigation Motion

Active navigation should use a small teal underline.

```css
.nav-item::after {
  height: 2px;
  background: #075E56;
  transform: scaleX(0);
  transition: transform 180ms ease;
}

.nav-item.active::after {
  transform: scaleX(1);
}
```

Avoid animated background pills for the primary navigation.

The reference is editorial rather than dashboard-like.

---

# 30. Icons

Use a thin, modern icon set.

Recommended:

- Lucide
- Phosphor
- Tabler

Icon characteristics:

- 18–20px
- 1.5–1.8px stroke
- Rounded line caps
- Charcoal or muted gray
- Teal only when active

Icons should support text rather than dominate it.

---

# 31. Image Treatment

Images should feel integrated into the paper-like surface.

Preferred:

```css
img {
  display: block;
  object-fit: cover;
}
```

Avoid:

- Thick frames
- Strong overlays
- Excessive gradients
- Strong shadows directly around every image

Images should usually inherit the card's depth.

---

# 32. Responsive Behavior

## Desktop

At >= 1200px:

- Full navigation
- Search visible
- Two-column hero
- Three-column trending grid
- Large content cards
- 56px horizontal content padding

## Tablet

At 768–1199px:

- Reduce navigation spacing
- Search width decreases
- Hero becomes approximately 55/45
- Trending remains 2 columns
- Content padding 32–40px

## Mobile

At < 768px:

Header:

```text
[Logo]                         [Menu]
```

Hero becomes one column.

Hide or collapse:

- Full search
- Secondary navigation
- Decorative hero card if space is constrained

Trending:

```css
grid-template-columns: 1fr;
```

Content cards use:

```css
margin: 16px;
padding: 20px;
border-radius: 20px;
```

Hero typography:

```css
font-size: 42px;
line-height: 1;
```

Do not simply shrink the desktop layout. Recompose it.

---

# 33. Accessibility

Maintain readable contrast even though the aesthetic is soft.

Important rules:

- Primary text must remain high contrast
- Do not use muted gray for essential information
- Buttons need visible focus states
- Keyboard focus should use a teal outline
- Interactive elements must have minimum comfortable hit areas
- Motion should respect `prefers-reduced-motion`

Example:

```css
:focus-visible {
  outline: 2px solid #075E56;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

# 34. Design Tokens — Copy/Paste

```css
:root {
  /* Colors */
  --background: #F2F2F0;
  --surface: #F7F7F5;
  --surface-raised: #FAFAF8;
  --surface-soft: #ECECEA;

  --text-primary: #101417;
  --text-secondary: #5E6264;
  --text-muted: #85898A;
  --text-faint: #A7AAAB;

  --primary: #075E56;
  --primary-dark: #064C46;
  --primary-soft: #DDEBE8;

  --border: rgba(30,35,34,0.07);
  --border-highlight: rgba(255,255,255,0.88);

  /* Typography */
  --font-editorial: "DM Serif Display", "Cormorant Garamond", Georgia, serif;
  --font-ui: "Inter", "SF Pro Display", system-ui, sans-serif;

  /* Radius */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --radius-pill: 999px;

  /* Shadows */
  --shadow-surface:
    0 4px 12px rgba(30,35,34,0.05);

  --shadow-raised:
    0 8px 24px rgba(30,35,34,0.07),
    0 2px 6px rgba(30,35,34,0.04);

  --shadow-card:
    0 15px 32px rgba(30,35,34,0.07),
    0 3px 8px rgba(30,35,34,0.035);

  --shadow-floating:
    0 24px 48px rgba(30,35,34,0.11),
    0 8px 18px rgba(30,35,34,0.07);

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
}
```

---

# 35. Visual Rules

## Rule 1 — White space is intentional

Do not fill empty space just because it exists.

## Rule 2 — Shadows are soft

Large blur + low opacity.

Never use hard black shadows.

## Rule 3 — Teal is an accent

Use the deep teal sparingly.

## Rule 4 — Serif means editorial

Use serif typography for meaning and hierarchy, not for every label.

## Rule 5 — Sans means interface

Navigation, metadata, buttons, labels, and controls remain clean and neutral.

## Rule 6 — Surfaces should feel physical

Cards should appear to sit above the page, not simply have a border around them.

## Rule 7 — Depth comes from layering

Use:

```text
background
    ↓
application shell
    ↓
content surface
    ↓
raised card
    ↓
floating object
```

Each layer receives progressively stronger but still soft depth.

## Rule 8 — Avoid visual noise

Every element should have a reason to exist.

---

# 36. Overall Visual Recipe

When implementing this design, the final visual balance should approximately feel like:

```text
70% warm whites / soft neutrals
15% charcoal typography
8% muted gray metadata
5% deep teal
2% imagery / decorative color
```

The page should feel **bright, calm, premium, editorial, and tactile**.

The most important details to preserve from the reference are:

1. Large serif typography
2. Warm off-white background
3. Deep teal accent
4. Extremely soft borders
5. Multi-layer low-opacity shadows
6. Rounded elevated content surfaces
7. Generous whitespace
8. Small uppercase section labels
9. Physical floating-card depth
10. Clear contrast between editorial content and UI chrome

---

# 37. Implementation Priority

If reproducing the design from scratch, implement in this order:

### Priority 1
- Background
- Typography
- Application shell
- Header
- Hero hierarchy

### Priority 2
- Surface material
- Shadows
- Trending card
- Featured card
- Primary / secondary buttons

### Priority 3
- Icons
- Avatars
- Metadata
- Hover states
- Micro-interactions

### Priority 4
- Responsive recomposition
- Accessibility
- Reduced-motion support
- Fine shadow / spacing calibration

Do not start by polishing individual icons.

The **typography, spacing, surfaces, and depth system** create most of the visual identity.

---

# 38. One-Sentence Design Definition

> **A warm editorial publishing interface built from soft paper-like surfaces, deep charcoal serif typography, restrained dark teal accents, generous whitespace, and layered low-contrast shadows that create quiet physical depth.**