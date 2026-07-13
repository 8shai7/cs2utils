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

Push to [`8shai7/cs2utils`](https://github.com/8shai7/cs2utils) and enable GitHub Pages under **Settings → Pages → GitHub Actions**.

## License

MIT
