import { all, one, run } from '../db.js';
import { PJ } from './util.js';

const cache = new Map();
const TTL = 15000;

async function cached(key, loader) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.v;
  const v = await loader();
  cache.set(key, { t: Date.now(), v });
  return v;
}
export function clearCache() { cache.clear(); }

export async function setting(key) {
  return cached('set:' + key, async () => {
    const row = await one('SELECT value FROM settings WHERE key = $1', [key]);
    return PJ(row && row.value, {});
  });
}
export async function saveSetting(key, obj) {
  clearCache();
  const exists = await one('SELECT key FROM settings WHERE key = $1', [key]);
  if (exists) await run('UPDATE settings SET value = $1, updated_at = now() WHERE key = $2', [JSON.stringify(obj), key]);
  else await run('INSERT INTO settings (key, value) VALUES ($1, $2)', [key, JSON.stringify(obj)]);
}

export async function publishedProducts() {
  return cached('products', async () => {
    const rows = await all("SELECT * FROM products WHERE status = 'published' ORDER BY sort_order ASC, id ASC");
    return rows.map(parseProduct);
  });
}
export async function productBySlug(slug) {
  const rows = await cached('products', async () => {
    const r = await all("SELECT * FROM products WHERE status = 'published' ORDER BY sort_order ASC, id ASC");
    return r.map(parseProduct);
  });
  return rows.find(p => p.slug === slug) || null;
}
export function parseProduct(r) {
  return {
    ...r,
    benefits: PJ(r.benefits, []), features: PJ(r.features, []), specs: PJ(r.specs, []),
    applications: PJ(r.applications, []), use_cases: PJ(r.use_cases, [])
  };
}
export async function publishedSolutions() {
  return cached('solutions', async () => {
    const rows = await all("SELECT * FROM solutions WHERE status = 'published' ORDER BY sort_order ASC, id ASC");
    return rows.map(r => ({ ...r, points: PJ(r.points, []) }));
  });
}
export async function solutionBySlug(slug) {
  const rows = await publishedSolutions();
  return rows.find(s => s.slug === slug) || null;
}
export async function publishedCases() {
  return cached('cases', async () => {
    const rows = await all("SELECT * FROM case_studies WHERE status = 'published' ORDER BY sort_order ASC, id DESC");
    return rows.map(r => ({ ...r, products: PJ(r.products, []) }));
  });
}
export async function caseBySlug(slug) {
  const rows = await publishedCases();
  return rows.find(c => c.slug === slug) || null;
}
export async function faqsFor(productSlug) {
  return cached('faqs:' + (productSlug || 'all'), async () => {
    const rows = await all("SELECT * FROM faqs WHERE status = 'published' ORDER BY sort_order ASC, id ASC");
    if (!productSlug) return rows;
    return rows.filter(f => !f.product_slug || f.product_slug === productSlug || f.category === 'general');
  });
}
export async function landingBySlug(slug) {
  const row = await one("SELECT * FROM landing_pages WHERE slug = $1 AND status = 'published'", [slug]);
  return row ? { ...row, blocks: PJ(row.blocks, []) } : null;
}
export async function landings() {
  return all('SELECT * FROM landing_pages ORDER BY id ASC');
}
export async function imagesFor(ownerType, ownerKey) {
  return cached('imgs:' + ownerType + ':' + ownerKey, async () =>
    all("SELECT id, alt, sort_order FROM images WHERE owner_type = $1 AND owner_key = $2 AND status = 'active' ORDER BY sort_order ASC, id ASC", [ownerType, ownerKey])
  );
}
export async function allCategories() {
  return cached('cats', async () => all("SELECT * FROM categories WHERE status = 'active' ORDER BY sort_order ASC"));
}
