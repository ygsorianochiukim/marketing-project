# Auto-Hiring Poster — n8n Setup

Generate Renaissance Park & Chapels hiring posters from this repo (replacing
Placid) and post them to Facebook via n8n.

## How it works

The route `GET /auto_hiring/image` renders an A4 PNG poster (794×1123) from
URL query params. **The route URL _is_ the image URL** — Facebook's `/photos`
edge fetches it directly, so there's no separate "create image → host →
download" step that Placid required.

Browser preview of the same design: `GET /auto_hiring` (HTML).

### Query params

| Param | Meaning | Example |
|---|---|---|
| `template` | `admin` \| `field` \| `ck` \| `cover` (default `admin`) | `admin` |
| `position` | Job title | `Sales Associate` |
| `qualification` | "What we are looking for" | `HS graduate` |
| `work_about` | "What is the work about" | `Assist clients` |
| `starting` | Starting pay (already formatted) | `13,500 / month` |
| `regular` | Regular pay (already formatted) | `17,300 / month` |
| `company_name` / `company_address` / `company_phone` | Footer overrides (optional) | |
| `qr` | URL of a QR image to embed (optional) | |

`cover` ignores the job fields (it's the generic "We're Hiring" splash).

Example:
```
https://YOUR-APP.vercel.app/auto_hiring/image?template=admin&position=Sales%20Associate&qualification=HS%20grad&work_about=Assist%20clients&starting=13,500%20/%20month&regular=17,300%20/%20month
```

## 1. Deploy (so Facebook can reach it)

Facebook's servers must fetch the URL over the public internet — localhost
won't work. Deploy to Vercel:

```bash
npm i -g vercel
vercel          # link the project
vercel --prod   # → https://<app>.vercel.app
```

Sanity check in a browser (should download a PNG):
`https://<app>.vercel.app/auto_hiring/image?template=cover`

> The per-template backgrounds are force-bundled into the serverless function
> via `outputFileTracingIncludes` in `next.config.ts` — don't remove that or
> the route will 500 on Vercel.

## 2. Import the n8n workflow

1. In n8n: **Import from File** → `n8n-auto-hiring-workflow.json`.
2. Open the **Settings** node and set `base_url` to your Vercel URL
   (e.g. `https://<app>.vercel.app`). This is the only place the URL lives —
   every poster URL is built from it.
3. Reconnect credentials if n8n doesn't auto-match them (Google service
   account + the Facebook Graph credential).
4. Verify the branch wiring matches your intent:
   - `Check Location` → CK/Admin (via `If1`) vs Field
   - `Check for daily/mo` → monthly vs daily pay formatting
   (The original Placid export had these render branches unwired; they're now
   connected by intent from the node names.)

Pipeline: Schedule → Sheets (Position/Salary/Qualification) → filter →
branch → **Set node builds image URL** → FB `/photos` (`published=false`) →
Code (collects `media_fbid`) → FB `/feed` (multi-photo post + caption).

## 3. Match the real designs (optional)

The four templates currently share one background and differ by a location
label + accent color (Admin gold, Field green, CK red). To use the real
Placid artwork, drop these files in `public/` — the route picks them up
automatically, no code change:

- `public/bg-hiring-admin.png`
- `public/bg-hiring-field.png`
- `public/bg-hiring-ck.png`
- `public/bg-hiring-cover.png`

If a file is missing, the route falls back to `public/bg-hiring-small.png`
(and the browser preview falls back to `public/bg-hiring.png`).
