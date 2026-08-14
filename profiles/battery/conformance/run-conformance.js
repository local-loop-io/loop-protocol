#!/usr/bin/env node
'use strict';

/**
 * Battery extension-guidance conformance harness. See profiles/battery/conformance/README.md
 * for scope. Reuses scripts/lib/profile-conformance-runner.js (shared with the packaging and
 * waste-shipment profiles) for AJV setup and reporting; the only profile-specific code here is
 * the semantic-check registry below.
 */

const { runProfileConformance } = require('../../../scripts/lib/profile-conformance-runner.js');

// profiles/battery/README.md and docs/category-classification-mapping.md both document that
// the same physical battery moves from ProductDNA (in use) to MaterialDNA category
// ewaste-batteries at end of life — classification.battery_category has no other MaterialDNA
// category to attach to, so a MaterialDNA record that sets it must use ewaste-batteries.
// ProductDNA has no classification block at all, so this check only applies to MaterialDNA.
function checkBatteryCategoryImpliesEwasteCategory(payload) {
  const failures = [];
  const batteryCategory = payload && payload.classification && payload.classification.battery_category;
  if (batteryCategory && payload['@type'] === 'MaterialDNA' && payload.category !== 'ewaste-batteries') {
    failures.push(
      `classification.battery_category is set ("${batteryCategory}") but category is "${payload.category}", ` +
        'not "ewaste-batteries" — profiles/battery/README.md documents ewaste-batteries as the MaterialDNA ' +
        'category for batteries at end of life.',
    );
  }
  return failures;
}

const SEMANTIC_CHECKS = new Map([['battery-category-implies-ewaste-category', checkBatteryCategoryImpliesEwasteCategory]]);

runProfileConformance({
  profileLabel: 'Battery',
  vectorsPath: 'profiles/battery/conformance/vectors/battery-vectors.json',
  requirementsPath: 'profiles/battery/requirements/battery-requirements.json',
  semanticChecks: SEMANTIC_CHECKS,
});
