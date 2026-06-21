/*
 * Single source of truth for Rylo Health conversion + account destinations.
 *
 * Update a URL here once and every page picks it up. Markup carries no raw
 * URLs: CTAs are tagged with a `data-rylo-link` key (see RYLO_LINKS below)
 * and this script resolves the key to an href on load.
 *
 *   <a data-rylo-link="glp1Intake" ...>Reserve your spot</a>
 *
 * Intake links navigate in the same tab (conversion funnel). The patient
 * login link opens in a new tab.
 */
(function () {
  var RYLO_LINKS = {
    // GLP-1 intake covers BOTH semaglutide and tirzepatide.
    glp1Intake:   'https://start.rylohealth.com/start-online-visit/glp1-intake',
    nadIntake:    'https://start.rylohealth.com/start-online-visit/nad-intake-8b84cff2',
    patientLogin: 'https://my.rylohealth.com',
  };

  // Keys whose links should open in a new tab.
  var NEW_TAB = { patientLogin: true };

  window.RYLO_LINKS = RYLO_LINKS;

  function apply() {
    var els = document.querySelectorAll('[data-rylo-link]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute('data-rylo-link');
      var url = RYLO_LINKS[key];
      if (!url) continue;
      el.setAttribute('href', url);
      if (NEW_TAB[key]) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
