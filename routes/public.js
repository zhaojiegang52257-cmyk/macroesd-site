import { all, one, run } from '../db.js';
import { setting, publishedProducts, productBySlug, publishedSolutions, solutionBySlug, publishedCases, caseBySlug, faqsFor, landingBySlug, imagesFor, clearCache } from '../lib/store.js';
import { tr } from '../lib/i18n.js';
import { placeholderSvg, leadCode, rateOk, baseOrigin, PJ } from '../lib/util.js';
import { sendCapiLead } from '../lib/capi.js';

function splitB(b) {
  // stored {en,vi} where each may contain "Title | description"
  const dot = s => { const parts = String(s || '').split('|'); return { title: (parts[0] || '').trim(), desc: (parts[1] || '').trim() }; };
  return { ...dot(b.en), vi_t: dot(b.vi).title, vi_d: dot(b.vi).desc };
}

export function registerPublic(app) {
  // language + common locals for public pages
  const ctx = async (req, res, next) => {
    try {
      const vi = req.path === '/vi' || req.path.startsWith('/vi/');
      res.locals.lang = vi ? 'vi' : 'en';
      res.locals.t = k => tr(res.locals.lang, k);
      res.locals.L = (en, v) => (res.locals.lang === 'vi' && v) ? v : (en || v || '');
      res.locals.site = await setting('site');
      res.locals.tracking = await setting('tracking');
      res.locals.meta = res.locals.meta || { title: 'MacroESD - ESD Packaging Solutions for Electronics Manufacturing', desc: 'Custom ESD corrugated plastic boxes, injection boxes, chairs and mats for PCB/SMT factories.' };
      res.locals.waLink = (msg) => {
        const num = String(res.locals.site.whatsapp || '').replace(/[^\d]/g, '');
        return 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg || res.locals.site.wa_msg_default || 'Hello MacroESD');
      };
      res.locals.placeholder = placeholderSvg;
      res.locals.origin = baseOrigin(req);
      res.locals.curPath = req.path;
      res.locals.altPath = vi ? (req.path.replace(/^\/vi/, '') || '/') : ('/vi' + (req.path === '/' ? '' : req.path));
      res.locals.google = undefined;
      next();
    } catch (e) { next(e); }
  };
  app.use((req, res, next) => {
    if (req.path.startsWith('/admin') || req.path.startsWith('/static') || req.path.startsWith('/api') || req.path.startsWith('/img')) return next();
    ctx(req, res, next);
  });

  const both = (p, handler) => {
    app.get(p, handler);
    app.get(('/vi' + p).replace('//', '/'), handler);
  };

  // ---------- Home ----------
  both('/', async (req, res) => {
    const hp = await setting('homepage');
    const products = await publishedProducts();
    const solutions = await publishedSolutions();
    const cases = (await publishedCases()).slice(0, 3);
    const faqs = (await faqsFor()).slice(0, 6);
    const homeImgs = await imagesFor('home', 'hero');
    res.render('home', {
      hp, products, solutions, cases, faqs, homeImgs,
      why: (hp.why_items || []).map(splitB),
      meta: { title: 'MacroESD - Custom ESD Packaging for PCB & SMT Manufacturing', desc: 'Reusable ESD corrugated plastic boxes with custom sizes and dividers. Factory-direct through specialized partner plants for electronics manufacturers in Vietnam & SEA.' }
    });
  });

  // ---------- Products ----------
  both('/products', async (req, res) => {
    const products = await publishedProducts();
    res.render('products', { products, meta: { title: 'ESD Products for Electronics Manufacturing | MacroESD', desc: 'ESD corrugated plastic boxes, injection molded boxes, chairs, mats and more.' } });
  });
  both('/products/:slug', async (req, res) => {
    const p = await productBySlug(req.params.slug);
    if (!p) return notFound(res);
    const imgs = await imagesFor('product', p.slug);
    const faqs = await faqsFor(p.slug);
    const products = await publishedProducts();
    res.render('product', {
      p, imgs, faqs, products,
      meta: { title: p.seo_title || ((res.locals.lang === 'vi' && p.name_vi) ? p.name_vi : p.name_en) + ' | MacroESD', desc: p.seo_desc || p.short_en }
    });
  });

  // ---------- Solutions ----------
  both('/solutions', async (req, res) => {
    const solutions = await publishedSolutions();
    res.render('solutions', { solutions, meta: { title: 'ESD Packaging Solutions | MacroESD', desc: 'PCB packaging, SMT packaging and electronics manufacturing ESD solutions.' } });
  });
  both('/solutions/:slug', async (req, res) => {
    const s = await solutionBySlug(req.params.slug);
    if (!s) return notFound(res);
    const products = await publishedProducts();
    res.render('solution', {
      s, products, points: (s.points || []).map(splitB),
      meta: { title: s.seo_title || (s.title_en + ' | MacroESD'), desc: s.seo_desc || s.subtitle_en }
    });
  });

  // ---------- Case studies ----------
  both('/case-studies', async (req, res) => {
    const cases = await publishedCases();
    res.render('cases', { cases, meta: { title: 'Case Studies | MacroESD', desc: 'Customer ESD packaging projects.' } });
  });
  both('/case-studies/:slug', async (req, res) => {
    const c = await caseBySlug(req.params.slug);
    if (!c) return notFound(res);
    const imgs = await imagesFor('case', c.slug);
    res.render('case', { c, imgs, meta: { title: c.seo_title || (c.customer_display + ' Case | MacroESD'), desc: c.seo_desc } });
  });

  // ---------- About ----------
  both('/about-us', async (req, res) => {
    const about = await setting('about');
    const imgs = await imagesFor('about', 'factory');
    res.render('about', { about, imgs, meta: { title: 'About MacroESD | ESD Packaging Supplier', desc: 'Who we are, our partner factories, quality control and export capability.' } });
  });

  // ---------- RFQ page ----------
  both('/get-a-quote', async (req, res) => {
    const products = await publishedProducts();
    res.render('quote', { products, meta: { title: 'Get a Quote - ESD Packaging RFQ | MacroESD', desc: 'Send your size, quantity and application for a custom ESD packaging proposal within 1 business day.' } });
  });

  // ---------- Landing pages ----------
  const landingHandler = async (req, res) => {
    const lp = await landingBySlug(req.params.slug);
    if (!lp) return notFound(res);
    const imgs = await imagesFor('landing', lp.slug);
    const faqs = await faqsFor();
    const products = await publishedProducts();
    res.locals.landingMode = true;
    res.render('landing', {
      lp, imgs, faqs, products,
      meta: { title: lp.seo_title || lp.name, desc: lp.seo_desc }
    });
  };
  both('/lp/:slug', landingHandler);

  // ---------- Images ----------
  app.get('/img/:id', async (req, res) => {
    const row = await one('SELECT mime, data FROM images WHERE id = $1 AND status = $2', [parseInt(req.params.id, 10) || 0, 'active']);
    if (!row) return res.status(404).send('not found');
    res.setHeader('Content-Type', row.mime || 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.send(Buffer.from(row.data, 'base64'));
  });

  // ---------- Tracking beacon ----------
  app.post('/api/track', async (req, res) => {
    try {
      const b = req.body || {};
      const okTypes = ['PageView', 'ViewContent', 'WhatsAppClick', 'RFQStart', 'RFQSubmit'];
      if (!okTypes.includes(b.type)) return res.json({ ok: false });
      if (!rateOk('trk:' + (req.ip || 'x'), 300, 3600 * 1000)) return res.json({ ok: true }); // silently drop
      const visitor = String(b.visitor || '').slice(0, 40);
      await run('INSERT INTO lead_events (visitor_id, type, path, product, meta) VALUES ($1,$2,$3,$4,$5)',
        [visitor, b.type, String(b.path || req.originalUrl).slice(0, 300), String(b.product || '').slice(0, 80), JSON.stringify({ ua: (req.headers['user-agent'] || '').slice(0, 200), ref: (req.headers.referer || '').slice(0, 300) })]);
      res.json({ ok: true });
    } catch { res.json({ ok: false }); }
  });

  // ---------- RFQ submit ----------
  app.post('/api/rfq', async (req, res) => {
    try {
      const b = req.body || {};
      if (b.website) return res.json({ ok: true }); // honeypot: pretend success
      if (!rateOk('rfq:' + (req.ip || 'x'), 8, 10 * 60 * 1000)) return res.status(429).json({ ok: false, error: 'too many requests' });
      const need = ['name', 'company', 'country', 'email', 'whatsapp'];
      for (const k of need) {
        if (!String(b[k] || '').trim()) return res.status(400).json({ ok: false, error: 'missing ' + k });
      }
      const loadTs = parseInt(b.load_ts || '0', 10);
      if (!loadTs || Date.now() - loadTs < 2500) return res.status(400).json({ ok: false, error: 'bot check failed' });
      const u = b.utm || {};
      const code = leadCode();
      const visitor = String(b.visitor || '').slice(0, 40);
      const requirements = {
        kind: String(b.kind || '').slice(0, 20),
        length: b.length, width: b.width, height: b.height, thickness: b.thickness,
        divider: b.divider, model: b.model, color: b.color, application: b.application,
        product_text: b.product_text, extra: String(b.extra || '').slice(0, 1500)
      };
      const events = await all('SELECT type, path, product, created_at FROM lead_events WHERE visitor_id = $1 ORDER BY id ASC LIMIT 80', [visitor]);
      const ev = events.map(e => ({ type: e.type, path: e.path, at: e.created_at }));
      const lead = {
        code, name: String(b.name).slice(0, 120), company: String(b.company).slice(0, 160),
        country: String(b.country).slice(0, 80), email: String(b.email).slice(0, 160),
        whatsapp: String(b.whatsapp).slice(0, 40), product: String(b.product || '').slice(0, 120),
        quantity: String(b.quantity || '').slice(0, 60),
        requirements: JSON.stringify(requirements), message: String(b.message || '').slice(0, 3000),
        utm_source: String(u.utm_source || '').slice(0, 80), utm_medium: String(u.utm_medium || '').slice(0, 80),
        utm_campaign: String(u.utm_campaign || '').slice(0, 160), utm_content: String(u.utm_content || '').slice(0, 160),
        utm_term: String(u.utm_term || '').slice(0, 160),
        landing_page: String(b.page || '').slice(0, 300), referrer: String(req.headers.referer || '').slice(0, 300),
        visitor_id: visitor, events: JSON.stringify(ev)
      };
      const cols = Object.keys(lead);
      const inserted = await one(`INSERT INTO leads (${cols.map(c => '"' + c + '"').join(',')}) VALUES (${cols.map((_, i) => '$' + (i + 1)).join(',')}) RETURNING *`, cols.map(c => lead[c]));
      const tracking = await setting('tracking');
      const capiResult = await sendCapiLead(tracking, inserted || lead);
      if (inserted) await run('UPDATE leads SET capi_result = $1 WHERE id = $2', [capiResult, inserted.id]);
      console.log('[rfq] new lead', code, '| capi:', capiResult);
      res.json({ ok: true, code });
    } catch (e) {
      console.error('[rfq] error', e.message);
      res.status(500).json({ ok: false, error: 'server error' });
    }
  });

  // ---------- SEO ----------
  app.get('/robots.txt', async (req, res) => {
    res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ' + baseOrigin(req) + '/sitemap.xml\n');
  });
  app.get('/sitemap.xml', async (req, res) => {
    const origin = baseOrigin(req);
    const statics = ['/', '/products', '/solutions', '/case-studies', '/about-us', '/get-a-quote'];
    const urls = [];
    for (const p of statics) { urls.push(origin + p); if (p !== '/') urls.push(origin + '/vi' + p); }
    const prods = await all("SELECT slug FROM products WHERE status='published'");
    const sols = await all("SELECT slug FROM solutions WHERE status='published'");
    const lps = await all("SELECT slug FROM landing_pages WHERE status='published'");
    for (const r of prods) { urls.push(origin + '/products/' + r.slug, origin + '/vi/products/' + r.slug); }
    for (const r of sols) { urls.push(origin + '/solutions/' + r.slug, origin + '/vi/solutions/' + r.slug); }
    for (const r of lps) { urls.push(origin + '/lp/' + r.slug); }
    res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map(u => '  <url><loc>' + u + '</loc></url>').join('\n') + '\n</urlset>');
  });

  // doc-style root landing URLs (/esd-box-solution) - registered last so real routes win
  both('/:slug', landingHandler);
}

function notFound(res) {
  res.status(404).send('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | MacroESD</title><style>body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#0e1c30;color:#dbe7f7;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}a{color:#ffc629;font-weight:700;text-decoration:none;margin:0 8px}h1{font-size:40px;color:#fff}</style></head><body><div><h1>404</h1><p>This page moved or never existed. Our ESD boxes did not.</p><p style="margin-top:18px"><a href="/">Home</a>·<a href="/products">Products</a>·<a href="/get-a-quote">Get a Quote</a></p></div></body></html>');
}
