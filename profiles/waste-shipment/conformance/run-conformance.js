#!/usr/bin/env node
'use strict';

/**
 * Waste-shipment extension-guidance conformance harness. See
 * profiles/waste-shipment/conformance/README.md for scope. Reuses
 * scripts/lib/profile-conformance-runner.js (shared with the battery and packaging profiles)
 * for AJV setup and reporting; the only profile-specific code here is the semantic-check
 * registry below.
 */

const { runProfileConformance } = require('../../../scripts/lib/profile-conformance-runner.js');

// docs/access-scope-model.md documents DIWASS's real access model (authenticated, registered
// operators and competent authorities only — no public tier at all) as mapping most directly to
// this model's operator/regulator tiers. profiles/waste-shipment/README.md states this directly:
// "a waste-shipment record with a populated waste_shipment_doc_ref should generally not be
// marked visible_to: public." Absence of passport, or visible_to=operator/regulator, is fine —
// only an explicit "public" tier on a doc-ref-bearing Transfer is rejected.
function checkWasteShipmentDocRefNotPublic(payload) {
  const failures = [];
  if (payload['@type'] === 'Transfer' && payload.waste_shipment_doc_ref && payload.passport && payload.passport.visible_to === 'public') {
    failures.push(
      'waste_shipment_doc_ref is set but passport.visible_to is "public" — profiles/waste-shipment/README.md ' +
        'and docs/access-scope-model.md document that DIWASS has no public access tier, so a waste-shipment ' +
        'record should not be marked visible_to: public.',
    );
  }
  return failures;
}

const SEMANTIC_CHECKS = new Map([
  ['waste-shipment-doc-ref-visibility-not-public', checkWasteShipmentDocRefNotPublic],
]);

runProfileConformance({
  profileLabel: 'Waste-Shipment',
  vectorsPath: 'profiles/waste-shipment/conformance/vectors/waste-shipment-vectors.json',
  requirementsPath: 'profiles/waste-shipment/requirements/waste-shipment-requirements.json',
  semanticChecks: SEMANTIC_CHECKS,
});
