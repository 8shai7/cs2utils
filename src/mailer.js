import nodemailer from 'nodemailer';
import { config } from './config.js';

let transporter = null;

export function smtpConfigured() {
  return Boolean(config.smtp.host && config.smtp.user && config.smtp.pass);
}

function getTransport() {
  if (transporter) return transporter;
  if (smtpConfigured()) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    });
  } else {
    // Dev fallback: doesn't actually send, just returns the composed message.
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
  return transporter;
}

export async function sendPasswordResetEmail({ email, link }) {
  return getTransport().sendMail({
    from: config.mailFrom,
    to: email,
    subject: 'Reset your AimKit password',
    text: `We received a request to reset your AimKit password.\n\nUse this link (valid for 1 hour):\n${link}\n\nIf you didn't request this, you can safely ignore this email.`,
  });
}

export async function sendVerificationEmail({ email, link }) {
  return getTransport().sendMail({
    from: config.mailFrom,
    to: email,
    subject: 'Verify your AimKit email',
    text: `Welcome to AimKit! Please verify your email address to activate your account.\n\nVerify (valid for a limited time):\n${link}\n\nIf you didn't create an AimKit account, you can ignore this email.`,
  });
}

export async function sendContactEmail({ name, email, subject, message }) {
  const info = await getTransport().sendMail({
    from: config.mailFrom,
    to: config.contactTo,
    replyTo: `${name} <${email}>`,
    subject: `[AimKit] ${subject || 'Contact form message'} — from ${name}`,
    text: `From: ${name} <${email}>\nSubject: ${subject || '(none)'}\n\n${message}`,
  });
  return info;
}
