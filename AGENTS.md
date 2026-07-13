# AGENTS.md

## Cursor Cloud specific instructions

AimKit (domain: aimkit.net; formerly "CS2 Utils") is a **full-stack app**. **The repo root IS the Node.js/Express + MySQL backend** (`package.json`, `src/`); the Vite vanilla-JS **frontend lives in `web/`**. There is no automated test suite or linter configured.

### Layout (important — restructured)

- `/` (repo root) = backend: `src/index.js` (entry), `src/routes/`, `package.json` (express, mysql2, …), `.env.example`.
- `web/` = frontend Vite project: `web/index.html`, `web/src/` (`main.js`, `api.js`, `session.js`, …), `web/vite.config.js`, `web/package.json` (vite, csgo-sharecode).
- `public/` (repo root) = the **built frontend, committed**, which the backend serves. Regenerate with `npm run build:web` (builds `web/dist` → copies to `public/`).

### Services

- **Backend API (Node.js/Express)** — `npm run dev` in the **repo root** (`node --watch src/index.js`). Listens on `http://localhost:3001`. Serves `/api` **and** the built frontend from `public/` (or `web/dist`, or `FRONTEND_DIR`). Health check: `GET /api/health`.
- **Frontend (Vite dev server)** — `npm run dev` in **`web/`**. Serves on `http://localhost:5173/` and proxies `/api` + `/uploads` to `http://localhost:3001` (see `web/vite.config.js`; override with `VITE_API_PROXY`). Use this for live frontend dev; the backend's own `public/` is the built copy.
- **MySQL** — required by the backend. In this VM a local MariaDB is used for development; production is Hostinger MySQL.

### Database (MySQL / MariaDB)

- The backend reads DB config from `.env` at the **repo root** (copy from `.env.example`). It **auto-creates its tables on startup** (`src/db.js`), so no manual migration step is needed.
- Local dev in the VM: MariaDB runs on `127.0.0.1:3306` with database `cs2utils`, user `cs2utils`, password `cs2utils_dev_pw`. Put these in a root `.env` (gitignored). MariaDB is not managed by systemd here — start it with `sudo mariadbd --user=mysql` if it isn't already running (check `mysqladmin ping` / port 3306).
- Production (Hostinger): set `DB_HOST=localhost` (the app runs on the same host as MySQL, so no "Remote MySQL" IP whitelisting is needed), plus the real `DB_NAME`/`DB_USER`/`DB_PASSWORD`, and a strong `JWT_SECRET`.
- Remote MySQL from this VM is blocked by Hostinger unless the VM's (ephemeral) IP is whitelisted — don't rely on it; develop against the local DB.

### Accounts / roles

- Auth is JWT-based (token stored in browser `localStorage` under `cs2utils.token`). Roles: `user`, `admin`, `owner`.
- Whoever registers/logs in with `OWNER_EMAIL` (default `shaital121@gmail.com`, set in the root `.env`) is automatically granted the `owner` role (owner implies admin and cannot be demoted).
- Nade submissions and user-added media are `pending` until an admin approves them; only approved content is public.

### Secrets

- Never commit real DB credentials or `JWT_SECRET`. The root `.env` is gitignored; only `.env.example` is tracked. For Cloud Agent runs, put real values in the Secrets panel, not in the repo.

### Build / run

- Backend scripts (root `package.json`): `npm run dev` (watch) / `npm start`; `npm run build:web` builds the frontend (`web/`) and copies it into `public/`.
- Frontend scripts (`web/package.json`): `npm run dev`, `npm run build` (→ `web/dist/`), `npm run preview`.
- **Deploy (single Node app / one folder):** point a Node host at the repo root — startup `src/index.js`, `npm install` — it serves `public/` + `/api` on one origin. The built `public/` is committed so no build step is required on the host.
- CI (`.github/workflows/deploy.yml`) builds the **frontend** (from `web/`) and deploys it to GitHub Pages only; it does not run the backend.
- **Serverless:** `src/index.js` exports `app` + `ready` and only calls `app.listen` when `process.env.VERCEL` is unset. `api/index.js` + `vercel.json` run the same app as a Vercel function (awaits `ready`, skips background schedulers). Local `uploads/` and the schedulers don't persist/run on serverless.

### Commands catalog (wiki auto-sync)

- The Commands tool's catalog is stored in the DB (`commands_catalog`) and served from `GET /api/commands/catalog`. It is seeded from the built-in curated list (`src/commandsSeed.js`) and auto-synced.
- Sync source resolution (`src/commandsSync.js`): `COMMANDS_SOURCE_URL` (a JSON feed) takes priority; otherwise it **scrapes a MediaWiki page** (`COMMANDS_WIKI_API` + `COMMANDS_WIKI_PAGE`, default the Valve Developer wiki) via `action=parse` and parses the cvar tables (`src/scrapeWiki.js`). Curated launch options are always merged in (they aren't on the wiki cvar page).
- Gotcha: the Valve wiki serves an anti-bot proof-of-work challenge to datacenter IPs, so scraping it often fails from cloud hosts; on any failure the existing catalog/seed is kept and the error is recorded in `app_meta.commands_last_error`. Point `COMMANDS_SOURCE_URL`/`COMMANDS_WIKI_*` at a reachable source if needed.
- CS2 update trigger: a watcher polls the CS2 build number via the Steam `ISteamApps/UpToDateCheck` endpoint (no key needed) and forces a catalog re-sync whenever the build changes. Admins can also trigger sync / re-check from the Commands tab.
- Pro settings (`src/proSettings.js`, Pros tab): the default live source is **prosettings.net** (`src/scrapeProSettings.js`, reachable — no Cloudflare challenge), scraped on boot/sync into `pro_settings`; it provides settings, team logos, and per-player photos (`uploads/<slug>.png`, slug taken from the player's `/players/<slug>/` link). HLTV itself is Cloudflare-blocked so it isn't used directly. Override with `PRO_SETTINGS_SOURCE_URL` (JSON feed) or `PRO_SETTINGS_LIST_URL`. A curated seed is the fallback if the scrape fails.
- Browser-assisted import: because bot-protected sources can't be fetched by the server or cross-origin JS, the admin "Sync" buttons open a guided import modal (`web/src/importModal.js`) — the admin completes the site's verification in their own browser, then pastes the page content, which the server parses via `POST /api/admin/commands/import` (wikitext or JSON) and `POST /api/admin/pros/import` (JSON).
- "NEW" flagging: `command_seen` tracks first-seen time per key. Switching the catalog source re-baselines (nothing is flagged); afterward, keys that appear in later syncs from the same source are flagged new for `COMMANDS_NEW_WINDOW_DAYS`.

### Non-obvious notes

- Crosshair share codes handled by the `csgo-sharecode` package are **case-sensitive** (its dictionary distinguishes upper/lower case). Do not upper/lower-case a share code before decoding it, or `decodeCrosshairShareCode` throws `InvalidCrosshairShareCode`.
- The Nades tool's subnav buttons reuse the `.tool-tab` class; the top-level tab handler is scoped to `.tool-nav .tool-tab` so the two don't collide.
- The frontend `web/src/session.js` store is the single source of truth for auth; the header menu (`web/src/headerAuth.js`) and the Nades tool (`web/src/nadesUI.js`) both subscribe to it. Subscribe before doing async loads to avoid missing the initial session-restore event.
