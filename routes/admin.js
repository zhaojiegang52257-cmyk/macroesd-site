import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { all, one, run } from '../db.js';
import { setting, saveSetting, clearCache } from '../lib/store.js';
import { COLLECTIONS, SETTING_PAGES, formToValues, valueToForm } from '../lib/fields.js';
import { PJ, rateOk, csvCell } from '../lib/util.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const ALLOWED_MIME = { 'image/jpeg': 1, 'image/png': 1, 'image/webp': 1, 'image/gif': 1 };
const LEAD_STATUS = ['New', 'Contacted', 'Qualified', 'RFQ', 'Quoted', 'Sample', 'Won', 'Lost'];

function esc(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

export function registerAdmin(app) {
  app.use('/admin', (req, res, next) => {
    res.locals.layout = 'admin';
    res.locals.csrf = ensureCsrf(req);
    res.locals.admUser = (req.session && req.session.user) || '';
    next();
  });

  const auth = (req, res, next) => {
    if (req.session && req.session.uid) return next();
    if (req.path.startsWith('/login')) return next();
    res.redirect('/admin/login');
  };
  const csrfGuard = (req, res, next) => {
    if (req.method !== 'POST') return next();
    if (req.path === '/login') return next();
    if (!req.session || req.body._csrf !== req.session.csrf) return res.status(403).send('CSRF check failed - please go back and retry.');
    next();
  };

  // ---- login / logout ----
  app.get('/admin/login', (req, res) => res.render('admin/login', { error: '', layout: 'adminblank' }));
  app.post('/admin/login', async (req, res) => {
    if (!rateOk('login:' + (req.ip || 'x'), 10, 15 * 60 * 1000)) return res.render('admin/login', { error: 'Too many attempts, wait 15 minutes.', layout: 'adminblank' });
    const { username, password } = req.body || {};
    const user = await one('SELECT * FROM admin_users WHERE username = $1', [String(username || '').trim().toLowerCase()]);
    if (user && bcrypt.compareSync(String(password || ''), user.pass_hash)) {
      req.session.uid = user.id;
      req.session.user = user.username;
      return res.redirect('/admin');
    }
    res.render('admin/login', { error: 'Wrong username or password.', layout: 'adminblank' });
  });
  app.get('/admin/logout', (req, res) => { req.session = null; res.redirect('/admin/login'); });

  // ---- dashboard ----
  app.get('/admin', auth, async (req, res) => {
    const dayAgo = new Date(Date.now() - 3600 * 1000 * 24 * 6);
    const rows = await all('SELECT * FROM leads ORDER BY id DESC LIMIT 10');
    const count = async sql => { try { const r = await one(sql[0], sql[1]); return parseInt(r.c, 10); } catch { return 0; } };
    const today = await one("SELECT COUNT(*) AS c FROM leads WHERE created_at >= $1", [startOfDay()]);
    const week = await one("SELECT COUNT(*) AS c FROM leads WHERE created_at >= $1", [dayAgo]);
    const total = await one('SELECT COUNT(*) AS c FROM leads');
    const stats = {
      today: parseInt(today?.c || 0, 10),
      thisWeek: parseInt(week?.c || 0, 10),
      total: parseInt(total?.c || 0, 10)
    };
    const group = async (col) => all(`SELECT ${col} AS k, COUNT(*) AS c FROM leads WHERE ${col} != '' GROUP BY ${col} ORDER BY COUNT(*) DESC LIMIT 8`, []);
    const [byStatus, byProduct, byCountry, bySource, byCampaign] = [
      await group('status'), await group('product'), await group('country'), await group('utm_source'), await group('utm_campaign')
    ];
    res.render('admin/dashboard', { stats, rows, byStatus, byProduct, byCountry, bySource, byCampaign, leadStatuses: LEAD_STATUS });
  });

  // ---- generic collections ----
  const guard = [auth, csrfGuard];
  app.get('/admin/:c', auth, async (req, res, next) => {
    const spec = COLLECTIONS[req.params.c];
    if (!spec) return next();
    const rows = await all(`SELECT * FROM ${spec.table} ORDER BY sort_order ASC, id DESC`);
    res.render('admin/list', { spec, rows, title: spec.label, c: req.params.c, saved: !!req.query.saved });
  });
  app.get('/admin/:c/new', auth, async (req, res, next) => {
    const spec = COLLECTIONS[req.params.c];
    if (!spec) return next();
    const fields = await spec.fields();
    res.render('admin/edit', { spec, fields, row: null, values: {}, title: 'New ' + spec.label.toLowerCase(), c: req.params.c, saved: false, leadStatuses: LEAD_STATUS });
  });
  app.get('/admin/:c/:id', auth, async (req, res, next) => {
    const spec = COLLECTIONS[req.params.c];
    if (!spec) return next();
    const row = await one(`SELECT * FROM ${spec.table} WHERE id = $1`, [parseInt(req.params.id, 10) || 0]);
    if (!row) return res.redirect('/admin/' + req.params.c);
    const fields = await spec.fields();
    res.render('admin/edit', { spec, fields, row, values: valueToForm({ fields }, row), title: row[spec.nameKey] || 'Edit', c: req.params.c, saved: false, leadStatuses: LEAD_STATUS });
  });
  app.post('/admin/:c/save', ...guard, async (req, res, next) => {
    const spec = COLLECTIONS[req.params.c];
    if (!spec) return next();
    const fields = await spec.fields();
    const values = await formToValues({ fields, slugKey: spec.slugKey, nameKey: spec.nameKey }, req.body);
    const id = parseInt(req.body.id || '0', 10);
    try {
      if (id) {
        const sets = Object.keys(values).map((k, i) => `"${k}" = $${i + 1}`).join(', ');
        await run(`UPDATE ${spec.table} SET ${sets} WHERE id = $${Object.keys(values).length + 1}`, [...Object.values(values), id]);
      } else {
        const keys = Object.keys(values);
        const inserted = await one(`INSERT INTO ${spec.table} (${keys.map(k => '"' + k + '"').join(',')}) VALUES (${keys.map((_, i) => '$' + (i + 1)).join(',')}) RETURNING id`, Object.values(values));
        if (!inserted) throw new Error('insert failed');
      }
      clearCache();
      res.redirect('/admin/' + req.params.c + '?saved=1');
    } catch (e) {
      console.error('[admin save]', e.message);
      res.status(500).send('Save failed: ' + esc(e.message));
    }
  });
  app.post('/admin/:c/:id/archive', ...guard, async (req, res, next) => {
    const spec = COLLECTIONS[req.params.c];
    if (!spec) return next();
    await run(`UPDATE ${spec.table} SET status = CASE WHEN status = 'archived' THEN 'draft' ELSE 'archived' END WHERE id = $1`, [parseInt(req.params.id, 10)]);
    clearCache();
    res.redirect('/admin/' + req.params.c);
  });

  // ---- settings pages ----
  for (const key of Object.keys(SETTING_PAGES)) {
    app.get('/admin/page/' + key, auth, async (req, res) => {
      const spec = SETTING_PAGES[key];
      const stored = await setting(key);
      res.render('admin/edit', { spec: { label: spec.label, slugKey: null }, fields: spec.fields, row: null, values: valueToForm({ fields: spec.fields }, stored), title: spec.label, settingsKey: key, leadStatuses: LEAD_STATUS });
    });
    app.post('/admin/page/' + key, ...guard, async (req, res) => {
      const spec = SETTING_PAGES[key];
      const values = await formToValues({ fields: spec.fields }, req.body);
      await saveSetting(key, values);
      res.redirect('/admin/page/' + key + '?saved=1');
    });
  }

  // ---- images ----
  app.get('/admin/images', auth, async (req, res) => {
    const rows = await all('SELECT owner_type, owner_key, COUNT(*) AS c FROM images GROUP BY owner_type, owner_key ORDER BY owner_type, owner_key');
    res.render('admin/images_index', { rows });
  });
  app.get('/admin/images/:type/:key', auth, async (req, res) => {
    const rows = await all('SELECT id, alt, sort_order, mime FROM images WHERE owner_type=$1 AND owner_key=$2 ORDER BY sort_order ASC, id ASC', [req.params.type, req.params.key]);
    res.render('admin/images', { type: req.params.type, key: req.params.key, rows, saved: !!req.query.uploaded });
  });
  app.post('/admin/images/:type/:key/upload', auth, upload.array('files', 10), csrfGuard, async (req, res) => {
    const { type, key } = req.params;
    for (const f of req.files || []) {
      if (!ALLOWED_MIME[f.mimetype]) continue;
      await run('INSERT INTO images (owner_type, owner_key, mime, data, alt, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
        [type, key, f.mimetype, f.buffer.toString('base64'), (req.body.alt || type + ' ' + key), (req.body.sort_order ? parseInt(req.body.sort_order, 10) || 0 : 0)]);
    }
    clearCache();
    res.redirect('/admin/images/' + type + '/' + key + '?uploaded=1');
  });
  app.post('/admin/images/item/:id/delete', ...guard, async (req, res, next) => {
    const back = String(req.body.back || '/admin/images');
    await run('DELETE FROM images WHERE id = $1', [parseInt(req.params.id, 10) || 0]);
    clearCache();
    res.redirect(back.startsWith('/admin') ? back : '/admin/images');
  });

  // ---- leads ----
  app.get('/admin/leads', auth, async (req, res) => {
    const q = String(req.query.q || '').trim();
    const st = LEAD_STATUS.includes(req.query.status) ? req.query.status : '';
    let sql = 'SELECT * FROM leads';
    const where = [], params = [];
    if (st) { where.push(`status = $${params.length + 1}`); params.push(st); }
    if (q) {
      where.push(`(LOWER(name) LIKE LOWER($${params.length + 1}) OR LOWER(company) LIKE LOWER($${params.length + 2}) OR LOWER(email) LIKE LOWER($${params.length + 3}) OR LOWER(code) LIKE LOWER($${params.length + 4}))`);
      const like = '%' + q + '%'; params.push(like, like, like, like);
    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY id DESC LIMIT 300';
    const rows = await all(sql, params);
    res.render('admin/leads', { rows, q, st, leadStatuses: LEAD_STATUS });
  });
  app.get('/admin/leads/export.csv', auth, async (req, res) => {
    const rows = await all('SELECT * FROM leads ORDER BY id DESC');
    const head = ['Code', 'Created', 'Status', 'Name', 'Company', 'Country', 'Email', 'WhatsApp', 'Product', 'Quantity', 'Requirements', 'Message', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'Landing', 'Referrer', 'CAPI'];
    const lines = [head.join(',')];
    for (const l of rows) {
      const req2 = PJ(l.requirements, {});
      lines.push([l.code, l.created_at, l.status, l.name, l.company, l.country, l.email, l.whatsapp, l.product, l.quantity,
      `L:${req2.length || ''} W:${req2.width || ''} H:${req2.height || ''} T:${req2.thickness || ''} Div:${req2.divider || ''} Model:${req2.model || ''} App:${req2.application || ''} Extra:${req2.extra || ''}`,
      l.message, l.utm_source, l.utm_medium, l.utm_campaign, l.utm_content, l.landing_page, l.referrer, l.capi_result].map(csvCell).join(','));
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="macroesd-leads.csv"');
    res.send('' + lines.join('\n'));
  });
  app.get('/admin/leads/:id', auth, async (req, res) => {
    const lead = await one('SELECT * FROM leads WHERE id = $1', [parseInt(req.params.id, 10) || 0]);
    if (!lead) return res.redirect('/admin/leads');
    const ev = await all('SELECT * FROM lead_events WHERE visitor_id = $1 ORDER BY id ASC', [lead.visitor_id || '']);
    res.render('admin/lead', { lead, req2: PJ(lead.requirements, {}), ev, saved: !!req.query.saved, leadStatuses: LEAD_STATUS });
  });
  app.post('/admin/leads/:id', ...guard, async (req, res) => {
    const id = parseInt(req.params.id, 10) || 0;
    const status = LEAD_STATUS.includes(req.body.status) ? req.body.status : 'New';
    await run('UPDATE leads SET status = $1, notes = $2 WHERE id = $3', [status, String(req.body.notes || '').slice(0, 4000), id]);
    res.redirect('/admin/leads/' + id + '?saved=1');
  });

  // ---- password ----
  app.get('/admin/password', auth, (req, res) => res.render('admin/password', { error: '', changed: !!req.query.changed }));
  app.post('/admin/password', ...guard, async (req, res) => {
    const user = await one('SELECT * FROM admin_users WHERE id = $1', [req.session.uid]);
    if (!user || !bcrypt.compareSync(String(req.body.old || ''), user.pass_hash)) return res.render('admin/password', { error: 'Current password is wrong.' });
    const np = String(req.body.newp || '');
    if (np.length < 8) return res.render('admin/password', { error: 'New password must be at least 8 characters.' });
    await run('UPDATE admin_users SET pass_hash = $1 WHERE id = $2', [bcrypt.hashSync(np, 10), user.id]);
    res.redirect('/admin/password?changed=1');
  });
}

function ensureCsrf(req) {
  if (!req.session.csrf) req.session.csrf = crypto.randomBytes(16).toString('hex');
  return req.session.csrf;
}
function startOfDay() {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d;
}
