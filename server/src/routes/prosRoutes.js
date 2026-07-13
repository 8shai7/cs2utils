import { Router } from 'express';
import { getPros } from '../proSettings.js';
import { asyncHandler } from '../util.js';

export const prosRoutes = Router();

prosRoutes.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await getPros({ q: (req.query.q || '').trim(), sort: req.query.sort || 'name' }));
  }),
);
