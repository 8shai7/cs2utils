import mysql from 'mysql2/promise';
import { config } from './config.js';

export const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4_unicode_ci',
});

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user','admin','owner') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS nades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    map VARCHAR(40) NOT NULL,
    type VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL DEFAULT 't',
    technique VARCHAR(20) NOT NULL DEFAULT 'stand',
    title VARCHAR(160) NOT NULL,
    description TEXT NULL,
    start_x FLOAT NOT NULL,
    start_y FLOAT NOT NULL,
    end_x FLOAT NOT NULL,
    end_y FLOAT NOT NULL,
    status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    reviewed_by VARCHAR(80) NULL,
    review_note VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status_map (status, map),
    INDEX idx_author (author_id),
    CONSTRAINT fk_nade_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS nade_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nade_id INT NOT NULL,
    kind VARCHAR(10) NOT NULL DEFAULT 'image',
    url TEXT NOT NULL,
    added_by INT NULL,
    added_by_name VARCHAR(80) NULL,
    status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nade (nade_id),
    CONSTRAINT fk_media_nade FOREIGN KEY (nade_id) REFERENCES nades(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS command_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    command_key VARCHAR(64) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_cmd_user (command_key, user_id),
    CONSTRAINT fk_rec_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS command_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    command_key VARCHAR(64) NOT NULL,
    user_id INT NOT NULL,
    username VARCHAR(80) NOT NULL,
    body VARCHAR(1000) NOT NULL,
    status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_key_status (command_key, status),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS commands_catalog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    command_key VARCHAR(64) NOT NULL UNIQUE,
    category VARCHAR(40) NOT NULL,
    type VARCHAR(12) NOT NULL DEFAULT 'console',
    command VARCHAR(300) NOT NULL,
    title VARCHAR(160) NOT NULL,
    description VARCHAR(600) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    source VARCHAR(16) NOT NULL DEFAULT 'seed',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS app_meta (
    k VARCHAR(64) PRIMARY KEY,
    v TEXT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS command_seen (
    command_key VARCHAR(64) PRIMARY KEY,
    first_seen BIGINT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(160) NOT NULL,
    description VARCHAR(1000) NULL,
    config_text MEDIUMTEXT NULL,
    video_text MEDIUMTEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_author (author_id),
    INDEX idx_created (created_at),
    CONSTRAINT fk_config_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS config_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_config_user (config_id, user_id),
    CONSTRAINT fk_rating_config FOREIGN KEY (config_id) REFERENCES configs(id) ON DELETE CASCADE,
    CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS highlights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(160) NOT NULL,
    description VARCHAR(1000) NULL,
    url TEXT NOT NULL,
    kind VARCHAR(10) NOT NULL DEFAULT 'video',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_author (author_id),
    INDEX idx_created (created_at),
    CONSTRAINT fk_highlight_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS highlight_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    highlight_id INT NOT NULL,
    reporter_id INT NOT NULL,
    reporter_name VARCHAR(80) NOT NULL,
    reason VARCHAR(500) NULL,
    status ENUM('open','reviewed') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_highlight_reporter (highlight_id, reporter_id),
    INDEX idx_status (status),
    CONSTRAINT fk_report_highlight FOREIGN KEY (highlight_id) REFERENCES highlights(id) ON DELETE CASCADE,
    CONSTRAINT fk_report_user FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NULL,
    message TEXT NOT NULL,
    sent TINYINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS pro_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pkey VARCHAR(64) NOT NULL UNIQUE,
    player VARCHAR(80) NOT NULL,
    team VARCHAR(80) NULL,
    dpi INT NULL,
    sens FLOAT NULL,
    edpi INT NULL,
    zoom_sens FLOAT NULL,
    hz INT NULL,
    resolution VARCHAR(20) NULL,
    aspect_ratio VARCHAR(12) NULL,
    viewmodel_fov FLOAT NULL,
    crosshair_code VARCHAR(64) NULL,
    photo VARCHAR(500) NULL,
    team_logo VARCHAR(500) NULL,
    source VARCHAR(16) NOT NULL DEFAULT 'seed',
    sort_order INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

// Idempotent column migrations for tables that already exist.
const MIGRATIONS = [
  'ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_until DATETIME NULL',
  'ALTER TABLE pro_settings ADD COLUMN IF NOT EXISTS photo VARCHAR(500) NULL',
  'ALTER TABLE pro_settings ADD COLUMN IF NOT EXISTS team_logo VARCHAR(500) NULL',
];

export async function initDb() {
  const conn = await pool.getConnection();
  try {
    for (const stmt of SCHEMA) {
      await conn.query(stmt);
    }
    for (const stmt of MIGRATIONS) {
      try {
        await conn.query(stmt);
      } catch (err) {
        console.warn('[db] migration skipped:', err.message);
      }
    }
  } finally {
    conn.release();
  }
}
