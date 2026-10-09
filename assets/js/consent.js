/* Cookie consent for Google Analytics. Settings: _data/analytics.yml. Nothing is requested from Google until "Accept".
   The choice is remembered in this browser only (localStorage). The footer "Cookie settings" button reopens the banner. */
(function () {
  var cfg = window.psAnalytics;
  if (!cfg || !cfg.id) return;
  var KEY = 'ps-analytics-consent';
  var loaded = false;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* choice is simply not remembered */ } }

  function load() {
    if (loaded) return;
    loaded = true;
    window['ga-disable-' + cfg.id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.id);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.id);
    document.head.appendChild(s);
  }

  function clearCookies() {
    window['ga-disable-' + cfg.id] = true;
    var host = location.hostname.split('.');
    var domains = [location.hostname];
    for (var i = 1; i < host.length - 1; i++) domains.push(host.slice(i).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
      });
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
  }

  function init() {
    var banner = document.getElementById('consent-banner');
    function show() { if (banner) banner.hidden = false; }
    function choose(v) {
      write(v);
      if (banner) banner.hidden = true;
      if (v === 'granted') load(); else clearCookies();
    }
    if (banner) {
      banner.addEventListener('click', function (e) {
        var b = e.target.closest('[data-consent]');
        if (b) choose(b.getAttribute('data-consent'));
      });
    }
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); show(); if (banner) banner.querySelector('button').focus(); }
    });
    var saved = read();
    if (saved === 'granted') load();
    else if (saved === 'denied') window['ga-disable-' + cfg.id] = true;
    else show();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
