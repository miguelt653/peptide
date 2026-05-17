# Leanova — Image Assets

⚠️ **The site won't show photos until you save files into this folder.** The code references these filenames — when files matching them exist here, they'll appear automatically.

## Required filenames

| Filename | Photo | Where it shows |
|---|---|---|
| `hero-bg.jpg` | Molecule render (dark blue, 3D structure) | Behind hero headline |
| `pen.jpg` | Girl holding the peptide pen close-up | "How It Works" — top image |
| `usage.jpg` | Woman injecting at the abdomen (window/plants in background) | "How It Works" — second image below pen |
| `science-bg.jpg` | Light/transparent molecule render | "Why Us" section background |

## How to add photos (2 minutes)

### Option A — through GitHub web (easiest, no terminal):
1. Save each photo from chat to your computer (right-click → "Save Image As")
2. Rename each to the exact filenames in the table above
3. Go to your repo on GitHub → click into the `assets/` folder
4. Click **"Add file" → "Upload files"**
5. Drag your 3 photos in, click **"Commit changes"**
6. Done — they auto-deploy on Render in ~30 seconds

### Option B — locally with git:
```bash
# After saving + renaming the photos to your assets/ folder:
git add assets/
git commit -m "Add real photos"
git push
```

## Image specs

- **Format**: JPG or WebP
- **Compression**: Run through [tinypng.com](https://tinypng.com) (free, drag & drop)
- **Target size**: under 400KB each so the site stays fast
