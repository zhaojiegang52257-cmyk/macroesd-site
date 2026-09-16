-- MacroESD site schema (PostgreSQL compatible, idempotent)
CREATE TABLE IF NOT EXISTS admin_users (
  id serial PRIMARY KEY,
  username text UNIQUE NOT NULL,
  pass_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name_en text DEFAULT '',
  name_vi text DEFAULT '',
  sort_order int DEFAULT 0,
  status text DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  category_slug text DEFAULT '',
  is_core boolean DEFAULT false,
  show_divider boolean DEFAULT false,
  rfq_kind text DEFAULT 'other',
  name_en text DEFAULT '',
  name_vi text DEFAULT '',
  short_en text DEFAULT '',
  short_vi text DEFAULT '',
  intro_en text DEFAULT '',
  intro_vi text DEFAULT '',
  benefits text DEFAULT '[]',
  features text DEFAULT '[]',
  specs text DEFAULT '[]',
  applications text DEFAULT '[]',
  use_cases text DEFAULT '[]',
  seo_title text DEFAULT '',
  seo_desc text DEFAULT '',
  status text DEFAULT 'draft',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS images (
  id serial PRIMARY KEY,
  owner_type text NOT NULL,
  owner_key text NOT NULL,
  mime text DEFAULT 'image/webp',
  data text NOT NULL,
  alt text DEFAULT '',
  sort_order int DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS solutions (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title_en text DEFAULT '',
  title_vi text DEFAULT '',
  subtitle_en text DEFAULT '',
  intro_en text DEFAULT '',
  intro_vi text DEFAULT '',
  points text DEFAULT '[]',
  seo_title text DEFAULT '',
  seo_desc text DEFAULT '',
  status text DEFAULT 'draft',
  sort_order int DEFAULT 0
);
CREATE TABLE IF NOT EXISTS case_studies (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  industry text DEFAULT '',
  country text DEFAULT '',
  customer_display text DEFAULT '',
  anonymous boolean DEFAULT true,
  challenge_en text DEFAULT '',
  requirement_en text DEFAULT '',
  solution_en text DEFAULT '',
  result_en text DEFAULT '',
  products text DEFAULT '[]',
  seo_title text DEFAULT '',
  seo_desc text DEFAULT '',
  status text DEFAULT 'draft',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS faqs (
  id serial PRIMARY KEY,
  q_en text DEFAULT '',
  a_en text DEFAULT '',
  q_vi text DEFAULT '',
  a_vi text DEFAULT '',
  category text DEFAULT 'general',
  product_slug text DEFAULT '',
  sort_order int DEFAULT 0,
  status text DEFAULT 'published'
);
CREATE TABLE IF NOT EXISTS landing_pages (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text DEFAULT '',
  blocks text DEFAULT '[]',
  seo_title text DEFAULT '',
  seo_desc text DEFAULT '',
  status text DEFAULT 'draft',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS leads (
  id serial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  name text DEFAULT '',
  company text DEFAULT '',
  country text DEFAULT '',
  email text DEFAULT '',
  whatsapp text DEFAULT '',
  product text DEFAULT '',
  quantity text DEFAULT '',
  requirements text DEFAULT '{}',
  message text DEFAULT '',
  utm_source text DEFAULT '',
  utm_medium text DEFAULT '',
  utm_campaign text DEFAULT '',
  utm_content text DEFAULT '',
  utm_term text DEFAULT '',
  landing_page text DEFAULT '',
  referrer text DEFAULT '',
  visitor_id text DEFAULT '',
  status text DEFAULT 'New',
  notes text DEFAULT '',
  capi_result text DEFAULT '',
  events text DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS lead_events (
  id serial PRIMARY KEY,
  visitor_id text DEFAULT '',
  type text DEFAULT '',
  path text DEFAULT '',
  product text DEFAULT '',
  meta text DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
