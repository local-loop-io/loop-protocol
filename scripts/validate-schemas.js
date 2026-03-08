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

function inferSchemaName(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }

  const schemaMap = {
    MaterialDNA: 'material-dna.schema.json',
    ProductDNA: 'product-dna.schema.json',
    Offer: 'offer.schema.json',
    Match: 'match.schema.json',
    Transfer: 'transfer.schema.json',
    MaterialStatusUpdate: 'material-status.schema.json',
    NodeHandshake: 'handshake.schema.json',
    NodeHandshakeResponse: 'handshake.schema.json',
    LoopCoinTransfer: 'loopcoin.schema.json',
    LoopCoinConfig: 'loopcoin.schema.json',
    LoopSignalConfig: 'loopsignal.schema.json',
    LoopVote: 'loopsignal.schema.json',
    LoopSignalHistory: 'loopsignal.schema.json',
    MaterialTransaction: 'transaction.schema.json',
    Settlement: 'transaction.schema.json',
    TransactionStatus: 'transaction.schema.json',
    NodeInfo: 'node-info.schema.json',
    NodeRegistry: 'node-info.schema.json',
    CapabilityAdvertisement: 'node-info.schema.json',
  };

  const type = payload['@type'];
  return typeof type === 'string' ? schemaMap[type] || null : null;
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

  const schemaName = inferSchemaName(payload);
  if (!schemaName) {
    failures.push(`${label}: could not infer schema from @type.`);
    return;
  }

  const validator = validators.get(schemaName);
  if (!validator) {
    failures.push(`${label}: missing validator for ${schemaName}.`);
    return;
  }

  const valid = validator(payload);
  if (!valid) {
    failures.push(
      `${label}: did not match ${schemaName}.\n${formatErrors(validator.errors || [])}`,
    );
  }
}

function assertOpenApiRefsResolve(openApiPath, schemaIds) {
  const openApi = loadJson(openApiPath);
  const failures = [];

  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== 'object') {
      return;
    }
    if (
      typeof value.$ref === 'string' &&
      value.$ref.startsWith('https://local-loop-io.github.io/projects/loop-protocol/schemas/') &&
      !schemaIds.has(value.$ref)
    ) {
      failures.push(`Unresolved OpenAPI schema ref: ${value.$ref}`);
    }
    Object.values(value).forEach(visit);
  };

  visit(openApi);
  return failures;
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

  const validators = new Map();
  const schemaIds = new Set();
  for (const schemaPath of schemaPaths) {
    const schema = loadJson(schemaPath);
    const schemaId = schema.$id || path.basename(schemaPath);
    ajv.addSchema(schema, schemaId);
    const validator = ajv.getSchema(schemaId);
    if (validator) {
      validators.set(path.basename(schemaPath), validator);
      schemaIds.add(schemaId);
    }
  }

  if (validators.size === 0) {
    console.error('Failed to load any schema validators.');
    process.exit(1);
  }

  const failures = [];
  for (const examplePath of examplePaths) {
    const payload = loadJson(examplePath);
    validatePayload(payload, validators, examplePath, failures);
  }

  failures.push(...assertOpenApiRefsResolve('openapi.json', schemaIds));

  if (failures.length > 0) {
    console.error('Schema validation failed:\n');
    for (const failure of failures) {
      console.error(failure);
    }
    process.exit(1);
  }

  console.log(`Validated ${examplePaths.length} example file(s) against ${validators.size} schema(s).`);
}

main();
