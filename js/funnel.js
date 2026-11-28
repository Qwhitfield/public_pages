/* AI Fixes funnel: shared config, source tracking, and Meta Pixel.
   ------------------------------------------------------------------
   Flow: Meta ad (A or B) -> ai-ready-kit.html (Kit form, free 5 Fixes PDF)
         -> 5-ai-fixes-thank-you.html ($9 offer) -> Kit checkout ($9, later $47)

   Kit forms: each ad set loads its own Kit form (by uid), and a Kit rule
   on each form adds the tag (meta-np / meta-smb). Organic visits with no
   ?src= use the "default" form.
   Still TODO: KIT_CHECKOUT, the Kit Commerce checkout link for the $9 kit.
   Ad links: ai-ready-kit.html?src=np  and  ai-ready-kit.html?src=smb
*/
window.QAMW_FUNNEL = {
  META_PIXEL_ID: '1159245596503132',                       // Meta Pixel ID (number only)
  KIT_DOMAIN: 'https://mbg-consulting.kit.com',
  KIT_FORM_UIDS: {
    'meta-np': '9a74da6b20',               // Nonprofit form (rule adds tag meta-np)
    'meta-smb': '4d45be1af6',              // SMB form (rule adds tag meta-smb)
    default: '4d45be1af6'                  // Organic / no ?src=. Swap in a third form's uid to keep ad numbers clean
  },
  KIT_CHECKOUT: 'https://mbg-consulting.kit.com/products/untitled-digital-download',                        // TODO $9 AI-Ready Business Kit checkout URL
  WEBINAR_URL: 'https://www.qamwconsulting.com/running-lean-webinar',  // Dec 11 webinar registration
  PDF_URL: '/downloads/5-fixes-to-make-ai-actually-know-your-business.pdf'
};

(function () {
  var C = window.QAMW_FUNNEL;

  // ---- Source: ?src=np|smb|li|ig|skool|alignable|email|webinar ----
  var MAP = {
    np: 'meta-np', smb: 'meta-smb',
    'meta-np': 'meta-np', 'meta-smb': 'meta-smb',
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
  // Copy variant: np, smb, or default
  C.variant = C.source === 'meta-np' ? 'np' : C.source === 'meta-smb' ? 'smb' : 'default';

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
