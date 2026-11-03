/* QAMW Consulting — cookie notice.
   Analytics runs by default; "Decline" turns Google Analytics off and is remembered.
   Each page's gtag block reads the saved choice (qamw_cookie_consent) before configuring GA. */
(function () {
  var KEY = 'qamw_cookie_consent';
  var script = document.currentScript;
  var privacyUrl = script ? new URL('../privacy.html', script.src).href : '/privacy.html';

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }
  function updateConsent(value) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: value });
    }
  }
  function clearAnalyticsCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  if (getChoice()) return;

  var css = '' +
    '.qamw-cookie{position:fixed;left:24px;bottom:24px;z-index:9999;max-width:420px;' +
    'background:#131215;color:#c9c5cf;border:1px solid #2e2b33;box-shadow:0 20px 50px -12px rgba(0,0,0,.6);' +
    'padding:22px 24px;font-family:"DM Sans",system-ui,sans-serif;font-size:14px;line-height:1.55;' +
    'animation:qamwCookieIn .4s ease both}' +
    '.qamw-cookie p{margin:0 0 16px}' +
    '.qamw-cookie strong{color:#f4f1ec;font-weight:600}' +
    '.qamw-cookie a{color:#f4f1ec;text-underline-offset:3px}' +
    '.qamw-cookie-actions{display:flex;gap:10px;flex-wrap:wrap}' +
    '.qamw-cookie button{font:inherit;font-weight:600;font-size:14px;cursor:pointer;padding:10px 20px;border-radius:0;transition:background .2s,border-color .2s}' +
    '.qamw-cookie .qamw-ok{background:#8c52ff;color:#fff;border:1px solid #8c52ff}' +
    '.qamw-cookie .qamw-ok:hover{background:#7340d4;border-color:#7340d4}' +
    '.qamw-cookie .qamw-no{background:transparent;color:#c9c5cf;border:1px solid #2e2b33}' +
    '.qamw-cookie .qamw-no:hover{border-color:#8c52ff;color:#f4f1ec}' +
    '.qamw-cookie button:focus-visible{outline:2px solid #8c52ff;outline-offset:2px}' +
    '@keyframes qamwCookieIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}' +
    '@media (max-width:560px){.qamw-cookie{left:12px;right:12px;bottom:12px;max-width:none}}' +
    '@media (prefers-reduced-motion:reduce){.qamw-cookie{animation:none}}';

  function show() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.className = 'qamw-cookie';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Cookie notice');
    box.innerHTML =
      '<p><strong>Cookies, briefly.</strong> This site uses Google Analytics cookies to see which pages are useful. ' +
      'No ads, and your data is never sold. <a href="' + privacyUrl + '">Privacy policy</a></p>' +
      '<div class="qamw-cookie-actions">' +
      '<button type="button" class="qamw-ok">Got it</button>' +
      '<button type="button" class="qamw-no">Decline</button>' +
      '</div>';
    document.body.appendChild(box);

    box.querySelector('.qamw-ok').addEventListener('click', function () {
      saveChoice('granted');
      updateConsent('granted');
      box.remove();
    });
    box.querySelector('.qamw-no').addEventListener('click', function () {
      saveChoice('denied');
      updateConsent('denied');
      clearAnalyticsCookies();
      box.remove();
    });
  }

  if (document.body) show();
  else document.addEventListener('DOMContentLoaded', show);
})();
