/*
 * Google Tag Manager — single source of truth for the container ID.
 *
 * This site is static, multi-page HTML with no build step or env-var
 * substitution, so there is no NEXT_PUBLIC_GTM_ID to inject at build time.
 * Instead the container id lives here, once, and is loaded as high as
 * possible in <head> on every page via:
 *
 *   <script src="/config/gtm.js"></script>
 *
 * The no-JS fallback (<noscript> iframe) is placed immediately after
 * <body> on each page. Because that iframe must work with JavaScript
 * disabled, its id cannot be injected by this script — it is the one
 * place the id is necessarily repeated in markup. To change the
 * container, update GTM_ID here and the id in each page's noscript iframe.
 */
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-PG2N8WBZ');
