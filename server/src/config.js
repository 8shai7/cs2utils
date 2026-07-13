import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3001),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'cs2utils',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cs2utils',
  },
  jwtSecret: process.env.JWT_SECRET || 'dev-insecure-secret-change-me',
  ownerEmail: (process.env.OWNER_EMAIL || 'shaital121@gmail.com').trim().toLowerCase(),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  // Optional remote JSON feed override. If set, it takes priority over wiki scraping.
  commandsSourceUrl: process.env.COMMANDS_SOURCE_URL || '',
  commandsSyncTtlHours: Number(process.env.COMMANDS_SYNC_TTL_HOURS || 24),
  // CS2 wiki to scrape the command catalog from (MediaWiki action=parse API).
  // Defaults to the Valve Developer Community wiki. Some hosts serve an anti-bot
  // challenge; when the scrape fails the curated seed is kept as a fallback.
  commandsWikiApi: process.env.COMMANDS_WIKI_API || 'https://developer.valvesoftware.com/w/api.php',
  commandsWikiPage: process.env.COMMANDS_WIKI_PAGE || 'List of Counter-Strike 2 console command variables',
  wikiUserAgent: process.env.WIKI_USER_AGENT || 'AimKitBot/1.0 (+https://aimkit.net; command catalog sync)',
  // How long a scraped command stays flagged "new" for users (days).
  commandsNewWindowDays: Number(process.env.COMMANDS_NEW_WINDOW_DAYS || 21),
  // CS2 update detection: poll the current build number and re-sync the command
  // catalog whenever CS2 ships a patch.
  // Optional JSON feed of pro-player settings (e.g. HLTV-derived). Empty = use
  // the curated seed. HLTV itself is Cloudflare-protected and usually blocks
  // datacenter IPs, so direct scraping falls back to the seed.
  proSettingsSourceUrl: process.env.PRO_SETTINGS_SOURCE_URL || '',
  hltvPlayersUrl: process.env.HLTV_PLAYERS_URL || 'https://www.hltv.org/stats/players',
  steamAppId: process.env.STEAM_APPID || '730',
  cs2VersionUrl:
    process.env.CS2_VERSION_URL ||
    `https://api.steampowered.com/ISteamApps/UpToDateCheck/v1/?appid=${process.env.STEAM_APPID || '730'}&version=1`,
  cs2WatchMinutes: Number(process.env.CS2_WATCH_MINUTES || 30),
};

if (config.jwtSecret === 'dev-insecure-secret-change-me') {
  console.warn('[config] JWT_SECRET is not set — using an insecure development default.');
}
