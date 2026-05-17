# Leanova — Image Assets

Drop your lifestyle/product photos in this folder with these exact filenames:

- `lifestyle-1.jpg` — Tall hero image (left, 1.2fr width)
- `lifestyle-2.jpg` — Standard image (middle)
- `lifestyle-3.jpg` — Standard image (right)

## Image specs

- **Format**: JPG or WebP (smaller file size = faster site)
- **Dimensions**: at least 1200px on the longest side
- **Aspect ratios**:
  - `lifestyle-1.jpg`: portrait/tall (3:4 or 2:3)
  - `lifestyle-2.jpg` / `lifestyle-3.jpg`: any (gets cropped to fit)
- **File size**: under 400KB each if possible (use tinypng.com to compress)

## Once added

After dropping the files in this folder, commit and push — they'll show up automatically. No code changes needed.

```bash
git add assets/
git commit -m "Add lifestyle photos"
git push
```

Until images are added, the slots show a clean dark placeholder with a camera icon — so the page never looks broken if files are missing.
