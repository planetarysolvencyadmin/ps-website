// Cloudflare Pages Function: POST /api/contact
//
// The contact form on /connect/ posts here. This checks the message, optionally checks Cloudflare
// Turnstile, then passes it on to the Google Form so responses keep landing in the same Google Sheet.
//
// Settings:
//   TURNSTILE_SECRET  (optional) Pages > Settings > Variables and Secrets. If unset, the Turnstile check is skipped.
//
// If the Google Form changes (new questions, a new form), update the two constants below.
// The IDs come from the form's page source: the ID after /d/e/ in its link, and each question's "entry" number.

const GOOGLE_FORM_ID = '1FAIpQLSf3kWVe2I6HPTwtHS6LkzqAlUfCW8qOaF6z2cKtPDwhynBAwA';
const ENTRY = {
  name: 'entry.2005620554',
  email: 'entry.1045781291',
  message: 'entry.839337160',
  phone: 'entry.1166974658'
};
const MAX_LENGTH = { name: 200, email: 254, phone: 50, message: 5000 };
const REQUIRED = ['name', 'email', 'message'];

export async function onRequestPost({ request, env }) {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const reply = (ok, status, message) => {
    if (wantsJson) return json({ ok, message }, status);
    if (ok) return Response.redirect(new URL('/connect/#contact-sent', request.url).href, 303);
    return page(message, status);
  };

  // Only accept posts from this site (browsers always send Origin on form posts)
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return reply(false, 403, 'This request was not allowed.');
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(false, 400, 'We could not read that form. Please try again.');
  }

  // Spam trap: real visitors never see this field. Pretend it worked so bots move on.
  if (clean(form.get('website'))) return reply(true, 200, 'Thank you. Your message has been sent.');

  const values = {};
  for (const key of Object.keys(ENTRY)) values[key] = clean(form.get(key)).slice(0, MAX_LENGTH[key]);

  for (const key of REQUIRED) {
    if (!values[key]) return reply(false, 400, `Please fill in your ${key}.`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return reply(false, 400, 'Please enter a valid email address.');
  }

  if (env && env.TURNSTILE_SECRET) {
    const passed = await verifyTurnstile(env.TURNSTILE_SECRET, form.get('cf-turnstile-response'), request.headers.get('CF-Connecting-IP'));
    if (!passed) return reply(false, 400, 'The spam check did not pass. Please reload the page and try again.');
  }

  const sent = await sendToGoogle(values);
  if (!sent) return reply(false, 502, 'Sorry, we could not send your message just now.');
  return reply(true, 200, 'Thank you. Your message has been sent.');
}

export async function onRequest() {
  return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
}

function clean(value) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim() : '';
}

async function verifyTurnstile(secret, token, ip) {
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: String(token) });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const result = await res.json();
    return result.success === true;
  } catch {
    return false;
  }
}

async function sendToGoogle(values) {
  const base = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}`;
  // Google's own page carries hidden fields (a token and similar). Copy them across the way a browser would.
  const hidden = { fvv: '1', pageHistory: '0' };
  try {
    const html = await (await fetch(`${base}/viewform`)).text();
    for (const m of html.matchAll(/<input type="hidden" name="([^"]+)" value="([^"]*)"/g)) hidden[m[1]] = decodeEntities(m[2]);
  } catch {
    // carry on with the defaults
  }
  const body = new URLSearchParams(hidden);
  for (const [key, entry] of Object.entries(ENTRY)) body.set(entry, values[key]);
  try {
    const res = await fetch(`${base}/formResponse`, { method: 'POST', body, redirect: 'manual' });
    if (res.status !== 200) return false; // a redirect here usually means the form wants a Google sign-in
    const text = await res.text();
    return !/ServiceLogin|accounts\.google\.com\/v3\/signin/.test(text);
  } catch {
    return false;
  }
}

function decodeEntities(s) {
  return s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function json(body, status) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

function page(message, status) {
  const safe = message.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const html = `<!DOCTYPE html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Contact · Planetary Solvency</title><body style="font-family:Helvetica,Arial,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1.5rem;line-height:1.6;color:#171B24"><p>${safe}</p><p><a href="/connect/#contact">Back to the contact form</a></p></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
