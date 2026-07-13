import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { config } from '../config.js';
import { requireAuth } from '../auth.js';
import { ApiError } from '../util.js';

const uploadDir = path.resolve(process.cwd(), config.uploadDir);
try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch {
  // Read-only filesystem (e.g. serverless) — uploads to local disk won't persist.
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').slice(0, 10).replace(/[^.\w]/g, '');
    cb(null, `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image uploads are allowed (use a URL for videos).'));
  },
});

export const uploadsRoutes = Router();

uploadsRoutes.post('/', requireAuth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return next(new ApiError(400, err.message));
    if (!req.file) return next(new ApiError(400, 'No file uploaded.'));
    res.status(201).json({ url: `/uploads/${req.file.filename}`, kind: 'image' });
  });
});
