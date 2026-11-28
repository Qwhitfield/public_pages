/* AI Fixes funnel: shared config, source tracking, and Meta Pixel.
   ------------------------------------------------------------------
   FILL IN BEFORE LAUNCH (search this file for "TODO"):
   1. META_PIXEL_ID  - from Meta Events Manager.
   2. KIT_FORMS      - the form "action" URL from Kit (Form > Embed > HTML).
                       One form is enough: every signup also sends its
                       source in the custom field "lead_source", so you can
                       build one Kit segment or tag rule per source.
                       Optional: give a source its own form to auto-tag it.
   3. KIT_CHECKOUT   - the Kit Commerce checkout link for the $9 kit.
   4. WEBINAR_URL    - Dec 11 webinar registration link (leave '' to hide).
*/
window.QAMW_FUNNEL = {
  META_PIXEL_ID: '1159245596503132',                       // Meta Pixel ID (number only)
  KIT_FORMS: {
    default: '',                           // TODO e.g. 'https://app.kit.com/forms/1234567/subscriptions'
    // 'meta-np': '', 'meta-smb': '', 'meta-seattle': ''   (optional per-source forms)
  },
  KIT_CHECKOUT: '',                        // TODO $9 AI-Ready Business Kit checkout URL
  WEBINAR_URL: 'https://www.qamwconsulting.com/running-lean-webinar',  // Dec 11 webinar registration
  PDF_URL: '/downloads/5-fixes-to-make-ai-actually-know-your-business.pdf'
};

(function () {
  var C = window.QAMW_FUNNEL;

  // ---- Source: ?src=np|smb|seattle|li|ig|skool|alignable|email|webinar ----
  var MAP = {
    np: 'meta-np', smb: 'meta-smb', seattle: 'meta-seattle',
    'meta-np': 'meta-np', 'meta-smb': 'meta-smb', 'meta-seattle': 'meta-seattle',
    li: 'li', linkedin: 'li', ig: 'ig', instagram: 'ig', skool: 'skool',
    alignable: 'alignable', email: 'email', webinar: 'webinar'
  };
  var params = new URLSearchParams(location.search);
  var raw = (params.get('src') || '').toLowerCase();
  var src = MAP[raw] || null;
  try {
    if (src) sessionStorage.setItem('qamw_src', src);
    else src = sessionStorage.getItem('qamw_src');
  } catch (e) {}
  C.source = src || 'direct';
  // Copy variant: np, smb, seattle, or default
  C.variant = C.source === 'meta-np' ? 'np' : C.source === 'meta-smb' ? 'smb' : C.source === 'meta-seattle' ? 'seattle' : 'default';

  // ---- Meta Pixel (skipped if no ID, or if the visitor declined cookies) ----
  var consent = null;
  try { consent = localStorage.getItem('qamw_cookie_consent'); } catch (e) {}
  C.track = function () {};
  if (C.META_PIXEL_ID && consent !== 'denied') {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', C.META_PIXEL_ID);
    fbq('track', 'PageView');
    C.track = function (event, data) { try { fbq('track', event, data || {}); } catch (e) {} };
  }
})();
