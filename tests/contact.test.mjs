// Run with: node --test tests/contact.test.mjs
// Google and Cloudflare are mocked, so this checks our logic, not the live services.
import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../functions/api/contact.js';

const URL_ = 'https://example.org/api/contact';
const GOOD = { name: 'Ada Lovelace', email: 'ada@example.org', message: 'Hello there', phone: '' };

function post(fields, { json = true, origin = 'https://example.org' } = {}) {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  if (json) headers.Accept = 'application/json';
  if (origin) headers.Origin = origin;
  return new Request(URL_, { method: 'POST', headers, body: new URLSearchParams(fields) });
}

function mockFetch({ formStatus = 200, formBody = 'Thanks', turnstile = true } = {}) {
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('siteverify')) return new Response(JSON.stringify({ success: turnstile }));
    if (String(url).endsWith('/viewform')) return new Response('<input type="hidden" name="fbzx" value="123"><input type="hidden" name="partialResponse" value="[null,null,&quot;123&quot;]">');
    return new Response(formBody, { status: formStatus });
  };
  return calls;
}

test('sends a valid message to the Google Form with the right entry numbers', async () => {
  const calls = mockFetch();
  const res = await onRequestPost({ request: post(GOOD), env: {} });
  assert.equal(res.status, 200);
  const sent = calls.find(c => c.url.endsWith('/formResponse'));
  const body = sent.init.body;
  assert.equal(body.get('entry.2005620554'), 'Ada Lovelace');
  assert.equal(body.get('entry.1045781291'), 'ada@example.org');
  assert.equal(body.get('entry.839337160'), 'Hello there');
  assert.equal(body.get('fbzx'), '123');
  assert.equal(body.get('partialResponse'), '[null,null,"123"]');
});

test('rejects missing required fields and bad emails', async () => {
  mockFetch();
  assert.equal((await onRequestPost({ request: post({ ...GOOD, message: '' }), env: {} })).status, 400);
  assert.equal((await onRequestPost({ request: post({ ...GOOD, email: 'nope' }), env: {} })).status, 400);
});

test('spam trap reports success without contacting Google', async () => {
  const calls = mockFetch();
  const res = await onRequestPost({ request: post({ ...GOOD, website: 'http://spam' }), env: {} });
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('blocks posts from other sites', async () => {
  const calls = mockFetch();
  const res = await onRequestPost({ request: post(GOOD, { origin: 'https://evil.example' }), env: {} });
  assert.equal(res.status, 403);
  assert.equal(calls.length, 0);
});

test('checks Turnstile when a secret is set, and skips it when not', async () => {
  mockFetch({ turnstile: false });
  const failed = await onRequestPost({ request: post({ ...GOOD, 'cf-turnstile-response': 'tok' }), env: { TURNSTILE_SECRET: 's' } });
  assert.equal(failed.status, 400);
  const missing = await onRequestPost({ request: post(GOOD), env: { TURNSTILE_SECRET: 's' } });
  assert.equal(missing.status, 400);
  mockFetch({ turnstile: true });
  const passed = await onRequestPost({ request: post({ ...GOOD, 'cf-turnstile-response': 'tok' }), env: { TURNSTILE_SECRET: 's' } });
  assert.equal(passed.status, 200);
  const skipped = await onRequestPost({ request: post(GOOD), env: {} });
  assert.equal(skipped.status, 200);
});

test('reports failure when Google redirects (for example to a sign-in page)', async () => {
  mockFetch({ formStatus: 302 });
  const res = await onRequestPost({ request: post(GOOD), env: {} });
  assert.equal(res.status, 502);
});

test('without JavaScript, success redirects back to the page and failure shows a short page', async () => {
  mockFetch();
  const ok = await onRequestPost({ request: post(GOOD, { json: false }), env: {} });
  assert.equal(ok.status, 303);
  assert.equal(new URL(ok.headers.get('Location')).hash, '#contact-sent');
  mockFetch({ formStatus: 500 });
  const bad = await onRequestPost({ request: post(GOOD, { json: false }), env: {} });
  assert.equal(bad.status, 502);
  assert.match(await bad.text(), /Back to the contact form/);
});

test('trims over-long input', async () => {
  const calls = mockFetch();
  await onRequestPost({ request: post({ ...GOOD, message: 'x'.repeat(9000) }), env: {} });
  const sent = calls.find(c => c.url.endsWith('/formResponse'));
  assert.equal(sent.init.body.get('entry.839337160').length, 5000);
});
