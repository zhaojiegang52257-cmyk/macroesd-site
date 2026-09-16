import fs from 'node:fs';

let pool = null;

export async function initDb() {
  if (process.env.DATABASE_URL) {
    const pg = (await import('pg')).default;
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5
    });
  } else {
    // Local development / demo mode: in-memory Postgres emulation (dev dependency)
    const { newDb } = await import('pg-mem');
    const mem = newDb();
    const adapter = mem.adapters.createPg();
    pool = new adapter.Pool();
    console.log('[db] running in MEMORY mode (pg-mem). Set DATABASE_URL for real Postgres.');
  }
  const schema = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
  for (const stmt of schema.split(';')) {
    const s = stmt.trim();
    if (s.length > 10) await pool.query(s);
  }
}

export async function all(sql, params = []) {
  const r = await pool.query(sql, params);
  return r.rows || [];
}
export async function one(sql, params = []) {
  const r = await pool.query(sql, params);
  return (r.rows && r.rows[0]) || null;
}
export async function run(sql, params = []) {
  const r = await pool.query(sql, params);
  return r.rows || [];
}
