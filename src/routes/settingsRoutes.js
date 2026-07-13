import { Router } from 'express';
import { getSettings } from '../settings.js';
import { asyncHandler } from '../util.js';

export const settingsRoutes = Router();

// Public: the footer donate links.
settingsRoutes.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json(await getSettings());
  }),
);
