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
};

if (config.jwtSecret === 'dev-insecure-secret-change-me') {
  console.warn('[config] JWT_SECRET is not set — using an insecure development default.');
}
