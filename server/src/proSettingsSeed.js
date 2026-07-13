// Curated pro-player settings (community-sourced). Used to seed the DB and as a
// fallback when a live source (HLTV / JSON feed) is unavailable — HLTV itself is
// Cloudflare-protected and blocks datacenter IPs, so it can't be scraped directly
// from most hosts. Values are approximate and can be refreshed via a source feed.

export const PRO_SEED = [
  { player: 's1mple', team: 'Natus Vincere', dpi: 400, sens: 3.09, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'ZywOo', team: 'Vitality', dpi: 400, sens: 2.0, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'NiKo', team: 'Falcons', dpi: 400, sens: 1.85, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'm0NESY', team: 'Falcons', dpi: 400, sens: 1.9, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'donk', team: 'Team Spirit', dpi: 400, sens: 2.0, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'ropz', team: 'Vitality', dpi: 400, sens: 1.9, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'sh1ro', team: 'Team Spirit', dpi: 400, sens: 1.6, zoomSens: 1, hz: 1000, resolution: '1680x1050', aspectRatio: '16:10' },
  { player: 'device', team: 'Astralis', dpi: 400, sens: 1.9, zoomSens: 1, hz: 1000, resolution: '1024x768', aspectRatio: '4:3' },
  { player: 'Twistzz', team: 'FaZe', dpi: 400, sens: 2.2, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'broky', team: 'FaZe', dpi: 400, sens: 2.0, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'rain', team: 'FaZe', dpi: 400, sens: 1.7, zoomSens: 1, hz: 1000, resolution: '1920x1080', aspectRatio: '16:9' },
  { player: 'b1t', team: 'Natus Vincere', dpi: 400, sens: 3.09, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'electroNic', team: 'Team Spirit', dpi: 400, sens: 2.1, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'huNter-', team: 'G2', dpi: 400, sens: 2.0, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'jL', team: 'Natus Vincere', dpi: 400, sens: 2.1, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'Aleksib', team: 'Natus Vincere', dpi: 400, sens: 1.7, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'frozen', team: 'Falcons', dpi: 400, sens: 2.0, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
  { player: 'blameF', team: 'Astralis', dpi: 400, sens: 1.6, zoomSens: 1, hz: 1000, resolution: '1280x960', aspectRatio: '4:3' },
];
