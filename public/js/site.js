/* MacroESD site runtime: visitor id, UTM capture, tracking events, RFQ wizard */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- visitor & UTM capture ---------- */
  function uuid() {
    return 'xxxxxxxx'.replace(/x/g, function () { return Math.floor(Math.random() * 16).toString(16); }) + Date.now().toString(36);
  }
  var LS = window.localStorage;
  function getVisitor() {
    try {
      var v = LS.getItem('me_vid');
      if (!v) { v = uuid(); LS.setItem('me_vid', v); }
      return v;
    } catch (e) { return uuid(); }
  }
  var VID = getVisitor();
  function captureUtm() {
    var p = new URLSearchParams(location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    if (!p.get('utm_source')) return;
    var cur = {};
    try { cur = JSON.parse(LS.getItem('me_utm') || '{}'); } catch (e) {}
    if (!cur.utm_source) { // first touch wins
      keys.forEach(function (k) { if (p.get(k)) cur[k] = p.get(k); });
      cur.first_landing = location.pathname;
      try { LS.setItem('me_utm', JSON.stringify(cur)); } catch (e) {}
    }
  }
  function getUtm() {
    try { return JSON.parse(LS.getItem('me_utm') || '{}'); } catch (e) { return {}; }
  }
  captureUtm();

  /* ---------- tracking ---------- */
  function beacon(type, extra) {
    try {
      var payload = Object.assign({ visitor: VID, type: type, path: location.pathname }, extra || {});
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(function () {});
    } catch (e) {}
  }
  function fbqSafe(name, params, custom) {
    try { if (typeof window.fbq === 'function') window.fbq(custom ? 'trackCustom' : 'track', name, params); } catch (e) {}
  }
  function gtagSafe(name, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, params); } catch (e) {}
  }
  function track(type, params) {
    beacon(type, params);
    if (type === 'WhatsAppClick') { fbqSafe('Contact', params); gtagSafe('whatsapp_click', params); }
    if (type === 'RFQStart') { fbqSafe('RFQStart', params, true); gtagSafe('rfq_start', params); }
    if (type === 'RFQSubmit') { fbqSafe('Lead', params); gtagSafe('generate_lead', params); }
    if (type === 'ViewContent') { fbqSafe('ViewContent', params); gtagSafe('view_item', params); }
  }
  track('PageView', { value: 0, currency: 'USD' });

  /* product card view tracking */
  $$('[data-vc]').forEach(function (el) {
    el.addEventListener('click', function () { track('ViewContent', { product: el.getAttribute('data-vc') }); });
  });

  /* WhatsApp clicks (delegated) */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('[data-wa]') : null;
    if (!a) return;
    track('WhatsAppClick', { product: a.getAttribute('data-wa-product') || '', page: location.pathname });
  });

  /* mobile menu */
  var mb = $('#menuBtn');
  if (mb) mb.addEventListener('click', function () { document.body.classList.toggle('nav-open'); });

  /* ---------- RFQ wizard ---------- */
  $$('.rfq-form').forEach(function (form) {
    var started = false;
    var loadTs = Date.now();
    var hiddenTs = form.querySelector('[name=load_ts]');
    if (hiddenTs) hiddenTs.value = loadTs;
    var pageField = form.querySelector('[name=page]');
    if (pageField) pageField.value = location.pathname;
    var visField = form.querySelector('[name=visitor]');
    if (visField) visField.value = VID;

    function showStep(n) {
      $$('.rfq-step', form).forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== String(n); });
      $$('.rp-dot', form).forEach(function (d) { d.classList.toggle('on', Number(d.getAttribute('data-step')) <= Number(n)); });
      if (n === 2) applyKind();
    }
    function chosen() {
      var r = form.querySelector('input[name=product_choice]:checked');
      return r || null;
    }
    function applyKind() {
      var r = chosen();
      var kind = r ? r.getAttribute('data-kind') : 'other';
      $$('fieldset[data-kind]', form).forEach(function (fs) { fs.hidden = fs.getAttribute('data-kind') !== kind; });
      var k = form.querySelector('[name=kind]'); if (k) k.value = kind;
      var pv = form.querySelector('[name=product]');
      if (pv && r) pv.value = r.getAttribute('data-name') || r.value;
    }
    $$('input[name=product_choice]', form).forEach(function (r) {
      r.addEventListener('change', function () {
        if (!started) { started = true; track('RFQStart', {}); }
        applyKind();
      });
    });
    form.addEventListener('focusin', function () { if (!started) { started = true; track('RFQStart', {}); } });
    $$('[data-next]', form).forEach(function (b) {
      b.addEventListener('click', function () {
        var n = Number(b.getAttribute('data-next'));
        if (n === 3) {
          var p2ok = true;
          var kindField = chosen();
          showStep(n);
          return;
        }
        showStep(n);
      });
    });
    showStep(chosen() ? 2 : 1);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var err = $('[data-err]', form);
      if (err) err.hidden = true;
      var data = {};
      new FormData(form).forEach(function (v, k) { if (typeof v === 'string') data[k] = v.trim(); });
      if (!data.name || !data.company || !data.country || !data.email || !data.whatsapp) {
        if (err) { err.hidden = false; } return;
      }
      var btn = form.querySelector('[type=submit]');
      if (btn) btn.disabled = true;
      data.utm = getUtm();
      data.visitor = VID;
      fetch('/api/rfq', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (r) {
        if (r && r.ok) {
          $$('.rfq-step', form).forEach(function (p) { p.hidden = true; });
          $('.rfq-progress', form) && ($('.rfq-progress', form).hidden = true);
          var done = $('[data-done]', form);
          if (done) { done.hidden = false; var c = $('[data-leadcode]', form); if (c) c.textContent = r.code; }
          track('RFQSubmit', { code: r.code, product: data.product, content_ids: [], currency: 'USD' });
          try { var p = new URLSearchParams(location.search); if (p.get('fbclid')) { /* keep url */ } } catch (e) {}
        } else {
          alert((r && r.error) || 'Submission failed, please try again or use WhatsApp.');
          if (btn) btn.disabled = false;
        }
      }).catch(function () {
        alert('Network error. Please retry or use WhatsApp.');
        if (btn) btn.disabled = false;
      });
    });
  });
})();
