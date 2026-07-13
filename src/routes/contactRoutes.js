import { Router } from 'express';
import { pool } from '../db.js';
import { asyncHandler, ApiError, EMAIL_RE } from '../util.js';
import { sendContactEmail, smtpConfigured } from '../mailer.js';

export const contactRoutes = Router();

contactRoutes.post(
  '/',
  asyncHandler(async (req, res) => {
    const name = (req.body?.name || '').trim();
    const email = (req.body?.email || '').trim();
    const subject = (req.body?.subject || '').trim().slice(0, 200);
    const message = (req.body?.message || '').trim();

    if (name.length < 2) throw new ApiError(400, 'Please enter your name.');
    if (!EMAIL_RE.test(email)) throw new ApiError(400, 'Please enter a valid email address.');
    if (message.length < 5) throw new ApiError(400, 'Please enter a message.');
    if (message.length > 5000) throw new ApiError(400, 'Message is too long (5000 char limit).');

    let sent = 0;
    try {
      await sendContactEmail({ name, email, subject, message });
      sent = smtpConfigured() ? 1 : 0;
    } catch (err) {
      console.error('[contact] email send failed:', err.message);
    }

    await pool.query('INSERT INTO contact_messages (name, email, subject, message, sent) VALUES (?, ?, ?, ?, ?)', [
      name,
      email,
      subject || null,
      message,
      sent,
    ]);

    res.status(201).json({ ok: true, delivered: Boolean(sent) });
  }),
);
