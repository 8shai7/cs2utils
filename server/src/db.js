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
];

export async function initDb() {
  const conn = await pool.getConnection();
  try {
    for (const stmt of SCHEMA) {
      await conn.query(stmt);
    }
  } finally {
    conn.release();
  }
}
