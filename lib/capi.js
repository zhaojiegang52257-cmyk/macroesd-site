import { sha256, normalizePhone } from './util.js';

// Meta Conversions API - server-side event. Called after a lead is stored.
export async function sendCapiLead(tracking, lead) {
  const pixelId = (tracking.meta_pixel_id || '').trim();
  const token = (tracking.meta_capi_token || '').trim();
  if (!pixelId || !token) return 'not-configured';
  const user_data = {};
  if (lead.email) user_data.em = [sha256(lead.email)];
  const phone = normalizePhone(lead.whatsapp);
  if (phone) user_data.ph = [sha256('+' + phone)];
  if (lead.country) user_data.stn = [sha256(String(lead.country).toUpperCase())];
  const payload = {
    access_token: token,
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: lead.code,
      action_source: 'website',
      event_source_url: lead.landing_page || '',
      user_data,
      custom_data: { currency: 'USD', product: lead.product, quantity: lead.quantity },
      test_event_code: tracking.meta_test_event_code || undefined
    }]
  };
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const body = await res.text();
    return res.status === 200 ? 'ok:' + body.slice(0, 200) : 'err:' + res.status + ':' + body.slice(0, 200);
  } catch (e) {
    return 'fail:' + e.message;
  }
}
