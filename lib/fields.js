// Field specs drive the generic Admin CMS forms/lists.
// Types: text | textarea | p (paragraphs) | lines (string[]) | blines ({en,vi}[]) | kv ({label,value}[]) | select | number | check | json (raw JSON textarea)
import { all } from '../db.js';
import { PJ, slugify } from './util.js';

async function categoryOptions() {
  const rows = await all("SELECT slug, name_en FROM categories WHERE status='active' ORDER BY sort_order ASC");
  return rows.map(r => [r.slug, r.name_en || r.slug]);
}
async function productOptions() {
  const rows = await all("SELECT slug, name_en FROM products WHERE status != 'archived' ORDER BY sort_order ASC");
  return rows.map(r => [r.slug, r.name_en || r.slug]);
}

export const STATUS_SELECT = [['draft', 'Draft'], ['published', 'Published'], ['archived', 'Archived (hidden)']];

export const COLLECTIONS = {
  products: {
    table: 'products', label: 'Products', nameKey: 'name_en', slugKey: 'slug',
    boolCols: { is_core: 1, show_divider: 1 },
    jsonCols: { benefits: 1, features: 1, specs: 1, applications: 1, use_cases: 1 },
    fields: async () => ([
      { k: 'name_en', t: 'text', l: 'Name (EN)', req: true },
      { k: 'name_vi', t: 'text', l: 'Name (VI)' },
      { k: 'slug', t: 'text', l: 'URL slug', hint: 'auto from name if empty' },
      { k: 'category_slug', t: 'select', l: 'Category', options: await categoryOptions() },
      { k: 'rfq_kind', t: 'select', l: 'RFQ field set', options: [['corrugated', 'Hollow plate box (size+divider)'], ['injection', 'Injection box (model)'], ['chair', 'Chair (model)'], ['mat', 'Mat (size+thickness)'], ['other', 'Other (free text)']] },
      { k: 'is_core', t: 'check', l: 'Core product (large card on home)' },
      { k: 'show_divider', t: 'check', l: 'Show divider design section' },
      { k: 'short_en', t: 'textarea', l: 'Short description (EN)' },
      { k: 'short_vi', t: 'textarea', l: 'Short description (VI)' },
      { k: 'intro_en', t: 'p', l: 'Introduction (EN, one paragraph per line)' },
      { k: 'intro_vi', t: 'p', l: 'Introduction (VI)' },
      { k: 'benefits', t: 'blines', l: 'Key benefits - one per line: English | Tiếng Việt' },
      { k: 'features', t: 'blines', l: 'Features - English | Việt' },
      { k: 'specs', t: 'kv', l: 'Specifications - one per line: Label | Value' },
      { k: 'applications', t: 'lines', l: 'Applications - one per line' },
      { k: 'use_cases', t: 'blines', l: 'Use cases - English | Việt' },
      { k: 'seo_title', t: 'text', l: 'SEO Title' },
      { k: 'seo_desc', t: 'textarea', l: 'Meta Description' },
      { k: 'status', t: 'select', l: 'Status', options: STATUS_SELECT },
      { k: 'sort_order', t: 'number', l: 'Sort order' }
    ])
  },
  solutions: {
    table: 'solutions', label: 'Solutions', nameKey: 'title_en', slugKey: 'slug',
    boolCols: {}, jsonCols: { points: 1 },
    fields: async () => ([
      { k: 'title_en', t: 'text', l: 'Title (EN)', req: true },
      { k: 'title_vi', t: 'text', l: 'Title (VI)' },
      { k: 'slug', t: 'text', l: 'URL slug' },
      { k: 'subtitle_en', t: 'text', l: 'Subtitle (EN)' },
      { k: 'intro_en', t: 'p', l: 'Intro (EN)' },
      { k: 'intro_vi', t: 'p', l: 'Intro (VI)' },
      { k: 'points', t: 'blines', l: 'Bullet points - English | Việt' },
      { k: 'seo_title', t: 'text', l: 'SEO Title' },
      { k: 'seo_desc', t: 'textarea', l: 'Meta Description' },
      { k: 'status', t: 'select', l: 'Status', options: STATUS_SELECT },
      { k: 'sort_order', t: 'number', l: 'Sort order' }
    ])
  },
  cases: {
    table: 'case_studies', label: 'Case Studies', nameKey: 'customer_display', slugKey: 'slug',
    boolCols: { anonymous: 1 }, jsonCols: { products: 1 },
    fields: async () => ([
      { k: 'customer_display', t: 'text', l: 'Customer (public name, or anonymized)', req: true },
      { k: 'anonymous', t: 'check', l: 'Anonymized customer' },
      { k: 'industry', t: 'text', l: 'Industry' },
      { k: 'country', t: 'text', l: 'Country' },
      { k: 'slug', t: 'text', l: 'URL slug' },
      { k: 'challenge_en', t: 'p', l: 'Customer challenge (one per line)' },
      { k: 'requirement_en', t: 'p', l: 'Requirement' },
      { k: 'solution_en', t: 'p', l: 'Our solution' },
      { k: 'result_en', t: 'p', l: 'Result' },
      { k: 'products', t: 'lines', l: 'Linked product slugs - one per line' },
      { k: 'seo_title', t: 'text', l: 'SEO Title' },
      { k: 'seo_desc', t: 'textarea', l: 'Meta Description' },
      { k: 'status', t: 'select', l: 'Status', options: STATUS_SELECT },
      { k: 'sort_order', t: 'number', l: 'Sort order' }
    ])
  },
  faqs: {
    table: 'faqs', label: 'FAQ', nameKey: 'q_en', slugKey: null,
    boolCols: {}, jsonCols: {},
    fields: async () => ([
      { k: 'q_en', t: 'text', l: 'Question (EN)', req: true },
      { k: 'a_en', t: 'textarea', l: 'Answer (EN)' },
      { k: 'q_vi', t: 'text', l: 'Question (VI)' },
      { k: 'a_vi', t: 'textarea', l: 'Answer (VI)' },
      { k: 'category', t: 'select', l: 'Category', options: [['general', 'General'], ['product', 'Product'], ['logistics', 'Logistics'], ['company', 'Company']] },
      { k: 'product_slug', t: 'select', l: 'Linked product (optional)', options: [['', '— none —'], ...(await productOptions())] },
      { k: 'status', t: 'select', l: 'Status', options: STATUS_SELECT },
      { k: 'sort_order', t: 'number', l: 'Sort order' }
    ])
  },
  categories: {
    table: 'categories', label: 'Categories', nameKey: 'name_en', slugKey: 'slug',
    boolCols: {}, jsonCols: {},
    fields: async () => ([
      { k: 'name_en', t: 'text', l: 'Name (EN)', req: true },
      { k: 'name_vi', t: 'text', l: 'Name (VI)' },
      { k: 'slug', t: 'text', l: 'Slug' },
      { k: 'status', t: 'select', l: 'Status', options: [['active', 'Active'], ['archived', 'Archived']] },
      { k: 'sort_order', t: 'number', l: 'Sort order' }
    ])
  },
  landings: {
    table: 'landing_pages', label: 'Ad Landing Pages', nameKey: 'name', slugKey: 'slug',
    boolCols: {}, jsonCols: { blocks: 1 },
    fields: async () => ([
      { k: 'name', t: 'text', l: 'Internal name', req: true },
      { k: 'slug', t: 'text', l: 'URL ( /slug )', hint: 'e.g. esd-box-solution' },
      { k: 'blocks', t: 'json', l: 'Page blocks (JSON array)', hint: 'types: hero / text / bullets / benefits / product / image / faq / form / cta / proof' },
      { k: 'seo_title', t: 'text', l: 'SEO Title' },
      { k: 'seo_desc', t: 'textarea', l: 'Meta Description' },
      { k: 'status', t: 'select', l: 'Status', options: STATUS_SELECT }
    ])
  }
};

export const SETTING_PAGES = {
  homepage: {
    label: 'Homepage', fields: [
      { k: 'hero_eyebrow', t: 'text', l: 'Hero eyebrow line' },
      { k: 'hero_title', t: 'text', l: 'Hero title' },
      { k: 'hero_title_vi', t: 'text', l: 'Hero title (VI)' },
      { k: 'hero_sub', t: 'textarea', l: 'Hero subtitle' },
      { k: 'hero_sub_vi', t: 'textarea', l: 'Hero subtitle (VI)' },
      { k: 'why_items', t: 'blines', l: 'Why choose us - one per line: Title | description' },
      { k: 'apps_items', t: 'lines', l: 'Applications - one per line' },
      { k: 'factory_text', t: 'p', l: 'Factory section text (real facts only)' },
      { k: 'final_title', t: 'text', l: 'Final CTA title' },
      { k: 'final_text', t: 'textarea', l: 'Final CTA text' },
      { k: 'show_cases', t: 'check', l: 'Show case studies section' },
      { k: 'show_faq', t: 'check', l: 'Show FAQ section' }
    ]
  },
  about: {
    label: 'About Us page', fields: [
      { k: 'company_intro', t: 'p', l: 'Company intro (real data - fill in Admin)' },
      { k: 'factory_text', t: 'p', l: 'Factory / Manufacturing' },
      { k: 'quality_text', t: 'p', l: 'Quality Control' },
      { k: 'export_text', t: 'p', l: 'Export Capability' },
      { k: 'certificates', t: 'lines', l: 'Certificates - one per line (real only)' }
    ]
  },
  site: {
    label: 'Site & Contact', fields: [
      { k: 'brand', t: 'text', l: 'Brand name' },
      { k: 'company_legal', t: 'text', l: 'Company legal name' },
      { k: 'whatsapp', t: 'text', l: 'WhatsApp number (with country code, digits/+ only)' },
      { k: 'email', t: 'text', l: 'Email' },
      { k: 'address', t: 'text', l: 'Address' },
      { k: 'wa_msg_default', t: 'textarea', l: 'Default WhatsApp message when visitor clicks' }
    ]
  },
  tracking: {
    label: 'Tracking (Pixel / CAPI / GA4)', fields: [
      { k: 'meta_pixel_id', t: 'text', l: 'Meta Pixel ID' },
      { k: 'meta_test_event_code', t: 'text', l: 'Meta Test Event Code (while testing)' },
      { k: 'meta_capi_token', t: 'text', l: 'Meta Conversions API token' },
      { k: 'ga4_id', t: 'text', l: 'GA4 Measurement ID (G-XXXX)' }
    ]
  }
};

export function blankFor(spec, row) {
  const out = {};
  for (const f of spec.fields) out[f.k] = row ? (row[f.k] ?? '') : '';
  return out;
}

// Convert form submission -> db values
export async function formToValues(spec, body) {
  const values = {};
  for (const f of spec.fields) {
    switch (f.t) {
      case 'check': values[f.k] = body[f.k] ? true : false; break;
      case 'number': values[f.k] = parseInt(body[f.k] || '0', 10) || 0; break;
      case 'lines': case 'blines': case 'kv': values[f.k] = parseListField(f.t, body[f.k] || ''); break;
      case 'json': try { values[f.k] = JSON.parse(body[f.k] || '[]'); } catch { values[f.k] = { __error: 'invalid JSON' }; } break;
      default: values[f.k] = String(body[f.k] ?? '').trim();
    }
  }
  if (spec.slugKey && !values.slug) {
    const from = values[spec.nameKey] || values[Object.keys(values)[0]] || '';
    values.slug = slugify(from);
  }
  if (spec.slugKey) values.slug = slugify(values.slug);
  return values;
}
// Convert db value -> form text
export function valueToForm(spec, row) {
  const out = {};
  for (const f of spec.fields) {
    let v = row ? row[f.k] : '';
    if (v === null || v === undefined) v = '';
    if (f.t === 'check') out[f.k] = v ? 'checked' : '';
    else if (f.t === 'lines') out[f.k] = (PJ(v, []) || []).join('\n');
    else if (f.t === 'blines') out[f.k] = (PJ(v, []) || []).map(x => `${x.en || ''} | ${x.vi || ''}`).join('\n');
    else if (f.t === 'kv') out[f.k] = (PJ(v, []) || []).map(x => `${x.label || ''} | ${x.value || ''}`).join('\n');
    else if (f.t === 'json') out[f.k] = typeof v === 'string' ? v : JSON.stringify(v, null, 2);
    else out[f.k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
  }
  return out;
}
function parseListField(type, text) {
  const lines = String(text).split('\n').map(s => s.trim()).filter(Boolean);
  if (type === 'lines') return lines;
  if (type === 'blines') return lines.map(l => {
    const [en, vi] = l.split('|');
    return { en: (en || '').trim(), vi: (vi || '').trim() };
  });
  if (type === 'kv') return lines.map(l => {
    const [label, value] = l.split('|');
    return { label: (label || '').trim(), value: (value || '').trim() };
  });
  return [];
}
