export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n) || 0));
}
export { clamp01 };
