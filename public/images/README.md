# Image & logo drop-zone

Put your photos/logos here. Until a file exists, the site shows a tidy gradient
tile with the item's name — nothing looks broken. Filenames must match the item
`id` in `lib/data/seed.ts`.

```
images/
├── services/        one per service  (~1200×800, .jpg/.webp)
│   ├── svc-counseling.jpg
│   ├── svc-home-nursing.jpg
│   ├── svc-clinic.jpg
│   ├── svc-financial-aid.jpg
│   └── svc-respite.jpg
├── workshops/       one per session  (~1200×800)
│   ├── trn-oxygen.jpg
│   ├── trn-glucometer.jpg
│   ├── trn-burnout.jpg
│   ├── trn-selfcare.jpg
│   ├── trn-finance.jpg
│   └── trn-mobility.jpg
└── partners/        logos (~400×200; transparent .png preferred)
    ├── partner-maan.png
    ├── partner-fdf.png
    ├── partner-fca.png
    ├── partner-adphc.png
    ├── partner-doh.png
    ├── partner-ehs.png
    ├── partner-bayti.png
    ├── partner-malaak.jpg          # JPEG (white background, not transparent)
    ├── partner-ach.jpg             # JPEG
    ├── partner-amana.jpg           # JPEG
    ├── partner-burjeel-homecare.png
    ├── partner-sukoon.jpg          # JPEG
    ├── partner-daman.png
    └── partner-homestaff.jpg       # JPEG
```

The filename (and extension) must match the `logo` path of each partner in
`lib/data/seed.ts`. The 5 `.jpg` logos above came in as JPEG, so their paths in
`seed.ts` end in `.jpg`. To make them blend into the cards, replace them with
transparent **.png** files and switch their `logo:` path back to `.png`.

Add a new item in `seed.ts` → its image path follows the same
`/images/<folder>/<id>.<ext>` pattern automatically.
