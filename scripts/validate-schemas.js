const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
  }
}

function formatErrors(errors) {
  if (!errors || errors.length === 0) {
    return 'No detailed errors reported.';
  }
  return errors
    .map((err) => {
      const dataPath = err.instancePath || '/';
      const keyword = err.keyword || 'validation';
      const message = err.message || 'failed';
      return `- ${dataPath} (${keyword}): ${message}`;
    })
    .join('\n');
}

function bestErrorFor(data, validators) {
  let best = null;
  for (const validator of validators) {
    validator(data);
    const errors = validator.errors || [];
    if (!best || errors.length < best.errors.length) {
      const schemaId = validator.schema && validator.schema.$id ? validator.schema.$id : 'unknown-schema';
      best = { schemaId, errors };
    }
  }
  return best;
}

function validatePayload(payload, validators, label, failures) {
  if (Array.isArray(payload)) {
    payload.forEach((item, index) => {
      validatePayload(item, validators, `${label}[${index}]`, failures);
    });
    return;
  }

  if (!payload || typeof payload !== 'object') {
    failures.push(`${label}: expected an object or array payload.`);
    return;
  }

  const valid = validators.some((validator) => validator(payload));
  if (!valid) {
    const best = bestErrorFor(payload, validators);
    const detail = best ? `\nBest match (${best.schemaId}):\n${formatErrors(best.errors)}` : '';
    failures.push(`${label}: did not match any schema.${detail}`);
  }
}

function main() {
  const schemaPaths = fg.sync(['schemas/*.schema.json']);
  const examplePaths = fg.sync(['examples/**/*.json']);

  if (schemaPaths.length === 0) {
    console.error('No schemas found in schemas/*.schema.json');
    process.exit(1);
  }

  if (examplePaths.length === 0) {
    console.error('No example JSON files found in examples/**/*.json');
    process.exit(1);
  }

  const ajv = new Ajv({ allErrors: true, strict: false, allowUnionTypes: true });
  addFormats(ajv);

  const validators = [];
  for (const schemaPath of schemaPaths) {
    const schema = loadJson(schemaPath);
    const schemaId = schema.$id || path.basename(schemaPath);
    ajv.addSchema(schema, schemaId);
    const validator = ajv.getSchema(schemaId);
    if (validator) {
      validators.push(validator);
    }
  }

  if (validators.length === 0) {
    console.error('Failed to load any schema validators.');
    process.exit(1);
  }

  const failures = [];
  for (const examplePath of examplePaths) {
    const payload = loadJson(examplePath);
    validatePayload(payload, validators, examplePath, failures);
  }

  if (failures.length > 0) {
    console.error('Schema validation failed:\n');
    for (const failure of failures) {
      console.error(failure);
    }
    process.exit(1);
  }

  console.log(`Validated ${examplePaths.length} example file(s) against ${validators.length} schema(s).`);
}

main();
