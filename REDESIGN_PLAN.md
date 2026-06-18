# Azwa — Redesign Plan

Rebrand of the caregiver platform from "Sanad" to **Azwa** (Arabic: أزوة — "support / kinship"),
inspired by the layout patterns of community-care sites like lifecare.org.au (image-led hero,
photo service cards, partner strip, clear guided journeys) — original content, not copied.

**Confirmed decisions:** Azwa branding everywhere · keep Next.js 16 + TS + Tailwind ·
mock login → questionnaire → tailored content · **client provides images/logos** (we build slots
with graceful fallbacks).

---

## 1. New information architecture & page titles (no generic labels)

| Route | Page title (EN) | Was | Purpose |
| --- | --- | --- | --- |
| `/` | **Azwa — Care, together** | Home | Animated brand hero, journeys, partners strip, trust |
| `/login` | **Sign in to Azwa** | — (new) | Mock login (any phone/email). Entry to the tailored journey |
| `/welcome` | **Tell us about your care journey** | — (new) | Caregiver questionnaire (intake) |
| `/dashboard` | **My Care Plan** | — (new) | Tailored hub: recommended workshops + support, profile summary |
| `/find-support` | **Find the Right Support** | Services + Assistant | Image service cards **+ AI assistant panel side-by-side** |
| `/workshops` | **Care Skills & Workshops** | Training | Image session cards, register, venue details; shows relevant-first |
| `/partners` | **Our Care Partners** | — (new) | Abu Dhabi clinics/hospitals, finance, wellbeing partners |
| `/contact` | **Talk to Our Team** | Support | Human contact channels + your requests |

Old routes redirect: `/services` & `/assistant` → `/find-support`, `/training` → `/workshops`,
`/support` → `/contact` (configured in `next.config.ts`).

**Nav (top bar):** Azwa(logo) · Workshops · Find Support · Partners · Talk to Our Team ·
[Sign in → becomes "My Care Plan" once logged in] · language switcher.

---

## 2. User journey

```
Landing (/)  →  Sign in (/login)  →  first time? Questionnaire (/welcome)
       →  My Care Plan (/dashboard, tailored)  →  Workshops / Find Support (tailored)
Human help ("Talk to Our Team") reachable from every page.
```

Tailoring: the questionnaire records who the caregiver looks after and their goals; we map those
to service categories and workshop topics so the dashboard, workshops, and support matches show
**relevant items first** and hide clearly-irrelevant ones.

---

## 3. Caregiver questionnaire (intake) — fields

1. **About you** — name, preferred language (en/ar/tl/hi), emirate.
2. **Who you care for** — relationship (parent / spouse / child / other), age band, living with you?
3. **Their needs** (multi-select → drives tailoring): mobility, chronic illness (e.g. diabetes,
   blood pressure), memory/dementia, post-hospital recovery, feeding/nutrition, medical devices,
   end-of-life/palliative.
4. **Your goals** (multi-select): learn care skills, manage my own stress, financial help,
   find respite/a break, book clinical appointments.
5. **Contact preference** — in-app, WhatsApp, phone.

Stored on the in-memory `User` as a `CaregiverProfile`; `onboarded` flag gates the redirect.

---

## 4. Component plan (additions)

| Component | File | Role |
| --- | --- | --- |
| `BrandHero` | `app/_components/BrandHero.tsx` | Animated "Azwa / أزوة" hero, UAE-flag motif (CSS animation) |
| `AppImage` | `app/_components/AppImage.tsx` | `<img>` with graceful gradient fallback when file missing |
| `PartnerStrip` | `app/_components/PartnerStrip.tsx` | Logo marquee/grid of care partners |
| `LoginForm` | `app/login/LoginForm.tsx` | Mock sign-in |
| `Questionnaire` | `app/welcome/Questionnaire.tsx` | Multi-step intake form |
| `ServiceCard` (image) | in `find-support` | Photo + label + book/eligibility/talk |
| `WorkshopCard` (image) | in `workshops` | Photo + venue + register |
| `AssistantPanel` | reuse current assistant, embedded beside services | Needs → matched services / human |
| `PlanSummary` | `app/dashboard` | Tailored recommendations |

Existing kept: `Header`, `Footer`, `LanguageSwitcher`, i18n provider, Groq assistant pipeline,
in-memory store, demo session.

---

## 5. Data model additions (`lib/types.ts`, in-memory)

```ts
type CareRelationship = "parent" | "spouse" | "child" | "other";
type CareNeed = "mobility" | "chronic_illness" | "dementia" | "post_hospital"
              | "nutrition" | "medical_devices" | "palliative";
type CareGoal = "skills" | "self_care" | "financial" | "respite" | "appointments";

interface CaregiverProfile {
  careRelationship: CareRelationship;
  recipientAgeBand: string;          // "60-69", "70-79", "80+", ...
  livesWithCaregiver: boolean;
  needs: CareNeed[];
  goals: CareGoal[];
  onboarded: boolean;
}
// User gains: profile?: CaregiverProfile

interface Partner {
  id: string;
  name: LocalizedText;
  category: "hospital" | "clinic" | "finance" | "wellbeing" | "government";
  blurb: LocalizedText;
  logo: string;                      // /images/partners/<id>.png  (client provides)
}
```

Tailoring maps (in `lib/tailoring.ts`): `CareNeed`/`CareGoal` → service categories + workshop topics.

---

## 6. 📁 IMAGE / LOGO SPEC — where to drop your files

All assets go under **`caregiver-platform/public/images/`**. Until a file exists, a tasteful
gradient placeholder with the item's name shows automatically (nothing looks broken).

```
public/images/
├── brand/
│   └── flag-motif.svg        (optional; hero also works without it)
├── services/                 ## one image per service (≈1200×800, .jpg or .webp)
│   ├── svc-counseling.jpg
│   ├── svc-home-nursing.jpg
│   ├── svc-clinic.jpg
│   ├── svc-financial-aid.jpg
│   └── svc-respite.jpg
├── workshops/                ## one image per training session
│   ├── trn-oxygen.jpg
│   ├── trn-glucometer.jpg
│   ├── trn-burnout.jpg
│   ├── trn-selfcare.jpg
│   ├── trn-finance.jpg
│   └── trn-mobility.jpg
└── partners/                 ## logos (≈400×200, transparent .png)
    ├── partner-seha.png
    ├── partner-cca.png
    ├── partner-burjeel.png
    ├── partner-adib.png
    └── partner-wellbeing.png
```

Filenames map 1:1 to the `id` of each service/training/partner in `lib/data/seed.ts`. Add a new
item there and its image path follows the same `/images/<folder>/<id>.<ext>` pattern.

---

## 7. Milestones (MVP first)

- **Stage 1 — Brand & journey skeleton:** rebrand to Azwa, animated hero, new nav/titles,
  mock login, questionnaire, dashboard, data model, `AppImage` fallback. *(MVP的 backbone)*
- **Stage 2 — Find Support + Partners:** image service cards beside the AI panel (tailored),
  partner strip + partners page.
- **Stage 3 — Care Workshops:** image session cards, register, venue details, relevant-first.
- **Stage 4 — Polish:** RTL pass for new pages, reduced-motion for the hero animation, copy review.

Each stage is type-checked (`tsc`) and run-tested before moving on.
