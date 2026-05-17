# Leanova — Image Assets

Drop your photos in this folder with these exact filenames:

## 1. `hero-bg.jpg` — Hero Background

The portrait-style photo (person holding pen/syringe) used as a subtle background behind the hero headline.

- **Best photo**: the tall portrait shot of the customer holding the syringe
- **Format**: JPG (or WebP)
- **Dimensions**: minimum 1600×1000px, ideally 2000×1200px
- **Aspect**: any (it will be cropped to fit, focused on upper third)
- The site automatically darkens it with an overlay so the white text stays readable

## 2. `pen.jpg` — "How It Works" Pen Photo

The close-up shot of the peptide pen, shown alongside the 4 ordering steps.

- **Best photo**: the vertical close-up of the pen being held
- **Format**: JPG (or WebP)
- **Dimensions**: minimum 800×1000px (4:5 portrait works best)
- **Aspect**: portrait (vertical) is ideal — landscape will still work

## Compression

Compress all images at [tinypng.com](https://tinypng.com) — aim for under 400KB each. The site loads faster and ranks better.

## Once added

```bash
git add assets/
git commit -m "Add product photos"
git push
```

Until images are added, both spots show a clean fallback (dark navy + subtle gradient on the hero, a 💉 icon on the How section) so the site never looks broken.
