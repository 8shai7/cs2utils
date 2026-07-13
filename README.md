# AimKit

[aimkit.net](https://aimkit.net) — Counter-Strike 2 utilities: crosshair share-code conversion, FPS sensitivity matching, a PSA sensitivity finder, and a community nades database with accounts and admin moderation.

## Features

### Crosshair
- **Code → Commands** — paste a `CSGO-xxxxx-...` share code and get every `cl_crosshair_*` cvar
- **Commands → Code** — paste console commands and generate a shareable import code
- **Live preview** — approximate crosshair rendering as you edit
- **Copy helpers** — one-click copy for commands, share codes, and `cl_crosshair_sharecode` import lines

### Sensitivity
- **Game-to-game conversion** — CS2, Valorant, Apex, Overwatch 2, R6, Fortnite, CoD, and more
- **cm/360 matching** — keeps the same physical mouse distance for a full turn
- **DPI changes** — convert when switching mouse DPI between games
- **Custom yaw** — supply a custom `m_yaw`/yaw for CS2 or any game not in the presets

### PSA calculator
- **Perfect Sensitivity Approximation** — a guided 7-round A/B test to converge on your ideal sensitivity

### Nades DB (accounts + backend)
- **Community line-ups** — browse grenade throws with a 2D throw visualizer, videos, and photos
- **Submit your own** — registered users add nades (map + throw/landing points + media)
- **Admin moderation** — submissions and media are reviewed before going public; roles are `user`/`admin`/`owner`

## Project layout

- **Repo root** — the Node.js/Express + MySQL **backend** (`src/`, `package.json`). It also serves the built frontend from `public/`.
- **`web/`** — the Vite **frontend** (`web/src/`, `web/index.html`, `web/package.json`).
- **`public/`** — the built frontend (committed), served by the backend.

## Quick start

Backend API (repo root — serves `/api` and the built frontend):

```bash
npm install
cp .env.example .env   # then fill in your MySQL details
npm run dev            # http://localhost:3001  (node --watch)
```

Frontend dev server (live reload, in `web/`):

```bash
cd web
npm install
npm run dev            # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to the backend, and the API auto-creates its MySQL tables on first start.

## Build

```bash
npm run build:web      # builds web/ and copies it into public/ (served by the backend)
```

Or build the frontend on its own: `cd web && npm run build` (output in `web/dist/`).

## Usage in CS2

1. Enable the developer console: **Settings → Game → Enable Developer Console**
2. Import via console:
   ```txt
   cl_crosshair_sharecode "CSGO-Your-Code-Here"
   ```
3. Or use **Settings → Game → Crosshair → Share or Import** and paste the code.

## Tech

- [Vite](https://vitejs.dev/)
- [csgo-sharecode](https://www.npmjs.com/package/csgo-sharecode) for encoding/decoding CS:GO/CS2 share codes

## Deploy

The crosshair converter/editor and the sensitivity/PSA tools are pure frontend and
work on any static host. **Everything else (accounts, Nades DB, Commands, Configs,
Highlights, Pro settings, Contact) needs the Node API**, so those pages will show
`/api/... 404` on a static-only deploy (e.g. GitHub Pages).

### Full deploy — the repo root is the app (recommended, e.g. Hostinger)

The repo **root is the Node app**, and the built frontend is committed at
`public/`, so the repo is deploy-ready — point a Node host straight at it. It
serves the SPA and `/api` from the same origin (no proxy, no CORS, no
`VITE_API_URL`).

Create a **Node.js application** (Hostinger: hPanel → Advanced → *Setup Node.js
App*) and connect this GitHub repo (branch `main`):

- **Application root:** `/` (the repo root)
- **Startup file:** `src/index.js`  (or run `npm start`)
- **Install command:** `npm install`
- Add `.env` (copy from `.env.example`, fill in DB creds, a strong `JWT_SECRET`,
  SMTP, etc.). On one origin you can leave `CORS_ORIGIN` default and skip
  `VITE_API_URL`.

Then point the app at your domain — `https://your-domain/api/health` should
return `{"ok":true}`.

When you change the frontend, run `npm run build:web` from the repo root and
commit the refreshed `public/` (its filenames are content-hashed, so old assets
are replaced).

### API on Vercel + frontend on Hostinger

The repo is ready to run the API as a Vercel serverless function (`api/index.js`
+ `vercel.json`) while the static frontend is hosted on Hostinger.

1. **API on Vercel:** import this GitHub repo into Vercel (it uses `vercel.json`).
   Add Environment Variables in the Vercel project:
   - `DB_HOST` = your Hostinger MySQL host (e.g. `srv1700.hstgr.io`), `DB_PORT`,
     `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_SECRET` (strong), `OWNER_EMAIL`
   - `CORS_ORIGIN=https://aimkit.net,https://www.aimkit.net`
   - `APP_URL=https://aimkit.net`, `API_URL=https://<project>.vercel.app`
   - optional: `IMGBB_API_KEY`, `STEAM_API_KEY`, `SMTP_*`
2. **Hostinger → Remote MySQL:** allow remote connections for the DB user
   (Vercel IPs are dynamic, so add `%` / any host). Mind `max_connections`.
3. **Frontend on Hostinger:** build pointing at the Vercel API and upload
   `web/dist/` to `public_html`:
   ```bash
   cd web && VITE_API_URL=https://<project>.vercel.app/api npm run build
   ```

Serverless caveats: local `uploads/` don't persist on Vercel (avatars use ImgBB,
but locally-stored pro photos/uploads won't survive), and the background
schedulers don't run — trigger command/pro syncs from the admin UI instead.

### Static frontend + API on a subdomain (keep your static host)

If the main domain stays a static site (e.g. `public_html` on Hostinger), host the
API separately and point the frontend at it:

1. **API:** create a Node.js app for a subdomain like `api.aimkit.net`, root `/`,
   startup file `src/index.js`, and set its `.env` (including
   `CORS_ORIGIN=https://aimkit.net,https://www.aimkit.net`,
   `APP_URL=https://aimkit.net`, `API_URL=https://api.aimkit.net`).
2. **Frontend:** build it pointing at that API, then upload `web/dist/` to the
   static host:
   ```bash
   cd web && VITE_API_URL=https://api.aimkit.net/api npm run build
   ```
   All `/api` and `/uploads` requests then go to `api.aimkit.net` (CORS allows the
   main domain). Rebuild + re-upload `web/dist/` whenever the frontend changes.

> Symptom of a missing backend: the site loads but every `GET /api/...` returns
> 404. Fix it by serving the API (single-server deploy above) or by pointing the
> build at an API host with `VITE_API_URL`.

### Static frontend only (GitHub Pages)

Push to [`8shai7/cs2utils`](https://github.com/8shai7/cs2utils) and enable GitHub
Pages under **Settings → Pages → GitHub Actions**. Backend-dependent features
won't work unless you also host the API and set `VITE_API_URL` at build time.

## License

MIT
