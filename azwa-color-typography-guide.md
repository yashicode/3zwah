# Azwa — Color & Typography Design Spec
**For a caregiver-focused elderly-care website. Primary user = the caregiver; secondary = elderly users & family.**

All contrast ratios below are calculated against the stated pairing and meet **WCAG 2.1 AA** (4.5:1 normal text, 3:1 large text/UI). Where it matters for older eyes, ratios are pushed toward **AAA (7:1)**.

---

## 1. Design goals & user needs

| Audience | What they need | Design implication |
|---|---|---|
| **Caregivers** (often multilingual, on mobile, busy, possibly tired/stressed) | Speed, clarity, low cognitive load, "where do I tap" | Strong action hierarchy, large touch targets, calm neutral base |
| **Elderly users** (reduced contrast sensitivity, lens yellowing, glare sensitivity) | High contrast, large readable type, no glare, no color-only cues | Off-white (not pure white) base, 18px+ text, AAA where possible |
| **Family members** (oversight, reassurance) | Trust, legitimacy, "this is safe" | Stable blue tone, medical-grade calm, professional restraint |

**Core mood targets:** calm, trustworthy, clear, reassuring — *not* clinical/cold, *not* playful/loud.

**Biggest current issue (from your screenshot):** three accent colors compete for "primary" (green logo + blue button + yellow CTAs). Pick one action color. The system below makes **blue the action color**, **green the brand/positive color**, and retires loud yellow as a CTA.

---

## 2. Color palette (with hex, role, and contrast)

### Core palette
| Token | Hex | Contrast | Role |
|---|---|---|---|
| **Trust Blue** (primary) | `#1A5FB4` | 6.29:1 (white text on it) | Primary buttons, links, active states, key icons |
| **Blue Dark** (hover/pressed) | `#144D91` | 8.40:1 | Button hover/pressed, header accents |
| **Care Green** (positive/brand) | `#1C7C54` | 5.17:1 (white text on it) | Success states, positive status, brand/logo |
| **Text Primary** | `#1A1D23` | 16.9:1 on white | Body & headings (softened near-black, not pure #000 → less glare) |
| **Text Secondary** | `#4A4F57` | 8.24:1 on white | Labels, captions, meta text |
| **App Background** | `#F4F6F8` | text reads 15.6:1 | Page background — *low-glare alternative to pure white* |
| **Card Surface** | `#FFFFFF` | — | Cards/panels only, sitting on the off-white app bg |
| **Border (decorative)** | `#D5D9DF` | 1.4:1 | Card edges, dividers |
| **Border (functional)** | `#6B7280` | 4.8:1 | Input fields, anything that must be *perceived* |

### Status palette (use **tint background + dark text + icon**, never color alone)
| State | BG tint | Text/border | Contrast |
|---|---|---|---|
| **Error** | `#FDECEA` | `#B3261E` | 5.7:1 |
| **Warning** | `#FFF4E0` | `#8A5300` | 6.3:1 (vs white) |
| **Success** | `#E7F4EC` | `#1C7C54` | passes AA |
| **Info** | `#E8F0FB` | `#144D91` | passes AA |

> Yellow is the worst color for older eyes (lens yellowing flattens yellow-on-white contrast). Keep it as a *dark amber for warnings only*, never as a button fill or large area.

---

## 3. Accessibility considerations

- **Push beyond the minimum.** Older eyes lose contrast sensitivity. Body text here hits 16.9:1 (AAA), secondary text 8.2:1 (AAA). Don't go below 4.5:1 for any text.
- **Never rely on color alone** (≈8% of men have color vision deficiency, and aging affects blue–yellow perception). Every status = **color + icon + text label**. Error = red + ⚠ + "Error". Success = green + ✓.
- **Color-blind-safe pairings:** blue (action) vs green (positive) carry *different roles*, never the sole differentiator. Avoid red-vs-green being the only signal — add icons/text.
- **Low glare:** page background is `#F4F6F8`, not pure white. White is reserved for cards. Avoid large high-saturation fills. Text is `#1A1D23`, not `#000`.
- **UI component contrast (WCAG 1.4.11):** input borders use `#6B7280` (4.8:1), not the faint `#D5D9DF`. Focus rings must be visible (see below).
- **Touch targets:** minimum **48×48px** (caregivers may be older or in a hurry). Spacing ≥ 8px between targets.
- **RTL:** Arabic requires `dir="rtl"` and a mirrored layout — not just a translated string.

---

## 4. How colors map to tasks & mood

| Goal | Color move | Why (evidence) |
|---|---|---|
| **Trust** | Trust Blue primary | Blue is the dominant healthcare/finance trust color; reads as stable & reliable |
| **Calm** | Off-white base + muted, desaturated tones | Low saturation lowers arousal/anxiety; reduces glare for elderly |
| **Clarity** | One action color, high text contrast | Single blue CTA removes "which do I tap" ambiguity |
| **Readability** | `#1A1D23` on `#F4F6F8`, 18px+ | Near-black on soft white maximizes legibility without glare |
| **Positive/safe** | Care Green for success & brand | Green = health/safety/"go" across cultures |
| **Error signaling** | Red tint + icon + label | Redundant cues survive color blindness and panic |

---

## 5. Quick style guide + pseudo-CSS

```css
:root {
  /* core */
  --color-primary:        #1A5FB4;
  --color-primary-hover:  #144D91;
  --color-positive:       #1C7C54;
  --text-primary:         #1A1D23;
  --text-secondary:       #4A4F57;
  --bg-app:               #F4F6F8;
  --bg-card:              #FFFFFF;
  --border-soft:          #D5D9DF;
  --border-input:         #6B7280;

  /* status */
  --error-bg: #FDECEA;  --error-fg: #B3261E;
  --warn-bg:  #FFF4E0;  --warn-fg:  #8A5300;
  --ok-bg:    #E7F4EC;  --ok-fg:    #1C7C54;
  --info-bg:  #E8F0FB;  --info-fg:  #144D91;

  /* type */
  --font-ui: "Atkinson Hyperlegible", "Inter", system-ui, sans-serif;
  --font-size-body: 1.125rem;   /* 18px min */
  --line-height: 1.6;
  --radius: 12px;
  --touch-min: 48px;
}

body {
  background: var(--bg-app);
  color: var(--text-primary);
  font-family: var(--font-ui);
  font-size: var(--font-size-body);
  line-height: var(--line-height);
}

/* PRIMARY BUTTON — the one action color */
.btn-primary {
  background: var(--color-primary);
  color: #FFFFFF;
  min-height: var(--touch-min);
  padding: 14px 24px;
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
}
.btn-primary:hover { background: var(--color-primary-hover); }

/* SECONDARY BUTTON — outline, lower emphasis (e.g. WhatsApp / Phone) */
.btn-secondary {
  background: var(--bg-card);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  min-height: var(--touch-min);
}

/* VISIBLE FOCUS — required for keyboard & low-vision users */
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* CARD */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius);
  padding: 20px;
}

/* NAV — neutral, current page in primary */
.nav-link { color: var(--text-primary); }
.nav-link[aria-current="page"] {
  color: var(--color-primary);
  border-bottom: 3px solid var(--color-primary);
}

/* INPUT — functional border, never faint */
.input {
  border: 2px solid var(--border-input);
  border-radius: 8px;
  min-height: var(--touch-min);
  font-size: var(--font-size-body);
}

/* ALERT — color + icon + text, never color alone */
.alert-error   { background: var(--error-bg); color: var(--error-fg); border-left: 4px solid var(--error-fg); }
.alert-warning { background: var(--warn-bg);  color: var(--warn-fg);  border-left: 4px solid var(--warn-fg); }
.alert-success { background: var(--ok-bg);    color: var(--ok-fg);    border-left: 4px solid var(--ok-fg); }
```

---

## 6. Fonts (type + color)

**Primary UI font: `Atkinson Hyperlegible`** — free (Google Fonts), designed by the Braille Institute specifically for low-vision readers. It disambiguates lookalike characters (I / l / 1, O / 0), which directly helps older users. Fallback: `Inter` or `Lexend`, then `system-ui`.

**Multilingual stack (you support EN / AR / TL / HI):**
```css
--font-ar: "IBM Plex Sans Arabic", "Noto Sans Arabic", sans-serif; /* + dir="rtl" */
--font-hi: "Noto Sans Devanagari", sans-serif;
/* Tagalog uses Latin — covered by the primary font */
```

**Type rules for this audience:**
- Body **18px (1.125rem) minimum**; ideally 18–20px. Headings scale up from there.
- Line height **1.5–1.6**; never crowd lines.
- Use weights **400 (regular)** and **600 (semibold)** only. **Avoid 300/thin** — it disappears for low-vision users.
- **No ALL-CAPS for body text** (harder to read; fine for short labels).
- Left-align body text (justified text creates uneven gaps that hurt readability).

**Font colors:**
- Body/headings: `#1A1D23` on the off-white/card background.
- Secondary/meta: `#4A4F57` (still AAA).
- Links: `#1A5FB4` **and underlined** — never signal a link by color alone.
- Text on colored buttons: `#FFFFFF`.
- Forbidden: light gray (`#999`/`#AAA`) for any meaningful text on white — it fails contrast.

---

## 7. Real-world usability patterns

1. **High-contrast mode toggle** — a switch that swaps to `#000` text on `#FFF` and thickens borders:
   ```css
   [data-contrast="high"] {
     --text-primary: #000000;
     --bg-app: #FFFFFF;
     --border-input: #000000;
   }
   ```
2. **Large touch targets** — 48×48px minimum, generous spacing (your three contact buttons are good candidates to enlarge).
3. **Text-size control** — a A / A+ / A++ control that scales the root font-size; far friendlier than asking elderly users to pinch-zoom.
4. **Fix the clipped footer line** — *"A human is available at every step."* is currently cut off and overlapping the chat bubble. Give the footer its own block with padding and keep it clear of the floating widget (e.g. `padding-bottom: 80px` on the page, or move the widget). Reassurance text that's half-hidden undercuts the trust you're trying to build.
5. **Reduced motion** — respect `prefers-reduced-motion` for any animation.

---

## 8. Ready-to-paste prompt (for an AI design/coding tool)

> Redesign the styling of a caregiver-focused elderly-care website. Audience: caregivers (primary), elderly users, and family members. Goals: calm, trustworthy, high readability, low glare, clear single-action hierarchy.
>
> **Colors** — Primary action: `#1A5FB4` (hover `#144D91`), white text. Positive/brand/success: `#1C7C54`. Page background: `#F4F6F8` (low-glare off-white, NOT pure white); cards: `#FFFFFF`. Body text `#1A1D23`, secondary text `#4A4F57`. Status colors use tint-bg + dark-text + icon: error `#FDECEA`/`#B3261E`, warning `#FFF4E0`/`#8A5300`, success `#E7F4EC`/`#1C7C54`, info `#E8F0FB`/`#144D91`. Use ONE action color (blue); retire yellow as a CTA — keep yellow only as dark amber for warnings.
>
> **Type** — Font: Atkinson Hyperlegible, fallback Inter/system-ui. Body 18px min, line-height 1.6, weights 400/600 only (no thin). Links are blue AND underlined. No light-gray text on white.
>
> **Accessibility** — All text ≥ 4.5:1 (push body to AAA/7:1+). Never use color alone — pair with icon + label. Touch targets ≥ 48×48px. Visible 3px focus ring. Input borders `#6B7280`. Support RTL for Arabic, plus Noto Sans Arabic/Devanagari fonts. Include a high-contrast toggle and a text-size control.
