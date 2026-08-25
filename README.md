# OTHS AI & Machine Learning Club — website

Live: **https://oths-ai-club.vercel.app**

Single static page. No build step, no dependencies.

## Images to drop in

All optional — each one silently falls back if the file is missing, no broken-image icons.

| File | Falls back to |
|---|---|
| `assets/logo.png` | nothing (logo just disappears) |
| `assets/aarav.jpg` | "AS" initials tile |
| `assets/sharvin.jpg` | "SG" initials tile |
| `assets/robert.jpg` | "RP" initials tile |

Officer photos are cropped square (`object-fit: cover`), so any aspect ratio works.

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
- Meeting: `Wednesdays`, `2:45 PM`, `Room 1661`, `Mrs. Dennison`
