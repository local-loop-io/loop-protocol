#!/usr/bin/env node
'use strict';

/**
 * Shared runner for regulatory extension-guidance profile conformance harnesses
 * (profiles/{battery,packaging,waste-shipment}/conformance/run-conformance.js).
 *
 * These three profiles are extension guidance over the existing core v0.2.0 schemas, not
 * conformance profiles with their own envelope/choreography/signing machinery like Core-DP —
 * so unlike profiles/core-dp/conformance/run-conformance.js, there is no envelope body-schema
 * binding to check and no trust store. Each vector's payload is validated directly against
 * payload_schema (one of the core schemas/*.schema.json files), then any semantic_checks the
 * vector declares run against that profile's own small local check registry. This module does
 * not duplicate AJV setup: it requires scripts/validate-schemas.js and reuses its loadJson/
 * formatErrors/compileSchemas plumbing verbatim, exactly as Core-DP's harness does.
 */

const fg = require('fast-glob');
const { loadJson, formatErrors, compileSchemas } = require('../validate-schemas.js');

const CORE_SCHEMA_GLOB = 'schemas/*.schema.json';

function evaluateVector(vector, validators, semanticChecks) {
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

  for (const checkName of vector.semantic_checks || []) {
    const check = semanticChecks.get(checkName);
    if (!check) {
      skips.push(
        `semantic check "${checkName}" is not registered by this profile's run-conformance.js — ` +
          'vector reported as skipped rather than scored.',
      );
      continue;
    }
    try {
      failures.push(...check(vector.payload));
    } catch (error) {
      failures.push(`semantic check "${checkName}" threw: ${error.message}`);
    }
  }

  // As in Core-DP's harness: a real failure always outranks a skip. Skip only means "one of
  // the declared checks wasn't registered," never "there was no failure."
  if (skips.length > 0 && failures.length === 0) {
    return { status: 'skip', details: skips };
  }

  const skipNote =
    skips.length > 0
      ? [`Note: this vector also declared ${skips.length} unregistered semantic check(s), not evaluated:`, ...skips]
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

/**
 * config: {
 *   profileLabel: string (e.g. "Battery"),
 *   vectorsPath: string,
 *   requirementsPath: string,
 *   semanticChecks: Map<string, (payload) => string[]>,
 * }
 */
function runProfileConformance(config) {
  const schemaPaths = fg.sync([CORE_SCHEMA_GLOB]);
  const validators = new Map();
  const schemaIds = new Set();
  const schemaById = new Map();
  const setupFailures = [];

  compileSchemas(schemaPaths, validators, schemaIds, schemaById, setupFailures);

  if (setupFailures.length > 0 || validators.size === 0) {
    console.error(`Failed to set up AJV validators for the ${config.profileLabel} conformance run:\n`);
    setupFailures.forEach((failure) => console.error(failure));
    process.exit(1);
  }

  let requirements;
  let suite;
  try {
    requirements = loadJson(config.requirementsPath);
    suite = loadJson(config.vectorsPath);
  } catch (error) {
    console.error(`Failed to load conformance inputs: ${error.message}`);
    process.exit(1);
  }

  const title = `${config.profileLabel} Extension-Guidance Conformance Harness`;
  console.log(title);
  console.log('='.repeat(title.length));
  console.log(`Suite:            ${suite.suite}`);
  console.log(`Vectors:          ${suite.vectors.length}`);
  console.log(`Schemas compiled: ${schemaPaths.length} core`);
  console.log('');
  console.log(
    "Scope note: this harness checks profile-specific claims only — this profile's documented\n" +
      'field-usage patterns against the core v0.2.0 schemas — not full LOOP conformance (see\n' +
      'profiles/core-dp/ for the lab conformance profile covering envelope/choreography/DNA-search\n' +
      'machinery) and not a regulatory-compliance claim (see docs/governance/CLAIMS-AND-MATURITY.md).',
  );
  console.log('');
  console.log('Per-vector results:');

  const requirementBuckets = new Map(requirements.requirements.map((requirement) => [requirement.id, newBucket()]));

  let overallPass = 0;
  let overallFail = 0;
  let overallSkip = 0;
  const exercisedChecks = new Set();

  for (const vector of suite.vectors) {
    let result;
    try {
      result = evaluateVector(vector, validators, config.semanticChecks);
    } catch (error) {
      result = { status: 'fail', details: [`harness threw while evaluating vector: ${error.message}`] };
    }

    if (result.status === 'pass') overallPass += 1;
    else if (result.status === 'fail') overallFail += 1;
    else overallSkip += 1;

    (vector.semantic_checks || []).forEach((checkName) => {
      if (config.semanticChecks.has(checkName)) exercisedChecks.add(checkName);
    });

    const tag = result.status === 'pass' ? 'PASS' : result.status === 'fail' ? 'FAIL' : 'SKIP';
    console.log(
      `  [${tag}] ${vector.id}  (expected: ${vector.expected})  requirements: ${(vector.requirement_ids || []).join(', ') || '(none)'}`,
    );
    if (result.status !== 'pass') {
      result.details.forEach((detail) => console.log(indentLines(detail, '         ')));
    }

    for (const requirementId of vector.requirement_ids || []) {
      const bucket = requirementBuckets.get(requirementId);
      if (!bucket) {
        console.log(
          `  WARNING: vector ${vector.id} references unknown requirement id ${requirementId} (not present in ${config.requirementsPath})`,
        );
        continue;
      }
      recordInBucket(bucket, vector.id, result.status);
    }
  }

  console.log('');
  console.log(`Per-requirement-id summary (cross-referenced against ${config.requirementsPath}):`);
  console.log('');
  console.log(`${pad('REQUIREMENT ID', 42)}${pad('VECTORS', 9)}${pad('PASS', 6)}${pad('FAIL', 6)}${pad('SKIP', 6)}NOTE`);
  for (const requirement of requirements.requirements) {
    const bucket = requirementBuckets.get(requirement.id);
    let note = '';
    if (bucket.total === 0) {
      note = 'no vectors reference this requirement — reported as not-exercised, not a pass';
    } else if (bucket.fail > 0) {
      note = `FAILING: ${bucket.failing.join(', ')}`;
    } else if (bucket.skip > 0) {
      note = `SKIPPED: ${bucket.skipping.join(', ')}`;
    }
    console.log(
      `${pad(requirement.id, 42)}${pad(bucket.total, 9)}${pad(bucket.pass, 6)}${pad(bucket.fail, 6)}${pad(bucket.skip, 6)}${note}`,
    );
  }

  console.log('');
  console.log("Semantic checks registered by this profile and their exercise status in this run:");
  for (const checkName of config.semanticChecks.keys()) {
    console.log(`  - ${checkName}${exercisedChecks.has(checkName) ? '' : '  (registered, but not exercised by any vector in this run)'}`);
  }

  console.log('');
  console.log(`Overall: ${suite.vectors.length} vectors -> ${overallPass} pass, ${overallFail} fail, ${overallSkip} skip`);

  if (overallFail > 0) {
    process.exitCode = 1;
  }
}

module.exports = { runProfileConformance };
