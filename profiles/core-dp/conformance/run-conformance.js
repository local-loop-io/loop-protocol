#!/usr/bin/env node
'use strict';

/**
 * Core-DP conformance harness runner.
 *
 * Loads profiles/core-dp/conformance/vectors/core-dp-vectors.json and, for every vector:
 *   1. validates its structural shape against the schema it names (payload_schema), plus the
 *      body schema for envelope vectors;
 *   2. runs whatever semantic checks the vector itself declares (vector.semantic_checks) using
 *      the exact semantic-check implementations already shipped in scripts/validate-schemas.js
 *      (signing-input hash recomputation, Ed25519 signature verification against the fixture
 *      trust store, replay-window arithmetic, key lifecycle checks, choreography/idempotency
 *      rules, etc.);
 *   3. compares the outcome against the vector's declared `expected` (valid/invalid) and, for
 *      invalid vectors, the `expected_failure_contains` substring.
 *
 * This script does NOT duplicate AJV setup or semantic-check logic: it requires
 * scripts/validate-schemas.js as a module and reuses its makeAjv/compileSchemas plumbing and its
 * validateSemanticCheck implementations verbatim. What this script adds on top is the
 * per-vector / per-requirement-id conformance report and exit code.
 *
 * Anything a vector's declared semantic_checks name that is NOT implemented in
 * scripts/validate-schemas.js's CORE_DP_SEMANTIC_CHECKS registry (which, as of this writing,
 * covers every check name used in the vectors file) is reported as "skipped" with an explicit
 * reason, never scored as a fabricated pass or fail. As of this vectors file, every declared
 * semantic check is a static, self-contained computation (hash recomputation, signature
 * verification against the checked-in trust store fixture, timestamp/field arithmetic) and
 * needs no live backend or database — so in practice the skip bucket should be empty; the
 * branch exists so a future vector that genuinely requires a live backend degrades to "skipped"
 * rather than silently passing or failing.
 */

const fg = require('fast-glob');
const {
  loadJson,
  formatErrors,
  compileSchemas,
  validateSemanticCheck,
  CORE_DP_SEMANTIC_CHECKS,
} = require('../../../scripts/validate-schemas.js');

const REQUIREMENTS_PATH = 'profiles/core-dp/requirements/core-dp-requirements.json';
const MANIFEST_PATH = 'profiles/core-dp/requirements/spec-v0.2.0-normative-manifest.json';
const VECTORS_PATH = 'profiles/core-dp/conformance/vectors/core-dp-vectors.json';
const TRUST_STORE_PATH = 'profiles/core-dp/conformance/trust/accepted-peer-keys.json';

function pad(value, width) {
  const str = String(value);
  return str.length >= width ? `${str} ` : str + ' '.repeat(width - str.length);
}

function indentLines(text, prefix) {
  return text
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n');
}

// Mirrors the per-vector grading rules in scripts/validate-schemas.js's assertCoreDpVectors,
// but reports a structured status per vector instead of only accumulating flat failure strings,
// so this script can roll results up by requirement id. All schema validation and semantic-check
// evaluation calls into the reused, already-tested implementations — nothing here re-implements
// AJV or the check logic itself.
function evaluateVector(vector, validators, trustStore) {
  const failures = [];
  const skips = [];

  const validator = validators.get(vector.payload_schema);
  if (!validator) {
    return { status: 'fail', details: [`payload_schema is not registered with AJV: ${vector.payload_schema}`] };
  }

  const schemaValid = validator(vector.payload);
  if (!schemaValid) {
    failures.push(`schema validation failed against ${vector.payload_schema}:\n${formatErrors(validator.errors || [])}`);
  }

  if (schemaValid && vector.payload_schema.endsWith('/envelope.schema.json')) {
    const bodyValidator = validators.get(vector.payload.body_schema);
    if (!bodyValidator) {
      failures.push(`envelope body_schema is not registered with AJV: ${vector.payload.body_schema}`);
    } else if (!bodyValidator(vector.payload.body)) {
      failures.push(`envelope body failed ${vector.payload.body_schema}:\n${formatErrors(bodyValidator.errors || [])}`);
    }
  }

  const context = { evaluationTime: vector.evaluation_time, trustStore };
  for (const checkName of vector.semantic_checks || []) {
    if (!CORE_DP_SEMANTIC_CHECKS.has(checkName)) {
      skips.push(
        `semantic check "${checkName}" is not implemented by the reused validate-schemas.js registry ` +
          '(would require a live backend/database or logic this harness does not have access to) — ' +
          'vector reported as skipped rather than scored.',
      );
      continue;
    }
    try {
      failures.push(...validateSemanticCheck(checkName, vector.payload, context));
    } catch (error) {
      failures.push(`semantic check "${checkName}" threw: ${error.message}`);
    }
  }

  // A real schema/semantic-check failure must never be masked as "skip": skip only
  // means "we couldn't evaluate one of the declared checks," not "there was no
  // failure." If both occur on the same vector, the failure takes precedence and is
  // reported as FAIL (with exit code 1), and the skip reason is carried along in the
  // details rather than dropped. (Previously `skips.length > 0` short-circuited
  // before failures were ever inspected, so a vector with both a real failure and an
  // unimplemented semantic check silently reported as SKIP and exited 0.)
  if (skips.length > 0 && failures.length === 0) {
    return { status: 'skip', details: skips };
  }

  const skipNote =
    skips.length > 0
      ? [
          `Note: this vector also declared ${skips.length} unimplemented semantic check(s), not evaluated ` +
            '(not scored as pass or fail on their own, but a co-occurring real failure below is never masked by this):',
          ...skips,
        ]
      : [];

  if (vector.expected === 'valid') {
    if (failures.length === 0) {
      return { status: 'pass', details: [] };
    }
    return { status: 'fail', details: ['expected valid but failed:', ...failures, ...skipNote] };
  }

  if (vector.expected === 'invalid') {
    if (failures.length === 0) {
      return {
        status: 'fail',
        details: ['expected invalid, but schema validation and all semantic checks passed.', ...skipNote],
      };
    }
    if (typeof vector.expected_failure_contains === 'string' && vector.expected_failure_contains.length > 0) {
      const matched = failures.some((failure) => failure.includes(vector.expected_failure_contains));
      if (!matched) {
        return {
          status: 'fail',
          details: [
            `did not fail for the declared reason (expected a failure containing "${vector.expected_failure_contains}"). Actual failures:`,
            ...failures,
            ...skipNote,
          ],
        };
      }
    }
    return { status: 'pass', details: skipNote };
  }

  return { status: 'fail', details: [`vector has unrecognized expected value: ${vector.expected}`] };
}

function newBucket() {
  return { total: 0, pass: 0, fail: 0, skip: 0, failing: [], skipping: [] };
}

function recordInBucket(bucket, vectorId, status) {
  bucket.total += 1;
  if (status === 'pass') bucket.pass += 1;
  else if (status === 'fail') {
    bucket.fail += 1;
    bucket.failing.push(vectorId);
  } else {
    bucket.skip += 1;
    bucket.skipping.push(vectorId);
  }
}

function main() {
  const schemaPaths = fg.sync(['schemas/*.schema.json']);
  const profileSchemaPaths = fg.sync(['profiles/core-dp/schemas/*.schema.json']);
  const validators = new Map();
  const schemaIds = new Set();
  const schemaById = new Map();
  const setupFailures = [];

  compileSchemas([...schemaPaths, ...profileSchemaPaths], validators, schemaIds, schemaById, setupFailures);

  if (setupFailures.length > 0 || validators.size === 0) {
    console.error('Failed to set up AJV validators for the Core-DP conformance run:\n');
    setupFailures.forEach((failure) => console.error(failure));
    process.exit(1);
  }

  let requirements;
  let manifest;
  let suite;
  let trustStore;
  try {
    requirements = loadJson(REQUIREMENTS_PATH);
    manifest = loadJson(MANIFEST_PATH);
    suite = loadJson(VECTORS_PATH);
    trustStore = loadJson(TRUST_STORE_PATH);
  } catch (error) {
    console.error(`Failed to load conformance inputs: ${error.message}`);
    process.exit(1);
  }

  console.log('Core-DP Conformance Harness');
  console.log('===========================');
  console.log(`Suite:            ${suite.suite}`);
  console.log(`Vectors:           ${suite.vectors.length}`);
  console.log(`Schemas compiled:  ${schemaPaths.length} core + ${profileSchemaPaths.length} Core-DP profile`);
  console.log('');
  console.log('Per-vector results:');

  const requirementBuckets = new Map(requirements.requirements.map((requirement) => [requirement.id, newBucket()]));
  const manifestOnlyBuckets = new Map();

  let overallPass = 0;
  let overallFail = 0;
  let overallSkip = 0;
  const exercisedChecks = new Set();
  const unimplementedChecks = new Set();

  for (const vector of suite.vectors) {
    let result;
    try {
      result = evaluateVector(vector, validators, trustStore);
    } catch (error) {
      result = { status: 'fail', details: [`harness threw while evaluating vector: ${error.message}`] };
    }

    if (result.status === 'pass') overallPass += 1;
    else if (result.status === 'fail') overallFail += 1;
    else overallSkip += 1;

    (vector.semantic_checks || []).forEach((checkName) => {
      if (CORE_DP_SEMANTIC_CHECKS.has(checkName)) {
        exercisedChecks.add(checkName);
      } else {
        unimplementedChecks.add(checkName);
      }
    });

    const tag = result.status === 'pass' ? 'PASS' : result.status === 'fail' ? 'FAIL' : 'SKIP';
    console.log(
      `  [${tag}] ${vector.id}  (expected: ${vector.expected})  requirements: ${(vector.requirement_ids || []).join(', ') || '(none)'}`,
    );
    if (result.status !== 'pass') {
      result.details.forEach((detail) => console.log(indentLines(detail, '         ')));
    }

    for (const requirementId of vector.requirement_ids || []) {
      let bucket = requirementBuckets.get(requirementId);
      if (!bucket) {
        if (!manifestOnlyBuckets.has(requirementId)) {
          const manifestEntry = (manifest.entries || []).find((entry) => entry.id === requirementId);
          manifestOnlyBuckets.set(requirementId, {
            ...newBucket(),
            statement: manifestEntry ? manifestEntry.statement : '(id not found in normative manifest either)',
          });
        }
        bucket = manifestOnlyBuckets.get(requirementId);
      }
      recordInBucket(bucket, vector.id, result.status);
    }
  }

  console.log('');
  console.log('Per-requirement-id summary (cross-referenced against profiles/core-dp/requirements/core-dp-requirements.json):');
  console.log('');
  console.log(`${pad('REQUIREMENT ID', 38)}${pad('CLASS', 11)}${pad('VECTORS', 9)}${pad('PASS', 6)}${pad('FAIL', 6)}${pad('SKIP', 6)}NOTE`);
  for (const requirement of requirements.requirements) {
    const bucket = requirementBuckets.get(requirement.id);
    let note = '';
    if (bucket.total === 0) {
      note = `no vectors reference this requirement in the harness (${requirement.implementation_status}; per its testability_statement this is reviewable by inspection / a live backend test, not vector-testable here) — reported as not-exercised, not a pass`;
    } else if (bucket.fail > 0) {
      note = `FAILING: ${bucket.failing.join(', ')}`;
    } else if (bucket.skip > 0) {
      note = `SKIPPED: ${bucket.skipping.join(', ')}`;
    }
    console.log(
      `${pad(requirement.id, 38)}${pad(requirement.classification, 11)}${pad(bucket.total, 9)}${pad(bucket.pass, 6)}${pad(bucket.fail, 6)}${pad(bucket.skip, 6)}${note}`,
    );
  }

  if (manifestOnlyBuckets.size > 0) {
    console.log('');
    console.log('Requirement IDs referenced by vectors but NOT present in core-dp-requirements.json');
    console.log('(these come from the SPECIFICATION.md v0.2.0 normative manifest instead — shown here so no vector result is silently dropped):');
    console.log('');
    for (const [requirementId, bucket] of manifestOnlyBuckets.entries()) {
      console.log(`  ${requirementId}  vectors=${bucket.total} pass=${bucket.pass} fail=${bucket.fail} skip=${bucket.skip}`);
      console.log(`    manifest statement: ${bucket.statement}`);
    }
  }

  console.log('');
  console.log('Semantic checks registered in scripts/validate-schemas.js and their exercise status in this run:');
  for (const checkName of CORE_DP_SEMANTIC_CHECKS) {
    console.log(`  - ${checkName}${exercisedChecks.has(checkName) ? '' : '  (registered, but not exercised by any vector in this run)'}`);
  }

  if (unimplementedChecks.size > 0) {
    console.log('');
    console.log('Semantic checks declared by vectors but skipped (not implemented in this static harness — would require a live backend/database):');
    unimplementedChecks.forEach((checkName) => console.log(`  - ${checkName}`));
  } else {
    console.log('');
    console.log(
      'No semantic check required a live backend or database: every check declared by these vectors is a static, ' +
        'self-contained computation (signing-input hash recomputation, Ed25519 signature verification against the ' +
        'checked-in trust store fixture, replay-window/timestamp arithmetic, key lifecycle status, field cross-referencing).',
    );
  }

  console.log('');
  console.log(`Overall: ${suite.vectors.length} vectors -> ${overallPass} pass, ${overallFail} fail, ${overallSkip} skip`);
  console.log('');
  console.log(
    'Scope note: this harness checks vector/contract conformance only (schema shape plus each vector\'s own declared\n' +
      'semantic checks). It never makes live HTTP calls against localloop-backend. Requirements whose full real-world\n' +
      'conformance depends on live runtime behavior (e.g. actual DB-backed search pagination, a real capabilities-\n' +
      'handshake round trip over the network) are only exercised here at the level of wire-format/contract vectors,\n' +
      'not end-to-end — see profiles/core-dp/requirements/core-dp-requirements.json implementation_status/evidence_output\n' +
      'for what backs each requirement beyond this harness. Requirements with zero referencing vectors above are reported\n' +
      'as not-exercised-by-this-harness, never fabricated as a pass.',
  );

  if (overallFail > 0) {
    process.exitCode = 1;
  }
}

main();
