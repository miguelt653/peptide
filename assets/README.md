# Leanova — Image Assets

Drop your photos in this folder with these exact filenames:

## 1. `hero-bg.jpg` — Hero Background

Sits behind the headline at the very top of the page. Auto-darkened so white text stays readable.

- **Best photo**: the woman in dark coat holding the vials with black gloves
- **Format**: JPG (or WebP)
- **Dimensions**: minimum 1600×1000px
- **Crops to**: landscape, focuses on upper third
- **File size**: under 400KB after compression

## 2. `science-bg.jpg` — "Why Us" Section Background

Sits behind the four feature cards. Heavily darkened with a navy overlay so cards stay legible.

- **Best photo**: the dark molecule render (3D balls/structures on dark blue)
- **Format**: JPG (or WebP)
- **Dimensions**: minimum 1600×900px
- **File size**: under 400KB after compression

## 3. `pen.jpg` — "How It Works" Featured Image

Shown alongside the 4 ordering steps. Caption overlay reads "What You'll Receive — Pre-filled, Ready to Use".

- **Best photo**: the light/transparent molecule render (works for now), or a real pen/vial photo when you have one
- **Format**: JPG (or WebP)
- **Dimensions**: minimum 800×1000px (portrait works best)
- **File size**: under 400KB after compression

## Compression workflow

1. Save each photo from chat
2. Run through [tinypng.com](https://tinypng.com) (free, drag & drop, no signup)
3. Rename to the exact filenames above
4. Drop into this folder

## Once added

```bash
git add assets/
git commit -m "Add real photos"
git push
```

Until images are added, every spot shows a clean fallback (navy gradient + emoji), so the page never looks broken.
