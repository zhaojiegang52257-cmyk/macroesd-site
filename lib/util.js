import crypto from 'node:crypto';

export function sha256(text) {
  return crypto.createHash('sha256').update(String(text).toLowerCase().trim()).digest('hex');
}
export function PJ(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'object') return value; // pg jsonb may return objects
  try { return JSON.parse(value); } catch { return fallback; }
}
export function slugify(text) {
  return String(text).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 80);
}
export function leadCode() {
  const d = new Date();
  const ymd = d.getFullYear().toString() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  return 'ME-' + ymd + '-' + crypto.randomBytes(2).toString('hex').toUpperCase();
}
export function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
export function isNonEmpty(v) { return v !== null && v !== undefined && String(v).trim() !== ''; }

export const IMG_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

export function placeholderSvg(label) {
  const text = String(label || 'PRODUCT PHOTO');
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
<rect width="800" height="560" fill="#0e1c30"/>
<rect x="14" y="14" width="772" height="532" fill="none" stroke="#22406b" stroke-width="2" stroke-dasharray="10 8"/>
<rect x="250" y="150" width="300" height="180" rx="8" fill="none" stroke="#2f5b96" stroke-width="3"/>
<line x1="250" y1="210" x2="550" y2="210" stroke="#2f5b96" stroke-width="2"/>
<text x="400" y="392" font-family="Arial,Helvetica,sans-serif" font-size="26" fill="#8fb2dd" text-anchor="middle">${esc}</text>
<text x="400" y="428" font-family="Arial,Helvetica,sans-serif" font-size="16" fill="#55719c" text-anchor="middle">Real photo will be uploaded from Admin - Images</text>
</svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64');
}

export function baseOrigin(req) {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/+$/, '');
  return (req.headers['x-forwarded-proto'] || req.protocol || 'http') + '://' + req.headers.host;
}

// Simple in-memory rate limiter
const buckets = new Map();
export function rateOk(key, limit, windowMs) {
  const now = Date.now();
  const arr = (buckets.get(key) || []).filter(t => now - t < windowMs);
  if (arr.length >= limit) { buckets.set(key, arr); return false; }
  arr.push(now);
  buckets.set(key, arr);
  if (buckets.size > 5000) { // prune
    for (const [k, v] of buckets) { if (!v.length || now - v[v.length - 1] > windowMs) buckets.delete(k); }
  }
  return true;
}

export function normalizePhone(p) {
  return String(p || '').replace(/[^\d]/g, '');
}

export function csvCell(v) {
  const s = String(v === null || v === undefined ? '' : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
