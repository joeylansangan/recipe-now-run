# Recipe Now — Logo, Favicon & Loading Icon Spec

A complete, self-contained spec for recreating the Recipe Now brand marks in a separate repo. All geometry and colors below were measured directly from the shipped asset files, not eyeballed.

---

## 1. The mark

One idea: **a gold sun resting on a navy horizon line**, on warm paper, under a thin azure sky ribbon.

Flat poster geometry — no gradients, no shadows, no glass, no outlines on the sun. Part of a design system named **"The Printed Menu"** (city-pop translated as sunlit print: a warm paper sheet, navy ink, hairline rules and dotted leaders, one vermilion action).

Two motion rules the system enforces:
- The sky appears **once** — a thin azure ribbon at the top edge.
- The sun appears **once** — as a small gold disc on a horizon line.
- At most **one motif visible per screen state**.

---

## 2. Palette

Exact values sampled from the shipped PNGs.

| Token | Hex | Role in the mark |
|---|---|---|
| `paper` | `#faf6ec` | icon background (warm daylight paper) |
| `gold` | `#e9a820` | the sun disc |
| `ink` | `#1b2a47` | the horizon bar (navy, never black) |
| `azure` | `#1a5fb8` | sky ribbon across the top edge |

Supporting system colors — not used in the icon, but part of the brand:

| Token | Hex | Role |
|---|---|---|
| `sheet` | `#fffdf6` | input wells, one step brighter than paper |
| `muted` | `#5e6880` | secondary text (AA on paper) |
| `line` | `#e2dac6` | hairline rules |
| `vermilion` | `#c43d1b` | the one action color |
| `palmleaf` | `#2f6b46` | reserved; almost never used |

---

## 3. App icon geometry

Measured as percentages of canvas so it renders at any size.

Sun and bar are hard-edged. The sun is **not** clipped — it overlaps the bar, and the bar draws on top of it.

### Standard icon
Applies to `icon-512.png`, `icon-192.png`, `apple-icon.png`.

| Element | Spec |
|---|---|
| Background | full-bleed `#faf6ec` |
| Azure ribbon | `#1a5fb8`, top edge, full width, height **5.4%** of canvas — 28px @ 512, 10px @ 192, 9px @ 180 |
| Sun | filled circle `#e9a820`, center **cx 50%, cy 48.3%**, radius **17%** of canvas width — r=87 @ 512, r=32 @ 192, r=30 @ 180 |
| Horizon bar | `#1b2a47`, spans **x 8% → 92%**, centered at **y 65.9%**, thickness **~2%** (10px @ 512, 3px @ 192/180), **rounded caps** (semicircular ends, `stroke-linecap: round`) |

### Maskable icon
`icon-512-maskable.png` — same composition scaled into the safe zone, with two deliberate differences.

| Element | Spec |
|---|---|
| Background | plain `#faf6ec` full bleed |
| Azure ribbon | **omitted** — a platform mask would crop it into a smear |
| Sun | cx **50%**, cy **48.7%**, radius **12.9%** — r=66 @ 512 |
| Horizon bar | x **18.2% → 81.8%**, y center **62%**, thickness 8px @ 512, rounded caps |

All content sits within the ~80% safe circle.

### Alpha
All PNGs are **opaque** — no transparency. The background is painted, not left empty.

---

## 4. File inventory

| File | Size | Format | Purpose |
|---|---|---|---|
| `app/favicon.ico` | 256×256 declared; contains **16×16 + 32×32**, 32-bit | ICO | browser tab |
| `public/apple-icon.png` | 180×180 | PNG, opaque | iOS home screen |
| `public/icon-192.png` | 192×192 | PNG, opaque | PWA / Android |
| `public/icon-512.png` | 512×512 | PNG, opaque | PWA splash & store |
| `public/icon-512-maskable.png` | 512×512 | PNG, opaque | Android adaptive mask |

> **`favicon.ico` caveat:** the shipped file is still the default Next.js starter favicon — it was never regenerated to match the mark. Recreate it fresh from the icon design at 16/32/48.

---

## 5. In-app marks (SVG)

Source: `components/motifs.tsx`. Both share `viewBox="0 0 160 40"`, render at `w-40` (160px), and are `aria-hidden`.

### `HorizonSun` — empty state, sun at rest

```jsx
<svg viewBox="0 0 160 40" aria-hidden="true">
  <circle cx="80" cy="26" r="10" className="fill-gold" />
  <line x1="0" y1="36" x2="160" y2="36" className="stroke-ink/25" strokeWidth="1.5" />
</svg>
```

### `SunriseLoader` — the loading icon

The sun climbs and the horizon masks the rise via a clipPath.

```jsx
<svg viewBox="0 0 160 40" aria-hidden="true">
  <defs>
    <clipPath id="above-horizon">
      <rect x="0" y="0" width="160" height="36" />
    </clipPath>
  </defs>
  <g clipPath="url(#above-horizon)">
    <circle cx="80" cy="26" r="10" className="fill-gold animate-sunup" />
  </g>
  <line x1="0" y1="36" x2="160" y2="36" className="stroke-ink/25" strokeWidth="1.5" />
</svg>
```

Loading animation:

```css
@keyframes sunup {
  0%   { transform: translateY(58%); }
  55%  { transform: translateY(0); }
  100% { transform: translateY(0); }
}

.animate-sunup {
  animation: sunup 2s cubic-bezier(0.33, 1, 0.68, 1) infinite;
}
```

The sun rises over 55% of the cycle then holds — a calm beat, not a spinner. Paired copy in-app is `Writing the recipe…` in `menu-caps`.

Honors `prefers-reduced-motion`, reduced globally:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

### Icon vs. in-app SVG — two intentional differences

1. The horizon line in-app is a **hairline at 25% ink opacity with square ends**, not solid ink with round caps.
2. The sun's radius is proportionally **larger** relative to the line span than in the app icon.

---

## 6. Header lockup

No wordmark image. A 10px gold dot beside tracked-out mono caps (`app/page.tsx`):

```jsx
<span aria-hidden className="h-2.5 w-2.5 rounded-full bg-gold" />
<span className="menu-caps text-ink/70">Recipe Now</span>
```

Where `menu-caps` is:

```css
font-family: var(--font-mono);
text-transform: uppercase;
letter-spacing: 0.18em;
font-size: 0.6875rem;
font-weight: 500;
```

Directly above the header sits the sky ribbon as a live element — the same azure band that appears in the icon:

```jsx
<div aria-hidden className="h-1.5 w-full bg-azure" />
```

---

## 7. Typography & chrome

| Slot | Face | Weights | Role |
|---|---|---|---|
| Display | Instrument Serif | 400, normal + italic | headings — the editorial "printed menu" voice |
| Body / UI | Hanken Grotesk | default | everything read mid-cooking |
| Mono | IBM Plex Mono | 400 / 500 / 600 | labels, amounts, timestamps |

- `theme_color` and `background_color`: **`#faf6ec`** (both manifest and viewport — the chrome reads as the paper sheet itself)
- Corner radii: `--radius-plate: 4px`, `--radius-well: 3px` (near-square, print geometry)
- Focus ring: `2px solid` azure, `outline-offset: 2px` — keyboard only; pointer taps stay quiet

---

## 8. Manifest values

```
name / short_name:              "Recipe Now"
description:                    "Search a dish. Get the recipe and the videos."
start_url:                      "/"
display:                        "standalone"
orientation:                    "portrait"
background_color / theme_color: "#faf6ec"
icons:                          192 (any), 512 (any), 512-maskable (maskable)
```

---

## 9. Notes before recreating

- **`favicon.ico` is unregenerated Next.js boilerplate** and does not match the mark. Build it fresh from the icon design.
- **There is no committed icon-generation script.** The PNGs were produced by hand, so the percentage geometry in §3 is the authoritative source for regenerating them.