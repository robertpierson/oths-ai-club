# OTHS AI & Machine Learning Club — website

Live: **https://oths-ai-club.vercel.app**

Single static page. No build step, no dependencies.

## Images to drop in

All optional — each one falls back silently, no broken-image icons.

| File | If missing |
|---|---|
| `assets/logo.png` | logo disappears (already in the repo) |
| `assets/aarav.jpg` | officer photo frame collapses |
| `assets/sharvin.jpg` | officer photo frame collapses |
| `assets/robert.jpg` | officer photo frame collapses |
| `assets/meeting-1.jpg` … `meeting-4.jpg` | the whole gallery band removes itself |

Any of `.jpg` / `.jpeg` / `.png` / `.webp` works — the fallback chain tries each.

Officer photos are cropped square. Gallery frames are **4:3**, which matches a
stock phone photo (1024×768, 4032×3024), so nothing gets cropped off.

QR codes in `assets/qr-*.svg` are generated at build time, not fetched at runtime:

```bash
pip install segno
python -c "import segno; segno.make('https://discord.gg/fugFYcFbeN', error='h').save('assets/qr-discord.svg', scale=8, border=2, dark='#080d1a', light='#ffffff')"
```

## Local preview

```bash
python -m http.server 5173
```

## Deploy (Vercel)

Already deployed as the `oths-ai-club` project. To ship a change:

```bash
npx vercel --prod
```

The project is **not** yet linked to GitHub, so pushing to `main` does not redeploy on its own.
To get auto-deploy on push: Vercel dashboard → project → Settings → Git → connect
`robertpierson/oths-ai-club`.

## Things to swap later

Everything below is hardcoded in `index.html` — search for the value to change it.

- Interest form: `forms.gle/xnXgh782r7dLQAtBA` (6 places — nav, hero, join step 1, join CTA,
  sign-up section, footer)
- Dues: `$20` / `$15` / `$30`
- Meeting: `Wednesdays`, `2:45-3:15 PM`, `Room 1661`, `Mrs. Dennison`
