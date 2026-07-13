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

## Quick start

Frontend (repo root):

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

Backend API (`server/`, needed for the Nades DB + accounts):

```bash
cd server
cp .env.example .env   # then fill in your MySQL details
npm install
npm run dev            # http://localhost:3001
```

The Vite dev server proxies `/api` and `/uploads` to the backend, and the API auto-creates its MySQL tables on first start.

## Build

```bash
npm run build
npm run preview
```

Static files are written to `dist/` and can be deployed to GitHub Pages, Netlify, Vercel, or any static host.

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

### Full deploy — one folder (recommended, e.g. Hostinger)

Build the frontend **into the server**, then deploy just the `server/` folder as a
Node app. It serves the SPA and `/api` from the same origin, so there's no proxy,
no CORS, and no `VITE_API_URL` to set.

```bash
# from the repo root
npm install
npm run build:server   # builds dist/ and copies it to server/public/
```

Upload the `server/` folder (it now contains `public/`) to your Node host and
configure the app:

- **Application root:** `server`
- **Startup file:** `src/index.js`  (or run `npm start`)
- **Install command:** `npm install`
- Add `server/.env` (copy from `server/.env.example`, fill in DB creds, a strong
  `JWT_SECRET`, SMTP, etc.). With everything on one origin you can leave
  `CORS_ORIGIN` default and skip `VITE_API_URL`.

The server serves the frontend from `server/public` (or `../dist`, or
`FRONTEND_DIR` if set). Rebuild with `npm run build:server` and re-upload
`server/public` whenever the frontend changes.

#### Deploy straight from GitHub (no build step on the host)

The built frontend is committed at **`server/public`**, so the repo is
deploy-ready — point a host at it and just install + start the backend:

1. Create a **Node.js application** (Hostinger: hPanel → Advanced → *Setup
   Node.js App*) and connect this GitHub repo (branch `main`).
2. **Application root:** `server` · **Startup file:** `src/index.js`
3. Run **npm install**, add `.env` (DB creds, a strong `JWT_SECRET`, SMTP…),
   then **Start/Restart**.
4. Point the app at your domain. It serves the site **and** `/api` from one
   origin — `https://your-domain/api/health` should return `{"ok":true}`.

When you change the frontend, run `npm run build:server` and commit the updated
`server/public` (its filenames are content-hashed, so old assets are replaced).

### Static frontend + API on a subdomain (keep your static host)

If the main domain stays a static site (e.g. `public_html` on Hostinger), host the
API separately and point the frontend at it:

1. **API:** create a Node.js app (hPanel → Advanced → Node.js) for a subdomain
   like `api.aimkit.net`, startup file `server/src/index.js`, and set its `.env`
   (including `CORS_ORIGIN=https://aimkit.net,https://www.aimkit.net`,
   `APP_URL=https://aimkit.net`, `API_URL=https://api.aimkit.net`).
2. **Frontend:** build it pointing at that API, then upload `dist/` to the static
   host:
   ```bash
   VITE_API_URL=https://api.aimkit.net/api npm run build
   ```
   All `/api` and `/uploads` requests then go to `api.aimkit.net` (CORS allows the
   main domain). Rebuild + re-upload `dist/` whenever the frontend changes.

> Symptom of a missing backend: the site loads but every `GET /api/...` returns
> 404. Fix it by serving the API (single-server deploy above) or by pointing the
> build at an API host with `VITE_API_URL`.

### Static frontend only (GitHub Pages)

Push to [`8shai7/cs2utils`](https://github.com/8shai7/cs2utils) and enable GitHub
Pages under **Settings → Pages → GitHub Actions**. Backend-dependent features
won't work unless you also host the API and set `VITE_API_URL` at build time.

## License

MIT
