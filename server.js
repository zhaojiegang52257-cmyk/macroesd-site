import express from 'express';
import layouts from 'express-ejs-layouts';
import cookieSession from 'cookie-session';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb } from './db.js';
import { seed } from './seed.js';
import { registerPublic } from './routes/public.js';
import { registerAdmin } from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));
app.use(express.urlencoded({ extended: true, limit: '8mb' }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieSession({
  name: 'mesd_sid',
  keys: [process.env.SESSION_SECRET || 'macroesd-dev-secret-change-me'],
  maxAge: 7 * 24 * 3600 * 1000,
  httpOnly: true,
  sameSite: 'lax'
}));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(layouts);
app.locals.appName = 'MacroESD';

registerAdmin(app);
registerPublic(app);

app.use((req, res) => {
  res.status(404).send('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | MacroESD</title><style>body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#0e1c30;color:#dbe7f7;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}a{color:#ffc629;font-weight:700;text-decoration:none;margin:0 8px}h1{font-size:40px;color:#fff}</style></head><body><div><h1>404</h1><p>Page not found.</p><p style="margin-top:18px"><a href="/">Home</a>·<a href="/products">Products</a>·<a href="/get-a-quote">Get a Quote</a></p></div></body></html>');
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

process.on('unhandledRejection', (e) => { console.error('[unhandled]', e && e.message || e); });
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[error]', req.method, req.originalUrl, err.message);
  if (!res.headersSent) res.status(500).send('Internal error - the team has been notified.');
});

const adminUser = process.env.ADMIN_USER || 'admin';
const adminPass = process.env.ADMIN_PASSWORD || 'MacroESD#2026';

try {
  await initDb();
  await seed(adminUser, adminPass);
} catch (e) {
  console.error('[boot] database init failed:', e.message);
  process.exit(1);
}
app.listen(PORT, HOST, () => console.log(`MacroESD site listening on http://${HOST}:${PORT}`));
