import bcrypt from 'bcryptjs';
import { all, one, run } from './db.js';
import { saveSetting } from './lib/store.js';
import { PJ } from './lib/util.js';
import { SITE, TRACKING, HOMEPAGE, ABOUT, CATEGORIES, PRODUCTS, SOLUTIONS, FAQS, LANDING_ESD_BOX } from './lib/defaults.js';

async function count(table) {
  const r = await one(`SELECT COUNT(*) AS c FROM ${table}`);
  return parseInt(r.c, 10);
}
async function insert(table, obj) {
  const keys = Object.keys(obj);
  const cols = keys.map(k => `"${k}"`).join(', ');
  const ph = keys.map((_, i) => '$' + (i + 1)).join(', ');
  await run(`INSERT INTO ${table} (${cols}) VALUES (${ph})`, keys.map(k => {
    const v = obj[k];
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return v;
  }));
}

export async function seed(adminUser, adminPass) {
  // Admin user
  if ((await count('admin_users')) === 0) {
    const hash = bcrypt.hashSync(adminPass, 10);
    await insert('admin_users', { username: adminUser, pass_hash: hash });
    console.log(`[seed] admin user "${adminUser}" created`);
  }
  // Settings
  for (const [key, val] of Object.entries({ site: SITE, tracking: TRACKING, homepage: HOMEPAGE, about: ABOUT })) {
    const row = await one('SELECT key FROM settings WHERE key = $1', [key]);
    if (!row) await saveSetting(key, val);
  }
  // Categories
  if ((await count('categories')) === 0) {
    for (const c of CATEGORIES) await insert('categories', c);
  }
  // Products
  if ((await count('products')) === 0) {
    for (const p of PRODUCTS) await insert('products', p);
  }
  // Solutions
  if ((await count('solutions')) === 0) {
    for (const s of SOLUTIONS) await insert('solutions', s);
  }
  // FAQs
  if ((await count('faqs')) === 0) {
    for (const f of FAQS) await insert('faqs', { ...f, status: 'published' });
  }
  // Landing pages
  if ((await count('landing_pages')) === 0) {
    await insert('landing_pages', LANDING_ESD_BOX);
  }
  console.log('[seed] done');
}
