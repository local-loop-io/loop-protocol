#!/usr/bin/env node
'use strict';

/**
 * Packaging extension-guidance conformance harness. See profiles/packaging/conformance/README.md
 * for scope. Reuses scripts/lib/profile-conformance-runner.js (shared with the battery and
 * waste-shipment profiles) for AJV setup and reporting; the only profile-specific code here is
 * the semantic-check registry below.
 */

const { runProfileConformance } = require('../../../scripts/lib/profile-conformance-runner.js');

// profiles/packaging/README.md's field-mapping table maps "identifying an item as
// reusable/grouped packaging" directly to ProductDNA.product_category: "packaging-reusable" —
// the only ProductDNA category built for this. A ProductDNA record that tags itself
// supported_regimes: [ppwr] is, by that mapping, identifying itself as reusable/grouped
// packaging. This check is scoped to ProductDNA only: a MaterialDNA packaging-waste-stream
// record (e.g. cardboard, plastic-pet under EWC chapter 15) can independently carry
// supported_regimes: [ppwr] without implying any particular MaterialDNA category.
function checkPpwrRegimeImpliesReusableCategory(payload) {
  const failures = [];
  const regimes = (payload && payload.passport && payload.passport.supported_regimes) || [];
  if (payload['@type'] === 'ProductDNA' && regimes.includes('ppwr') && payload.product_category !== 'packaging-reusable') {
    failures.push(
      `passport.supported_regimes includes "ppwr" but product_category is "${payload.product_category}", ` +
        'not "packaging-reusable" — profiles/packaging/README.md maps PPWR-relevant ProductDNA records to ' +
        'product_category packaging-reusable.',
    );
  }
  return failures;
}

const SEMANTIC_CHECKS = new Map([
  ['packaging-ppwr-regime-implies-reusable-category', checkPpwrRegimeImpliesReusableCategory],
]);

runProfileConformance({
  profileLabel: 'Packaging',
  vectorsPath: 'profiles/packaging/conformance/vectors/packaging-vectors.json',
  requirementsPath: 'profiles/packaging/requirements/packaging-requirements.json',
  semanticChecks: SEMANTIC_CHECKS,
});
