# CS2 Toolkit

Crosshair share code conversion and FPS sensitivity matching for Counter-Strike 2 players.

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
- **Custom m_yaw** — optional CS2 `m_yaw` override for advanced users

## Quick start

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

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

## Publish to GitHub

This project is its own git repository. To push it to a new GitHub repo:

1. Create an empty repository named `cs2-crosshair-converter` on GitHub (no README or `.gitignore`).
2. From this folder, run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/cs2-crosshair-converter.git
git push -u origin main
```

3. Enable GitHub Pages: **Settings → Pages → Build and deployment → GitHub Actions**.

## License

MIT
