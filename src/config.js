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
  // Public app URL used to build password-reset links + Steam redirect back.
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  // Public API base URL (used for the Steam OpenID return_to / realm).
  apiUrl: process.env.API_URL || 'http://localhost:3001',
  ownerEmail: (process.env.OWNER_EMAIL || 'shaital121@gmail.com').trim().toLowerCase(),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  // Registration anti-abuse + email verification.
  requireEmailVerification: String(process.env.REQUIRE_EMAIL_VERIFICATION || 'true').toLowerCase() !== 'false',
  emailVerifyTtlHours: Number(process.env.EMAIL_VERIFY_TTL_HOURS || 24),
  registerMaxPerHourPerIp: Number(process.env.REGISTER_MAX_PER_HOUR || 5),
  // Extra disposable email domains to block (comma-separated), added to the built-in list.
  disposableEmailDomains: (process.env.DISPOSABLE_EMAIL_DOMAINS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
  // Skip the DNS/MX deliverability check when set to false (e.g. offline dev).
  checkEmailMx: String(process.env.CHECK_EMAIL_MX || 'true').toLowerCase() !== 'false',
  // On serverless (Vercel) only /tmp is writable, so default uploads there.
  uploadDir: process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp/uploads' : 'uploads'),
  imgbbApiKey: process.env.IMGBB_API_KEY || '',
  steamApiKey: process.env.STEAM_API_KEY || '',
  // Contact form → email. On Hostinger set SMTP_* to your mailbox (e.g.
  // smtp.hostinger.com). Without SMTP configured, messages are still stored in DB.
  contactTo: process.env.CONTACT_TO || 'service@aimkit.net',
  mailFrom: process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@aimkit.net',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
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
  // prosettings.net is reachable (no Cloudflare challenge) and has a full CS2
  // settings table + team logos + per-player photos — used as the default source.
  proSettingsListUrl: process.env.PRO_SETTINGS_LIST_URL || 'https://prosettings.net/lists/cs2/',
  hltvPlayersUrl: process.env.HLTV_PLAYERS_URL || 'https://www.hltv.org/stats/players',
  steamAppId: process.env.STEAM_APPID || '730',
  // Optional Steam Web API key — used to fetch persona name + avatar on Steam login.
  steamWebApiKey: process.env.STEAM_WEB_API_KEY || '',
  cs2VersionUrl:
    process.env.CS2_VERSION_URL ||
    `https://api.steampowered.com/ISteamApps/UpToDateCheck/v1/?appid=${process.env.STEAM_APPID || '730'}&version=1`,
  cs2WatchMinutes: Number(process.env.CS2_WATCH_MINUTES || 30),
};

if (config.jwtSecret === 'dev-insecure-secret-change-me') {
  console.warn('[config] JWT_SECRET is not set — using an insecure development default.');
}
