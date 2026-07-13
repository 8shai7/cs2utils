# AGENTS.md

## Cursor Cloud specific instructions

CS2 Utils is a single static frontend (Vite, vanilla JS ESM). There is no backend, database, tests, or linter configured.

### Services

- **Web app (Vite dev server)** — start with `npm run dev` (see `README.md`). Vite serves on `http://localhost:5173/` by default. There is only this one service.

### Build / run

- Standard commands are in `package.json`: `npm run dev` (dev server), `npm run build` (production build to `dist/`), `npm run preview` (serve the built output). No lint or test scripts exist.
- CI (`.github/workflows/deploy.yml`) only runs `npm ci` + `npm run build` (with `GITHUB_PAGES=true`) to deploy to GitHub Pages.

### Non-obvious notes

- Crosshair share codes handled by the `csgo-sharecode` package are **case-sensitive** (its dictionary distinguishes upper/lower case). Do not upper/lower-case a share code before decoding it, or `decodeCrosshairShareCode` throws `InvalidCrosshairShareCode`.
