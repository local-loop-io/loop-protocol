const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const fg = require('fast-glob');
const Ajv = require('ajv');
const Ajv2020 = require('ajv/dist/2020');
const draft7MetaSchema = require('ajv/dist/refs/json-schema-draft-07.json');
const addFormats = require('ajv-formats');

const CORE_DP_PROFILE_VERSION = '0.1.0-lab';
const NORMATIVE_KEYWORDS = [
  'MUST NOT',
  'SHALL NOT',
  'SHOULD NOT',
  'REQUIRED',
  'RECOMMENDED',
  'OPTIONAL',
  'MUST',
  'SHALL',
  'SHOULD',
  'MAY',
];
const TERMINAL_CORE_DP_STATES = new Set([
  'capabilities-confirmed',
  'offer-acked',
  'offer-rejected',
  'match-accepted',
  'match-rejected',
  'transfer-acked',
  'timed-out',
  'partitioned',
]);
const CORE_DP_SEARCH_CONTRACT_SCHEMA_ID =
  'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/search-contract.schema.json';
const CORE_DP_SEARCH_REQUEST_REF = `${CORE_DP_SEARCH_CONTRACT_SCHEMA_ID}#/$defs/searchRequest`;
const CORE_DP_SEARCH_RESPONSE_REF = `${CORE_DP_SEARCH_CONTRACT_SCHEMA_ID}#/$defs/searchResponse`;
const CORE_DP_BODY_SCHEMA_BY_MESSAGE_TYPE = {
  'capabilities.announce': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/choreography-message.schema.json',
  'capabilities.response': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/choreography-message.schema.json',
  'material.register': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/dna-operation.schema.json',
  'material.read': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/dna-operation.schema.json',
  'material.search': CORE_DP_SEARCH_CONTRACT_SCHEMA_ID,
  'product.register': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/dna-operation.schema.json',
  'product.read': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/dna-operation.schema.json',
  'product.search': CORE_DP_SEARCH_CONTRACT_SCHEMA_ID,
  'offer.publish': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/choreography-message.schema.json',
  'offer.ack': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/choreography-message.schema.json',
  'offer.reject': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/choreography-message.schema.json',
  'match.propose': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/choreography-message.schema.json',
  'match.accept': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/choreography-message.schema.json',
  'match.reject': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/choreography-message.schema.json',
  'transfer.dispatch': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/choreography-message.schema.json',
  'transfer.receive': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/choreography-message.schema.json',
  'transfer.ack': 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/choreography-message.schema.json',
  error: 'https://localloop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/error.schema.json',
};
const CORE_DP_CHOREOGRAPHY_RULES = {
  'capabilities.announce': {
    subjectType: 'capabilities',
    state: 'announced',
    terminal: false,
    authorRole: 'origin',
    authoritativeRole: 'origin',
  },
  'capabilities.response': {
    subjectType: 'capabilities',
    state: 'capabilities-confirmed',
    terminal: true,
    authorRole: 'counterparty',
    authoritativeRole: 'counterparty',
  },
  'offer.publish': {
    subjectType: 'offer',
    state: 'offer-published',
    terminal: false,
    authorRole: 'origin',
    authoritativeRole: 'origin',
  },
  'offer.ack': {
    subjectType: 'offer',
    state: 'offer-acked',
    previousState: 'offer-published',
    terminal: true,
    authorRole: 'counterparty',
    authoritativeRole: 'counterparty',
  },
  'offer.reject': {
    subjectType: 'offer',
    state: 'offer-rejected',
    previousState: 'offer-published',
    terminal: true,
    authorRole: 'counterparty',
    authoritativeRole: 'counterparty',
  },
  'match.propose': {
    subjectType: 'match',
    state: 'match-proposed',
    terminal: false,
    authorRole: 'origin',
    authoritativeRole: 'origin',
  },
  'match.accept': {
    subjectType: 'match',
    state: 'match-accepted',
    previousState: 'match-proposed',
    terminal: true,
    authorRole: 'counterparty',
    authoritativeRole: 'counterparty',
  },
  'match.reject': {
    subjectType: 'match',
    state: 'match-rejected',
    previousState: 'match-proposed',
    terminal: true,
    authorRole: 'counterparty',
    authoritativeRole: 'counterparty',
  },
  'transfer.dispatch': {
    subjectType: 'transfer',
    state: 'transfer-dispatched',
    terminal: false,
    authorRole: 'origin',
    authoritativeRole: 'origin',
  },
  'transfer.receive': {
    subjectType: 'transfer',
    state: 'transfer-received',
    previousState: 'transfer-dispatched',
    terminal: false,
    authorRole: 'counterparty',
    authoritativeRole: 'counterparty',
  },
  'transfer.ack': {
    subjectType: 'transfer',
    state: 'transfer-acked',
    previousState: 'transfer-received',
    terminal: true,
    authorRole: 'origin',
    authoritativeRole: 'origin',
  },
};
const CORE_DP_SEMANTIC_CHECKS = new Set([
  'core-dp-envelope-signing-input-sha256',
  'core-dp-envelope-ed25519-signature',
  'core-dp-envelope-trusted-key-resolution',
  'core-dp-envelope-body-contract',
  'core-dp-envelope-replay-window',
  'core-dp-dna-operation-contract',
  'core-dp-search-contract-semantics',
  'core-dp-error-contract-semantics',
  'core-dp-epcis-mapping-semantics',
  'core-dp-evidence-immutable-subset',
  'core-dp-choreography-message-contract',
  'core-dp-choreography-terminal-regression',
  'core-dp-choreography-idempotency-retry',
  'core-dp-choreography-stale-reordered',
  'core-dp-choreography-transfer-convergence',
]);
const CORE_DP_REQUIRED_POSITIVE_COVERAGE_TAGS = new Set([
  'positive:material-dna-register-request',
  'positive:product-dna-read-result',
  'positive:material-search-local',
  'positive:product-search-cross-node-request',
  'positive:product-search-cross-node-response',
  'positive:offer-authority',
  'positive:match-authority',
  'positive:transfer-authority',
  'positive:retry-duplicate-stored-result',
  'positive:transfer-final-convergence',
]);

function assertNoDuplicateJsonKeys(raw, filePath) {
  const stack = [];
  let index = 0;
  let expectingKey = false;

  const fail = (message) => {
    throw new Error(`Invalid JSON in ${filePath}: ${message}`);
  };

  const skipWhitespace = () => {
    while (/\s/.test(raw[index] || '')) {
      index += 1;
    }
  };

  const parseString = () => {
    let value = '';
    index += 1;
    while (index < raw.length) {
      const char = raw[index];
      if (char === '"') {
        index += 1;
        return value;
      }
      if (char === '\\') {
        const escape = raw[index + 1];
        if (escape === 'u') {
          const hex = raw.slice(index + 2, index + 6);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
            fail(`invalid unicode escape near offset ${index}`);
          }
          value += String.fromCharCode(parseInt(hex, 16));
          index += 6;
          continue;
        }
        const escapes = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' };
        if (!Object.prototype.hasOwnProperty.call(escapes, escape)) {
          fail(`invalid string escape near offset ${index}`);
        }
        value += escapes[escape];
        index += 2;
        continue;
      }
      value += char;
      index += 1;
    }
    fail(`unterminated string near offset ${index}`);
  };

  while (index < raw.length) {
    skipWhitespace();
    const char = raw[index];
    if (char === undefined) {
      break;
    }

    if (char === '"') {
      const value = parseString();
      if (expectingKey) {
        const current = stack[stack.length - 1];
        skipWhitespace();
        if (raw[index] === ':') {
          if (current.keys.has(value)) {
            fail(`duplicate key "${value}"`);
          }
          current.keys.add(value);
          index += 1;
          expectingKey = false;
        }
      }
      continue;
    }

    if (char === '{') {
      stack.push({ type: 'object', keys: new Set() });
      index += 1;
      skipWhitespace();
      expectingKey = raw[index] !== '}';
      continue;
    }

    if (char === '}') {
      if (stack.pop()?.type !== 'object') {
        fail(`unexpected } near offset ${index}`);
      }
      index += 1;
      expectingKey = false;
      continue;
    }

    if (char === '[') {
      stack.push({ type: 'array' });
      index += 1;
      expectingKey = false;
      continue;
    }

    if (char === ']') {
      if (stack.pop()?.type !== 'array') {
        fail(`unexpected ] near offset ${index}`);
      }
      index += 1;
      expectingKey = false;
      continue;
    }

    if (char === ',') {
      index += 1;
      skipWhitespace();
      expectingKey = stack[stack.length - 1]?.type === 'object' && raw[index] !== '}';
      continue;
    }

    index += 1;
  }
}

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    assertNoDuplicateJsonKeys(raw, filePath);
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

function makeAjv(AjvCtor = Ajv) {
  const ajv = new AjvCtor({ allErrors: true, strict: false, allowUnionTypes: true });
  addFormats(ajv);
  return ajv;
}

function canonicalJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function coreDpEnvelopeSigningInput(payload) {
  return {
    profile: payload.profile,
    profile_version: payload.profile_version,
    message_id: payload.message_id,
    message_type: payload.message_type,
    created_at: payload.created_at,
    expires_at: payload.expires_at,
    sender: payload.sender,
    receiver: payload.receiver,
    idempotency_key: payload.idempotency_key,
    body_schema: payload.body_schema,
    body: payload.body,
  };
}

function normalizeNormativeStatement(line) {
  return line
    .trim()
    .replace(/^>\s+/, '')
    .replace(/^-\s+/, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\u2014/g, '-')
    .replace(/\u2192/g, '->')
    .replace(/\s+/g, ' ');
}

function slugifyHeading(heading) {
  return heading
    .replace(/^#+\s+/, '')
    .trim()
    .toLowerCase()
    .replace(/[.]/g, '')
    .replace(/\//g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function countKeywordOccurrences(statement) {
  const counts = new Map();
  let masked = statement;

  for (const keyword of ['MUST NOT', 'SHALL NOT', 'SHOULD NOT']) {
    const pattern = new RegExp(`\\b${keyword.replace(' ', '\\s+')}\\b`, 'g');
    const matches = masked.match(pattern) || [];
    if (matches.length > 0) {
      counts.set(keyword, matches.length);
      masked = masked.replace(pattern, ' ');
    }
  }

  for (const keyword of ['REQUIRED', 'RECOMMENDED', 'OPTIONAL', 'MUST', 'SHALL', 'SHOULD', 'MAY']) {
    const pattern = new RegExp(`\\b${keyword}\\b`, 'g');
    const matches = masked.match(pattern) || [];
    if (matches.length > 0) {
      counts.set(keyword, matches.length);
    }
  }

  return NORMATIVE_KEYWORDS.flatMap((keyword) =>
    Array.from({ length: counts.get(keyword) || 0 }, () => keyword),
  );
}

function extractNormativeEntries(specPath) {
  const lines = fs.readFileSync(specPath, 'utf8').split('\n');
  const entries = [];
  let currentAnchor = '';

  lines.forEach((line, index) => {
    if (/^#{2,6}\s+/.test(line)) {
      currentAnchor = slugifyHeading(line);
    }

    const statement = normalizeNormativeStatement(line);
    if (!statement) {
      return;
    }

    for (const keyword of countKeywordOccurrences(statement)) {
      entries.push({
        keyword,
        source_path: specPath,
        source_line: index + 1,
        source_anchor: currentAnchor,
        statement,
      });
    }
  });

  return entries;
}

// Schemas without a JSON-LD @type wrapper can't be dispatched by the @type
// map below. Today that's only federate-accepted.schema.json: it models a
// plain REST 202 response body (`{status, id}` — see the real backend send
// site in localloop-backend/src/routes/federate.ts), not a LOOP domain
// object, so it intentionally has no @context/@type properties. Its example
// is dispatched by filename instead.
const FILENAME_SCHEMA_MAP = {
  '16-federate-accepted-response.json': 'federate-accepted.schema.json',
};

function inferSchemaName(payload, examplePath) {
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
    FederateAcceptedResponse: 'federate-accepted.schema.json',
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
  if (typeof type === 'string' && schemaMap[type]) {
    return schemaMap[type];
  }

  const basename = examplePath ? path.basename(examplePath) : undefined;
  return (basename && FILENAME_SCHEMA_MAP[basename]) || null;
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

  const schemaName = inferSchemaName(payload, label);
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

function compileSchemas(schemaPaths, validators, schemaIds, schemaById, failures) {
  const draft07Ajv = makeAjv(Ajv);
  const draft2020Ajv = makeAjv(Ajv2020);
  draft2020Ajv.addMetaSchema(draft7MetaSchema);
  const schemaRecords = schemaPaths.map((schemaPath) => {
    const schema = loadJson(schemaPath);
    return {
      schemaPath,
      schema,
      schemaId: schema.$id || schemaPath,
      isDraft2020: Boolean(schema.$schema && schema.$schema.includes('2020-12')),
    };
  });

  for (const { schemaPath, schema, schemaId, isDraft2020 } of schemaRecords) {
    try {
      if (!isDraft2020) {
        draft07Ajv.addSchema(schema, schemaId);
      }
      draft2020Ajv.addSchema(schema, schemaId);
      schemaIds.add(schemaId);
      schemaById.set(schemaId, schema);
    } catch (error) {
      failures.push(`${schemaPath}: failed to register schema: ${error.message}`);
    }
  }

  for (const { schemaPath, schemaId, isDraft2020 } of schemaRecords) {
    const ajv = isDraft2020 ? draft2020Ajv : draft07Ajv;
    try {
      const validator = ajv.getSchema(schemaId);
      if (!validator) {
        failures.push(`Failed to load schema validator: ${schemaPath}`);
        continue;
      }
      validators.set(schemaPath, validator);
      validators.set(path.basename(schemaPath), validator);
      validators.set(schemaId, validator);
    } catch (error) {
      failures.push(`${schemaPath}: failed to compile schema: ${error.message}`);
    }
  }
}

function decodeJsonPointerSegment(segment) {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

function resolveJsonPointer(root, pointer) {
  if (pointer === '' || pointer === '/') {
    return root;
  }
  if (!pointer.startsWith('/')) {
    return undefined;
  }

  return pointer
    .slice(1)
    .split('/')
    .map(decodeJsonPointerSegment)
    .reduce((value, segment) => {
      if (value === undefined || value === null || typeof value !== 'object') {
        return undefined;
      }
      return value[segment];
    }, root);
}

function localSchemaRefResolves(ref, schemaIds, schemaById) {
  const [baseId, fragment] = ref.split('#');
  if (!fragment && schemaIds.has(ref)) {
    return true;
  }
  if (!schemaIds.has(baseId)) {
    return false;
  }
  if (!fragment) {
    return true;
  }
  return resolveJsonPointer(schemaById.get(baseId), fragment) !== undefined;
}

function assertOpenApiRefsResolve(openApiPath, schemaIds, schemaById) {
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
      value.$ref.startsWith('https://localloop.urbnia.com/projects/loop-protocol/') &&
      !localSchemaRefResolves(value.$ref, schemaIds, schemaById)
    ) {
      failures.push(`Unresolved OpenAPI schema ref: ${value.$ref}`);
    }
    Object.values(value).forEach(visit);
  };

  visit(openApi);

  const productSearchOperation = openApi.paths?.['/api/v1/product/search']?.post;
  const productSearchRequestRef =
    productSearchOperation?.requestBody?.content?.['application/json']?.schema?.$ref;
  const productSearchResponseRef =
    productSearchOperation?.responses?.['200']?.content?.['application/json']?.schema?.$ref;

  if (productSearchRequestRef !== CORE_DP_SEARCH_REQUEST_REF) {
    failures.push(`Product search request must ref exact Core-DP searchRequest definition: ${CORE_DP_SEARCH_REQUEST_REF}`);
  }
  if (productSearchResponseRef !== CORE_DP_SEARCH_RESPONSE_REF) {
    failures.push(`Product search response must ref exact Core-DP searchResponse definition: ${CORE_DP_SEARCH_RESPONSE_REF}`);
  }
  const securitySchemes = openApi.components?.securitySchemes || {};
  const expectedNodeSignatureSchemes = {
    NodeSignature: 'X-Node-Signature',
    NodeKeyId: 'X-Node-Key-Id',
    NodeSignatureInputSHA256: 'X-Node-Signature-Input-SHA256',
  };
  for (const [schemeName, headerName] of Object.entries(expectedNodeSignatureSchemes)) {
    const scheme = securitySchemes[schemeName];
    if (scheme?.type !== 'apiKey' || scheme.in !== 'header' || scheme.name !== headerName) {
      failures.push(`OpenAPI must define ${schemeName} apiKey security scheme on ${headerName}.`);
    }
  }

  const productSearchSecurity = JSON.stringify(productSearchOperation?.security || []);
  const expectedProductSearchSecurity = JSON.stringify([
    {},
    { BearerAuth: [] },
    { NodeSignature: [], NodeKeyId: [], NodeSignatureInputSHA256: [] },
  ]);
  if (productSearchSecurity !== expectedProductSearchSecurity) {
    failures.push('Product search security must be exactly public-lab, BearerAuth, or all node-signature headers as one AND alternative.');
  }

  const productSearchPartialHeaderParameters = (productSearchOperation?.parameters || [])
    .filter((parameter) => parameter.in === 'header' && /^X-Node-/.test(parameter.name || ''));
  if (productSearchPartialHeaderParameters.length > 0) {
    failures.push('Product search must not declare optional X-Node-* header parameters; node-signature headers are modeled as an AND security requirement.');
  }

  return failures;
}

function assertProfileContractLocationsExist(profileRoot, manifest, coreRequirements) {
  const failures = [];
  const locations = [
    ...manifest.entries.map((entry) => entry.contract_location),
    ...coreRequirements.requirements.map((requirement) => requirement.contract_location),
  ];

  for (const location of locations) {
    if (!location || typeof location !== 'string') {
      failures.push('Core-DP requirement has an empty contract_location.');
      continue;
    }

    const [contractPath, fragment] = location.split('#');
    if (contractPath && !fs.existsSync(contractPath)) {
      failures.push(`Core-DP contract_location path does not exist: ${location}`);
      continue;
    }

    if (fragment && fragment.length > 0 && contractPath.endsWith('.md')) {
      const markdown = fs.readFileSync(contractPath, 'utf8');
      if (!markdown.split('\n').some((line) => /^#{1,6}\s+/.test(line) && slugifyHeading(line) === fragment)) {
        failures.push(`Core-DP contract_location anchor does not exist: ${location}`);
      }
    }
  }

  if (!fs.existsSync(profileRoot)) {
    failures.push(`Core-DP profile root is missing: ${profileRoot}`);
  }

  return failures;
}

function manifestConceptKeys(entry) {
  const statement = normalizeNormativeStatement(entry.statement || '').toLowerCase();
  const concepts = [];

  if (
    statement.includes('productdna') &&
    statement.includes('material_ids') &&
    (
      statement.includes('composition link') ||
      statement.includes('composition') ||
      statement.includes('constituent materials')
    )
  ) {
    concepts.push('productdna-material-composition');
  }
  if (statement.includes('productdna') && statement.includes('offer') && statement.includes('match') && statement.includes('transfer')) {
    concepts.push('productdna-offer-match-transfer');
  }
  if (
    (
      statement.includes('vc') ||
      statement.includes('did') ||
      statement.includes('digital product passport') ||
      statement.includes('dpp') ||
      (
        statement.includes('passport') &&
        statement.includes('classification') &&
        statement.includes('traceability')
      )
    ) &&
    !statement.includes('material_ids') &&
    !statement.includes('offer -> match -> transfer')
  ) {
    concepts.push('external-dpp-vc-did-profile-validation');
  }

  return concepts;
}

function assertManifestClassificationConsistency(manifestPath, manifest) {
  const failures = [];
  const byStatement = new Map();
  const byConcept = new Map();
  const requiredConceptClassifications = {
    'productdna-material-composition': 'IN',
    'productdna-offer-match-transfer': 'IN',
    'external-dpp-vc-did-profile-validation': 'DEFERRED',
  };

  for (const entry of manifest.entries || []) {
    const normalizedStatement = normalizeNormativeStatement(entry.statement || '').toLowerCase();
    if (!byStatement.has(normalizedStatement)) {
      byStatement.set(normalizedStatement, new Map());
    }
    const statementClassifications = byStatement.get(normalizedStatement);
    statementClassifications.set(entry.classification, [
      ...(statementClassifications.get(entry.classification) || []),
      entry.id,
    ]);

    for (const concept of manifestConceptKeys(entry)) {
      if (!byConcept.has(concept)) {
        byConcept.set(concept, new Map());
      }
      const conceptClassifications = byConcept.get(concept);
      conceptClassifications.set(entry.classification, [
        ...(conceptClassifications.get(entry.classification) || []),
        entry.id,
      ]);

      const requiredClassification = requiredConceptClassifications[concept];
      if (requiredClassification && entry.classification !== requiredClassification) {
        failures.push(
          `${manifestPath}: ${entry.id} classifies ${concept} as ${entry.classification}; expected ${requiredClassification}.`,
        );
      }
    }
  }

  for (const [normalizedStatement, classifications] of byStatement.entries()) {
    if (classifications.size > 1) {
      const entries = Array.from(classifications.entries())
        .map(([classification, ids]) => `${classification}: ${ids.join(', ')}`)
        .join('; ');
      failures.push(`${manifestPath}: contradictory classification for normalized statement "${normalizedStatement}": ${entries}`);
    }
  }

  for (const [concept, classifications] of byConcept.entries()) {
    if (concept === 'external-dpp-vc-did-profile-validation') {
      continue;
    }
    if (classifications.size > 1) {
      const entries = Array.from(classifications.entries())
        .map(([classification, ids]) => `${classification}: ${ids.join(', ')}`)
        .join('; ');
      failures.push(`${manifestPath}: contradictory classification for normalized concept ${concept}: ${entries}`);
    }
  }

  return failures;
}

function assertNormativeManifestMatchesSpec(specPath, manifestPath) {
  const manifest = loadJson(manifestPath);
  const extracted = extractNormativeEntries(specPath);
  const failures = [];

  if (manifest.pinned_specification?.path !== specPath) {
    failures.push(
      `${manifestPath}: pinned specification path must be ${specPath}, got ${manifest.pinned_specification?.path}`,
    );
  }

  if (manifest.normative_statement_count !== extracted.length) {
    failures.push(
      `${manifestPath}: normative_statement_count ${manifest.normative_statement_count} does not match extracted count ${extracted.length}.`,
    );
  }

  if (!Array.isArray(manifest.entries) || manifest.entries.length !== extracted.length) {
    failures.push(
      `${manifestPath}: manifest entries length ${manifest.entries?.length || 0} does not match extracted count ${extracted.length}.`,
    );
  }

  const ids = new Set();
  (manifest.entries || []).forEach((entry, index) => {
    const expected = extracted[index];
    if (!expected) {
      return;
    }

    for (const field of [
      'id',
      'keyword',
      'source_path',
      'source_line',
      'source_anchor',
      'statement_hash',
      'statement',
      'classification',
      'rationale',
      'contract_location',
      'implementation_status',
      'test_status',
    ]) {
      if (entry[field] === undefined || entry[field] === '') {
        failures.push(`${manifestPath}: entry ${index} is missing ${field}.`);
      }
    }

    const tupleFailures = [];
    for (const [field, value] of Object.entries(expected)) {
      if (entry[field] !== value) {
        tupleFailures.push(`${field} expected ${JSON.stringify(value)} got ${JSON.stringify(entry[field])}`);
      }
    }
    if (tupleFailures.length > 0) {
      failures.push(`${manifestPath}: entry ${index} does not match extracted SPECIFICATION.md clause: ${tupleFailures.join('; ')}`);
    }

    if (ids.has(entry.id)) {
      failures.push(`${manifestPath}: duplicate requirement id ${entry.id}.`);
    }
    ids.add(entry.id);

    if (!/^[a-f0-9]{64}$/.test(entry.statement_hash || '')) {
      failures.push(`${manifestPath}: ${entry.id} has invalid statement_hash format.`);
    } else if (
      !entry.id.endsWith(entry.statement_hash.slice(0, 12).toUpperCase()) &&
      !entry.id.endsWith(`${entry.statement_hash.slice(0, 12).toUpperCase()}-2`)
    ) {
      failures.push(`${manifestPath}: ${entry.id} does not carry the statement_hash prefix.`);
    }
  });

  failures.push(...assertManifestClassificationConsistency(manifestPath, manifest));

  return { failures, manifest };
}

function assertCoreDpRequirements(coreRequirementsPath, manifest, profileReadmePath) {
  const coreRequirements = loadJson(coreRequirementsPath);
  const failures = [];
  const requirementIds = new Set();
  const allowedClassifications = new Set(['IN', 'OUT', 'DEFERRED']);

  if (coreRequirements.profile !== 'core-dp') {
    failures.push(`${coreRequirementsPath}: profile must be core-dp.`);
  }
  if (coreRequirements.profile_version !== CORE_DP_PROFILE_VERSION) {
    failures.push(`${coreRequirementsPath}: profile_version must be ${CORE_DP_PROFILE_VERSION}.`);
  }
  if (coreRequirements.base_specification?.path !== manifest.pinned_specification?.path) {
    failures.push(`${coreRequirementsPath}: base specification must match normative manifest pin.`);
  }

  for (const requirement of coreRequirements.requirements || []) {
    if (requirementIds.has(requirement.id)) {
      failures.push(`${coreRequirementsPath}: duplicate requirement id ${requirement.id}.`);
    }
    requirementIds.add(requirement.id);

    if (!allowedClassifications.has(requirement.classification)) {
      failures.push(`${coreRequirementsPath}: ${requirement.id} has invalid classification ${requirement.classification}.`);
    }

    if (!requirement.summary || !requirement.contract_location) {
      failures.push(`${coreRequirementsPath}: ${requirement.id} needs summary and contract_location.`);
    }
  }

  const profileReadme = fs.readFileSync(profileReadmePath, 'utf8');
  if (!profileReadme.includes(`**Profile version:** \`${CORE_DP_PROFILE_VERSION}\``)) {
    failures.push(`${profileReadmePath}: profile version marker is missing or stale.`);
  }
  if (!normalizeNormativeStatement(profileReadme).includes('not full LOOP conformance')) {
    failures.push(`${profileReadmePath}: lab-only non-full-conformance disclaimer is missing.`);
  }

  return { failures, coreRequirements, requirementIds };
}

function expectedNodeForRole(payload, role) {
  if (role === 'origin') {
    return payload.origin_node;
  }
  if (role === 'counterparty') {
    return payload.counterparty_node;
  }
  return undefined;
}

function validateDnaOperationContract(payload) {
  const failures = [];
  const messageEntityType = payload.message_type?.startsWith('material.') ? 'material' : 'product';
  const expectedOperationKind = payload.message_type?.endsWith('.register') ? 'register' : 'read';
  const actualOperationKind = payload.operation?.startsWith('register_') ? 'register' : 'read';
  const recordIdPattern = messageEntityType === 'material'
    ? /^MAT-[A-Z]{2}-[A-Z]{3}-\d{4}-[A-Z]+-[A-Z0-9]{6,}$/
    : /^PRD-[A-Z0-9-]{8,}$/;

  if (actualOperationKind !== expectedOperationKind) {
    failures.push(`DNA operation ${payload.operation} does not match message_type ${payload.message_type}.`);
  }
  if (payload.entity_type !== messageEntityType) {
    failures.push(`DNA operation entity_type ${payload.entity_type} does not match message_type ${payload.message_type}.`);
  }
  if (payload.record_id && !recordIdPattern.test(payload.record_id)) {
    failures.push(`DNA operation record_id ${payload.record_id} does not match ${payload.entity_type} id pattern.`);
  }
  if (payload.record?.id && payload.record_id && payload.record.id !== payload.record_id) {
    failures.push('DNA operation record_id must match record.id.');
  }
  if (payload.record?.['@type']) {
    const expectedType = payload.entity_type === 'material' ? 'MaterialDNA' : 'ProductDNA';
    if (payload.record['@type'] !== expectedType) {
      failures.push(`DNA operation record @type must be ${expectedType}.`);
    }
  }
  if (payload.operation === 'read_result' && payload.result?.status === 'found' && !payload.record) {
    failures.push('DNA operation read_result with found status must include the record.');
  }
  if (payload.operation === 'read_result' && ['not_found', 'error'].includes(payload.result?.status) && payload.record) {
    failures.push(`DNA operation read_result status ${payload.result.status} must not include a record.`);
  }
  if (payload.result?.status && ['invalid', 'conflict', 'error', 'not_found'].includes(payload.result.status)) {
    if (!Array.isArray(payload.result.errors) || payload.result.errors.length === 0) {
      failures.push(`DNA operation result status ${payload.result.status} must include Core-DP error details.`);
    }
  }
  if (payload.result?.status && ['registered', 'found'].includes(payload.result.status) && payload.result.errors) {
    failures.push(`DNA operation result status ${payload.result.status} must not include errors.`);
  }

  return failures;
}

function validateSearchContractSemantics(payload) {
  const failures = [];

  if (payload.scope === 'cross-node' && payload.auth?.mode !== 'node-signature') {
    failures.push('cross-node search must use node-signature auth.');
  }
  if (payload.entity_type === 'material' && payload.filters?.condition !== undefined && payload.strict_filtering === true) {
    failures.push('strict material search must reject condition filter.');
  }
  if (payload.results) {
    for (const [index, result] of payload.results.entries()) {
      if (payload.entity_type === 'material' && !/^MAT-/.test(result.id)) {
        failures.push(`material search result ${index} id must use MAT- prefix.`);
      }
      if (payload.entity_type === 'product' && !/^PRD-/.test(result.id)) {
        failures.push(`product search result ${index} id must use PRD- prefix.`);
      }
    }
    if (payload.consistency?.mode === 'snapshot' && !payload.consistency.snapshot_id) {
      failures.push('snapshot search response must include snapshot_id.');
    }
  }

  return failures;
}

function validateEnvelopeReplayWindow(payload, evaluationTimeOverride) {
  const failures = [];
  const createdAt = Date.parse(payload.created_at || '');
  const expiresAt = Date.parse(payload.expires_at || '');
  const evaluationTime = evaluationTimeOverride !== undefined
    ? Date.parse(evaluationTimeOverride)
    : Date.parse(payload.evaluation_time || payload.created_at || '');
  const replayWindowSeconds = payload.replay_window_seconds;

  if (!Number.isInteger(replayWindowSeconds)) {
    failures.push('signed envelope replay_window_seconds is required.');
    return failures;
  }
  if (!Number.isFinite(createdAt) || !Number.isFinite(expiresAt)) {
    failures.push('signed envelope created_at and expires_at must be valid date-time values.');
    return failures;
  }
  if (createdAt >= expiresAt) {
    failures.push('signed envelope created_at must be earlier than expires_at.');
  }
  if (!Number.isFinite(evaluationTime)) {
    failures.push('signed envelope evaluation_time must be a valid date-time value.');
    return failures;
  }
  if (evaluationTime < createdAt) {
    failures.push('evaluation_time must be >= created_at.');
  }
  if (evaluationTime >= expiresAt) {
    failures.push('message has expired (evaluation_time must be < expires_at).');
  }

  const maxExpiresAt = createdAt + replayWindowSeconds * 1000;
  if (expiresAt > maxExpiresAt) {
    failures.push('signed envelope expires_at must be within replay_window_seconds of created_at.');
  }

  return failures;
}

function validateErrorContractSemantics(payload) {
  const failures = [];

  if (payload.code === 'unsupported_profile_version' && payload.retryable !== false) {
    failures.push('unsupported_profile_version errors are not retryable without a new profile negotiation.');
  }
  if (payload.code === 'signature_invalid' && payload.retryable !== false) {
    failures.push('signature_invalid errors are not retryable without changing the signature/key.');
  }
  if (payload.code === 'timeout' && payload.retryable !== true) {
    failures.push('timeout errors must be retryable.');
  }

  return failures;
}

function validateEpcisMappingSemantics(payload) {
  const failures = [];

  if (payload.full_epcis_conformance_claimed === true) {
    failures.push('Core-DP EPCIS metadata must not claim full EPCIS conformance.');
  }
  if (payload.epcis_subset_event) {
    const expectedEpc = `urn:loop:${payload.core_dp_mapping?.subject_type}:${payload.core_dp_mapping?.subject_id}`;
    if (!payload.epcis_subset_event.epcList?.includes(expectedEpc)) {
      failures.push(`EPCIS epcList must include mapped Core-DP subject ${expectedEpc}.`);
    }
  }

  return failures;
}

function validateChoreographyMessageContract(payload, envelope) {
  const failures = [];
  const rule = CORE_DP_CHOREOGRAPHY_RULES[payload.message_type];
  const isRecoveryObservation = ['timed-out', 'partitioned'].includes(payload.state);

  if (!rule) {
    failures.push(`unknown choreography message_type ${payload.message_type}.`);
    return failures;
  }

  if (payload.subject?.type !== rule.subjectType) {
    failures.push(`${payload.message_type} subject.type must be ${rule.subjectType}.`);
  }
  if (payload.state !== rule.state && !isRecoveryObservation) {
    failures.push(`${payload.message_type} state must be ${rule.state}.`);
  }
  if (!isRecoveryObservation && payload.terminal !== rule.terminal) {
    failures.push(`${payload.message_type} terminal must be ${rule.terminal}.`);
  }
  const terminalForState = TERMINAL_CORE_DP_STATES.has(payload.state);
  if (payload.terminal !== terminalForState) {
    failures.push(`state ${payload.state} terminal must be ${terminalForState}.`);
  }
  if (!isRecoveryObservation && rule.previousState && payload.previous_state !== rule.previousState) {
    failures.push(`${payload.message_type} previous_state must be ${rule.previousState}.`);
  }
  if (isRecoveryObservation) {
    if (payload.previous_state !== rule.state) {
      failures.push(`${payload.state} recovery observation for ${payload.message_type} previous_state must be ${rule.state}.`);
    }
    if (!payload.last_accepted_message_id) {
      failures.push(`${payload.state} recovery observation must include last_accepted_message_id.`);
    }
    if (payload.duplicate_of || payload.duplicate_behavior) {
      failures.push(`${payload.state} recovery observation must not be modeled as a duplicate retry result.`);
    }
  }

  if (payload.authoritative_role !== rule.authoritativeRole) {
    failures.push(`${payload.message_type} authoritative_role must be ${rule.authoritativeRole}.`);
  }
  const expectedAuthority = expectedNodeForRole(payload, rule.authoritativeRole);
  if (envelope) {
    const envelopeAuthority = envelope.sender?.node_id === expectedAuthority
      ? envelope.sender.node_id
      : envelope.receiver?.node_id === expectedAuthority
        ? envelope.receiver.node_id
        : undefined;
    if (!envelopeAuthority) {
      failures.push(`${payload.message_type} authoritative node ${expectedAuthority} is neither envelope sender nor receiver.`);
    }
  }

  if (envelope) {
    const expectedSender = expectedNodeForRole(payload, rule.authorRole);
    if (envelope.sender?.node_id !== expectedSender) {
      failures.push(`${payload.message_type} sender.node_id must be ${expectedSender}.`);
    }
    if (envelope.receiver?.node_id === envelope.sender?.node_id) {
      failures.push('envelope sender and receiver must be different nodes.');
    }
  }

  if (payload.message_type === 'transfer.ack') {
    if (isRecoveryObservation) {
      failures.push('transfer.ack must not be modeled as a local recovery observation.');
    }
    if (payload.final_ack_role !== 'origin-confirms-receiver-receipt') {
      failures.push('transfer.ack final_ack_role must explicitly be origin-confirms-receiver-receipt.');
    }
    if (!payload.acknowledges_message_id) {
      failures.push('transfer.ack must identify the transfer.receive message it acknowledges.');
    }
  }

  if (payload.message_type === 'capabilities.response' && payload.state === 'capabilities-confirmed') {
    if (payload.accepted_profile_version !== CORE_DP_PROFILE_VERSION) {
      failures.push(`capabilities.response accepted_profile_version must be ${CORE_DP_PROFILE_VERSION}.`);
    }
  }

  return failures;
}

function validateSemanticCheck(checkName, payload, context = {}) {
  const failures = [];
  const envelopePayload = payload?.body && payload?.body_schema ? payload : null;
  const body = envelopePayload?.body || payload;
  const { evaluationTime, trustStore } = context;

  if (checkName === 'core-dp-envelope-signing-input-sha256') {
    const signingInput = coreDpEnvelopeSigningInput(payload);
    const actual = sha256Hex(canonicalJson(signingInput));
    if (payload.signature?.signing_input_sha256 !== actual) {
      failures.push(`expected signing_input_sha256 ${actual}, got ${payload.signature?.signing_input_sha256}`);
    }
    return failures;
  }

  if (checkName === 'core-dp-envelope-ed25519-signature') {
    const signature = payload.signature || {};
    const signingInput = canonicalJson(coreDpEnvelopeSigningInput(payload));
    const actualSigningInputHash = sha256Hex(signingInput);

    if (signature.signing_input_sha256 !== actualSigningInputHash) {
      failures.push(`expected signing_input_sha256 ${actualSigningInputHash}, got ${signature.signing_input_sha256}`);
    }
    if (signature.key_id !== payload.sender?.key_id) {
      failures.push('signature.key_id must match sender.key_id.');
    }

    if (!trustStore || !Array.isArray(trustStore.keys)) {
      failures.push('trustStore with keys array is required for signature verification.');
      return failures;
    }
    const trustedEntry = trustStore.keys.find(
      (key) => key.node_id === payload.sender?.node_id && key.key_id === signature.key_id,
    );
    if (!trustedEntry) {
      failures.push(`sender key ${signature.key_id} not found in trust store for node ${payload.sender?.node_id}.`);
      return failures;
    }
    if (trustedEntry.lifecycle_status === 'revoked') {
      failures.push(`sender key ${signature.key_id} for node ${payload.sender?.node_id} has been revoked.`);
      return failures;
    }
    const createdAt = Date.parse(payload.created_at || '');
    if (createdAt < Date.parse(trustedEntry.valid_from) || createdAt >= Date.parse(trustedEntry.valid_until)) {
      failures.push(`sender key ${signature.key_id} for node ${payload.sender?.node_id} not valid for message created_at ${payload.created_at}.`);
      return failures;
    }

    try {
      const publicKey = crypto.createPublicKey({ key: trustedEntry.public_key_jwk, format: 'jwk' });
      const verified = crypto.verify(
        null,
        Buffer.from(signingInput, 'utf8'),
        publicKey,
        Buffer.from(signature.value || '', 'base64url'),
      );
      if (!verified) {
        failures.push('detached Ed25519 signature verification failed.');
      }
    } catch (error) {
      failures.push(`detached Ed25519 signature verification failed: ${error.message}`);
    }
    return failures;
  }

  if (checkName === 'core-dp-envelope-trusted-key-resolution') {
    const signature = payload.signature || {};
    if (!trustStore || !Array.isArray(trustStore.keys)) {
      failures.push('trustStore with keys array is required.');
      return failures;
    }
    const trustedEntry = trustStore.keys.find(
      (key) => key.node_id === payload.sender?.node_id && key.key_id === signature.key_id,
    );
    if (!trustedEntry) {
      failures.push(`sender key ${signature.key_id} not found in trust store for node ${payload.sender?.node_id}.`);
      return failures;
    }
    if (trustedEntry.lifecycle_status === 'revoked') {
      failures.push(`sender key ${signature.key_id} for node ${payload.sender?.node_id} has been revoked.`);
      return failures;
    }
    const createdAt = Date.parse(payload.created_at || '');
    if (createdAt < Date.parse(trustedEntry.valid_from) || createdAt >= Date.parse(trustedEntry.valid_until)) {
      failures.push(`sender key ${signature.key_id} for node ${payload.sender?.node_id} not valid for message created_at ${payload.created_at}.`);
      return failures;
    }
    if (trustedEntry.lifecycle_status === 'rotated') {
      const msgCreatedAt = Date.parse(payload.created_at || '');
      const validUntil = Date.parse(trustedEntry.valid_until);
      if (msgCreatedAt >= validUntil) {
        failures.push(`sender key ${signature.key_id} for node ${payload.sender?.node_id} rotated and not valid for message created_at ${payload.created_at}.`);
        return failures;
      }
    }
    return failures;
  }

  if (checkName === 'core-dp-envelope-body-contract') {
    const expectedBodySchema = CORE_DP_BODY_SCHEMA_BY_MESSAGE_TYPE[payload.message_type];
    if (!expectedBodySchema) {
      failures.push(`message_type ${payload.message_type} has no registered body_schema contract.`);
    } else if (payload.body_schema !== expectedBodySchema) {
      failures.push(`message_type ${payload.message_type} must use body_schema ${expectedBodySchema}.`);
    }
    if (payload.body?.message_type && payload.body.message_type !== payload.message_type) {
      failures.push(`envelope message_type ${payload.message_type} must match body.message_type ${payload.body.message_type}.`);
    }
    if (payload.message_type === 'material.search' && payload.body?.entity_type !== 'material') {
      failures.push('material.search envelope body entity_type must be material.');
    }
    if (payload.message_type === 'product.search' && payload.body?.entity_type !== 'product') {
      failures.push('product.search envelope body entity_type must be product.');
    }
    if (payload.message_type === 'error' && payload.body?.correlation_id === payload.message_id) {
      failures.push('error correlation_id must identify the failed message or conversation, not the error envelope itself.');
    }
    return failures;
  }

  if (checkName === 'core-dp-envelope-replay-window') {
    return validateEnvelopeReplayWindow(payload, evaluationTime);
  }

  if (checkName === 'core-dp-dna-operation-contract') {
    return validateDnaOperationContract(body);
  }

  if (checkName === 'core-dp-search-contract-semantics') {
    return validateSearchContractSemantics(body);
  }

  if (checkName === 'core-dp-error-contract-semantics') {
    return validateErrorContractSemantics(body);
  }

  if (checkName === 'core-dp-epcis-mapping-semantics') {
    return validateEpcisMappingSemantics(body);
  }

  if (checkName === 'core-dp-evidence-immutable-subset') {
    for (const field of ['event_id', 'sequence', 'event_type', 'payload_hash_sha256']) {
      if (body.immutable?.[field] !== body[field]) {
        failures.push(`immutable.${field} must match top-level ${field}.`);
      }
    }
    if (canonicalJson(body.immutable?.subject) !== canonicalJson(body.subject)) {
      failures.push('immutable.subject must match top-level subject.');
    }
    return failures;
  }

  if (checkName === 'core-dp-choreography-message-contract') {
    return validateChoreographyMessageContract(body, envelopePayload);
  }

  if (checkName === 'core-dp-choreography-terminal-regression') {
    if (TERMINAL_CORE_DP_STATES.has(body.previous_state) && !TERMINAL_CORE_DP_STATES.has(body.state)) {
      failures.push(`terminal state ${body.previous_state} cannot regress to ${body.state}.`);
    }
    return failures;
  }

  if (checkName === 'core-dp-choreography-idempotency-retry') {
    if (body.attempt > 1 && !body.duplicate_of) {
      failures.push('retry attempts above 1 must identify duplicate_of.');
    }
    if (body.duplicate_of && !body.idempotency_key) {
      failures.push('duplicate messages must include the original idempotency_key.');
    }
    if (body.duplicate_behavior === 'stored_result' && body.original_fingerprint_sha256 !== body.idempotency_fingerprint_sha256) {
      failures.push('stored_result duplicates must have identical idempotency fingerprints.');
    }
    if (body.duplicate_behavior === 'conflict' && body.original_fingerprint_sha256 === body.idempotency_fingerprint_sha256) {
      failures.push('idempotency conflict duplicates must have different idempotency fingerprints.');
    }
    return failures;
  }

  if (checkName === 'core-dp-choreography-stale-reordered') {
    if (body.local_state && body.previous_state !== body.local_state) {
      failures.push(`reordered message previous_state ${body.previous_state} does not match local_state ${body.local_state}.`);
    }
    return failures;
  }

  if (checkName === 'core-dp-choreography-transfer-convergence') {
    if (['timed-out', 'partitioned'].includes(body.state) && !body.last_accepted_message_id) {
      failures.push(`${body.state} reconciliation must include last_accepted_message_id.`);
    }
    if (body.state === 'transfer-acked') {
      if (!body.local_evidence_hash_sha256 || !body.peer_evidence_hash_sha256 || !body.convergence_hash_sha256) {
        failures.push('transfer-acked convergence requires local, peer, and convergence evidence hashes.');
      } else if (body.local_evidence_hash_sha256 !== body.peer_evidence_hash_sha256) {
        failures.push('transfer convergence evidence hashes must match.');
      } else {
        const expected = sha256Hex(`${body.subject.id}:${body.local_evidence_hash_sha256}:${body.peer_evidence_hash_sha256}`);
        if (body.convergence_hash_sha256 !== expected) {
          failures.push(`transfer convergence_hash_sha256 must be ${expected}.`);
        }
      }
    }
    return failures;
  }

  failures.push(`unknown semantic check ${checkName}.`);
  return failures;
}

function assertCoreDpVectors(vectorsPath, validators, requirementIds, manifestRequirementIds) {
  const suite = loadJson(vectorsPath);
  const failures = [];
  const vectorIds = new Set();
  const semanticChecksUsed = new Set();
  const positiveCoverageTags = new Set();

  const trustStorePath = 'profiles/core-dp/conformance/trust/accepted-peer-keys.json';
  let trustStore;
  try {
    trustStore = loadJson(trustStorePath);
  } catch (error) {
    failures.push(`Failed to load trust store from ${trustStorePath}: ${error.message}`);
    return failures;
  }

  if (suite.suite !== 'core-dp-0.1.0-lab') {
    failures.push(`${vectorsPath}: suite must be core-dp-0.1.0-lab.`);
  }

  for (const vector of suite.vectors || []) {
    if (vectorIds.has(vector.id)) {
      failures.push(`${vectorsPath}: duplicate vector id ${vector.id}.`);
    }
    vectorIds.add(vector.id);

    if (!['valid', 'invalid'].includes(vector.expected)) {
      failures.push(`${vectorsPath}: ${vector.id} expected must be valid or invalid.`);
    }

    if (!Array.isArray(vector.requirement_ids) || vector.requirement_ids.length === 0) {
      failures.push(`${vectorsPath}: ${vector.id} must link at least one requirement_id.`);
    }

    for (const requirementId of vector.requirement_ids || []) {
      if (!requirementIds.has(requirementId) && !manifestRequirementIds.has(requirementId)) {
        failures.push(`${vectorsPath}: ${vector.id} references unknown requirement ${requirementId}.`);
      }
    }

    for (const coverageTag of vector.coverage_tags || []) {
      if (!CORE_DP_REQUIRED_POSITIVE_COVERAGE_TAGS.has(coverageTag)) {
        failures.push(`${vectorsPath}: ${vector.id} declares unknown coverage tag ${coverageTag}.`);
      }
      if (vector.expected !== 'valid') {
        failures.push(`${vectorsPath}: ${vector.id} coverage tag ${coverageTag} must be on a valid positive vector.`);
      }
      if (!Array.isArray(vector.semantic_checks) || vector.semantic_checks.length === 0) {
        failures.push(`${vectorsPath}: ${vector.id} coverage tag ${coverageTag} requires semantic_checks.`);
      }
      positiveCoverageTags.add(coverageTag);
    }

    const validator = validators.get(vector.payload_schema);
    if (!validator) {
      failures.push(`${vectorsPath}: ${vector.id} references unknown payload_schema ${vector.payload_schema}.`);
      continue;
    }

    const schemaValid = validator(vector.payload);
    const vectorFailures = [];
    if (!schemaValid) {
      vectorFailures.push(`schema failed:\n${formatErrors(validator.errors || [])}`);
    }

    if (schemaValid && vector.payload_schema.endsWith('/envelope.schema.json')) {
      const bodyValidator = validators.get(vector.payload.body_schema);
      if (!bodyValidator) {
        vectorFailures.push(`envelope body_schema is not registered: ${vector.payload.body_schema}`);
      } else if (!bodyValidator(vector.payload.body)) {
        vectorFailures.push(`envelope body failed ${vector.payload.body_schema}:\n${formatErrors(bodyValidator.errors || [])}`);
      }
    }

    if (
      vector.expected === 'valid' &&
      vector.payload_schema.endsWith('/envelope.schema.json') &&
      (vector.requirement_ids || []).includes('CORE-DP-REQ-SIGNED-ENVELOPE')
    ) {
      const semanticChecks = new Set(vector.semantic_checks || []);
      for (const requiredCheck of [
        'core-dp-envelope-signing-input-sha256',
        'core-dp-envelope-ed25519-signature',
        'core-dp-envelope-trusted-key-resolution',
        'core-dp-envelope-body-contract',
        'core-dp-envelope-replay-window',
      ]) {
        if (!semanticChecks.has(requiredCheck)) {
          vectorFailures.push(`valid signed envelope vectors must run ${requiredCheck}.`);
        }
      }
    }

    const context = {
      evaluationTime: vector.evaluation_time,
      trustStore,
    };

    for (const checkName of vector.semantic_checks || []) {
      semanticChecksUsed.add(checkName);
      if (!CORE_DP_SEMANTIC_CHECKS.has(checkName)) {
        vectorFailures.push(`unknown semantic check ${checkName}.`);
        continue;
      }
      vectorFailures.push(...validateSemanticCheck(checkName, vector.payload, context));
    }

    if (vector.expected === 'valid' && vectorFailures.length > 0) {
      failures.push(`${vectorsPath}: ${vector.id} expected valid but failed:\n${vectorFailures.join('\n')}`);
    }
    if (vector.expected === 'invalid' && vectorFailures.length === 0) {
      failures.push(`${vectorsPath}: ${vector.id} expected invalid but schema and semantic checks passed.`);
    }
    if (
      vector.expected === 'invalid' &&
      typeof vector.expected_failure_contains === 'string' &&
      vector.expected_failure_contains.length > 0 &&
      !vectorFailures.some((failure) => failure.includes(vector.expected_failure_contains))
    ) {
      failures.push(
        `${vectorsPath}: ${vector.id} did not fail for intended reason containing "${vector.expected_failure_contains}". Actual failures:\n${vectorFailures.join('\n') || 'none'}`,
      );
    }
  }

  for (const checkName of CORE_DP_SEMANTIC_CHECKS) {
    if (!semanticChecksUsed.has(checkName)) {
      failures.push(`${vectorsPath}: registered semantic check is not covered by any vector: ${checkName}.`);
    }
  }

  for (const coverageTag of CORE_DP_REQUIRED_POSITIVE_COVERAGE_TAGS) {
    if (!positiveCoverageTags.has(coverageTag)) {
      failures.push(`${vectorsPath}: missing required positive coverage tag: ${coverageTag}.`);
    }
  }

  return failures;
}

function assertCoreDpEpcisFixtures(fixturesPath, unsupportedPath, validators) {
  const fixture = loadJson(fixturesPath);
  const unsupported = loadJson(unsupportedPath);
  const failures = [];
  const validator = validators.get('profiles/core-dp/schemas/epcis-mapping.schema.json');

  if (!validator) {
    failures.push('EPCIS mapping schema validator is not registered.');
  } else {
    for (const [artifactPath, artifact] of [
      [fixturesPath, fixture],
      [unsupportedPath, unsupported],
    ]) {
      if (!validator(artifact)) {
        failures.push(`${artifactPath}: did not match epcis-mapping.schema.json.\n${formatErrors(validator.errors || [])}`);
      }
    }
  }

  for (const [label, value] of [
    ['fixture EPCIS version', fixture.pinned_versions?.epcis],
    ['unsupported EPCIS version', unsupported.pinned_versions?.epcis],
  ]) {
    if (value !== '2.0.1') {
      failures.push(`${label} must be 2.0.1.`);
    }
  }
  for (const [label, value] of [
    ['fixture CBV version', fixture.pinned_versions?.cbv],
    ['unsupported CBV version', unsupported.pinned_versions?.cbv],
  ]) {
    if (value !== '2.0') {
      failures.push(`${label} must be 2.0.`);
    }
  }

  if (unsupported.full_epcis_conformance_claimed !== false) {
    failures.push(`${unsupportedPath}: full_epcis_conformance_claimed must remain false.`);
  }

  const event = fixture.epcis_subset_event || {};
  if (event.type !== 'ObjectEvent') {
    failures.push(`${fixturesPath}: fixture must use ObjectEvent.`);
  }
  if (!['commissioning', 'shipping', 'receiving', 'accepting'].includes(event.bizStep)) {
    failures.push(`${fixturesPath}: fixture bizStep ${event.bizStep} is outside Core-DP CBV subset.`);
  }
  if (!event.epcList?.includes(`urn:loop:${fixture.core_dp_mapping?.subject_type}:${fixture.core_dp_mapping?.subject_id}`)) {
    failures.push(`${fixturesPath}: epcList must include the mapped Core-DP subject.`);
  }

  return failures;
}

function assertCoreDpTrustStore(validators) {
  const trustStorePath = 'profiles/core-dp/conformance/trust/accepted-peer-keys.json';
  const trustStoreSchemaPath = 'profiles/core-dp/schemas/trust-store.schema.json';
  const failures = [];

  const validator = validators.get(trustStoreSchemaPath);
  if (!validator) {
    failures.push(`Trust store schema not registered: ${trustStoreSchemaPath}`);
    return failures;
  }

  try {
    const trustStore = loadJson(trustStorePath);
    if (!validator(trustStore)) {
      failures.push(`${trustStorePath}: does not match trust-store.schema.json.\n${formatErrors(validator.errors || [])}`);
    }
  } catch (error) {
    failures.push(`Failed to validate trust store: ${error.message}`);
  }

  // Validate peer-key-trust schema file is loadable
  const peerKeyTrustPath = 'profiles/core-dp/schemas/peer-key-trust.schema.json';
  const peerKeyValidator = validators.get(peerKeyTrustPath);
  if (!peerKeyValidator) {
    failures.push(`Peer key trust schema not registered: ${peerKeyTrustPath}`);
  }

  return failures;
}

function assertCoreDpProfile(validators) {
  const manifestPath = 'profiles/core-dp/requirements/spec-v0.2.0-normative-manifest.json';
  const coreRequirementsPath = 'profiles/core-dp/requirements/core-dp-requirements.json';
  const profileReadmePath = 'profiles/core-dp/README.md';
  const failures = [];

  const manifestResult = assertNormativeManifestMatchesSpec('SPECIFICATION.md', manifestPath);
  failures.push(...manifestResult.failures);

  const requirementsResult = assertCoreDpRequirements(
    coreRequirementsPath,
    manifestResult.manifest,
    profileReadmePath,
  );
  failures.push(...requirementsResult.failures);
  failures.push(
    ...assertProfileContractLocationsExist(
      'profiles/core-dp',
      manifestResult.manifest,
      requirementsResult.coreRequirements,
    ),
  );

  failures.push(...assertCoreDpTrustStore(validators));

  const manifestRequirementIds = new Set((manifestResult.manifest.entries || []).map((entry) => entry.id));
  failures.push(
    ...assertCoreDpVectors(
      'profiles/core-dp/conformance/vectors/core-dp-vectors.json',
      validators,
      requirementsResult.requirementIds,
      manifestRequirementIds,
    ),
  );
  failures.push(
    ...assertCoreDpEpcisFixtures(
      'profiles/core-dp/epcis/fixtures/core-dp-transfer-object-event.json',
      'profiles/core-dp/epcis/unsupported-features.json',
      validators,
    ),
  );

  return failures;
}

function assertProtocolContractMatchesDocs(specPath, openApiPath) {
  const spec = fs.readFileSync(specPath, 'utf8');
  const profileReadme = fs.readFileSync('profiles/core-dp/README.md', 'utf8');
  const openApi = loadJson(openApiPath);
  const failures = [];

  const expectedProtocolEndpoints = [
    'POST /api/v1/material',
    'GET /api/v1/material/{id}',
    'POST /api/v1/material/search',
    'POST /api/v1/product',
    'GET /api/v1/product/{id}',
    'GET /api/v1/node/info',
    'GET /api/v1/signals',
    'POST /api/v1/transaction',
    'POST /api/v1/federate/announce',
    'POST /api/v1/federate/offer',
  ];

  const documentedLabEndpoints = [
    'POST /api/v1/material-status',
  ];
  const additiveProfileEndpoints = [
    'POST /api/v1/product/search',
  ];

  for (const endpoint of [...expectedProtocolEndpoints, ...documentedLabEndpoints]) {
    if (!spec.includes(`**${endpoint}**`)) {
      failures.push(`SPECIFICATION.md is missing documented endpoint heading: ${endpoint}`);
    }
  }

  const openApiEndpoints = new Set();
  for (const [endpointPath, operations] of Object.entries(openApi.paths || {})) {
    if (!endpointPath.startsWith('/api/v1/')) {
      failures.push(`OpenAPI path must start with /api/v1/: ${endpointPath}`);
    }

    for (const method of Object.keys(operations || {})) {
      openApiEndpoints.add(`${method.toUpperCase()} ${endpointPath}`);
    }
  }

  for (const endpoint of expectedProtocolEndpoints) {
    if (!openApiEndpoints.has(endpoint)) {
      failures.push(`OpenAPI is missing protocol endpoint: ${endpoint}`);
    }
  }

  for (const endpoint of additiveProfileEndpoints) {
    if (!openApiEndpoints.has(endpoint)) {
      failures.push(`OpenAPI is missing additive Core-DP endpoint: ${endpoint}`);
    }
    if (!profileReadme.includes(`\`${endpoint}\``)) {
      failures.push(`profiles/core-dp/README.md is missing additive endpoint marker: ${endpoint}`);
    }
  }

  for (const endpoint of openApiEndpoints) {
    if (!expectedProtocolEndpoints.includes(endpoint) && !additiveProfileEndpoints.includes(endpoint)) {
      failures.push(`OpenAPI contains unexpected protocol endpoint: ${endpoint}`);
    }
  }

  return failures;
}

function assertExampleReadmeMatchesFiles(readmePath, examplePaths) {
  const readme = fs.readFileSync(readmePath, 'utf8');
  const failures = [];

  for (const examplePath of examplePaths) {
    const filename = path.basename(examplePath);
    if (!readme.includes(`\`${filename}\``)) {
      failures.push(`examples/README.md is missing example entry: ${filename}`);
    }
  }

  return failures;
}

function main() {
  const schemaPaths = fg.sync(['schemas/*.schema.json']);
  const profileSchemaPaths = fg.sync(['profiles/core-dp/schemas/*.schema.json']);
  const examplePaths = fg.sync(['examples/**/*.json']);
  const jsonPaths = fg.sync(['*.json', 'contexts/**/*.jsonld', 'examples/**/*.json', 'profiles/**/*.json', 'schemas/**/*.json']);

  if (schemaPaths.length === 0) {
    console.error('No schemas found in schemas/*.schema.json');
    process.exit(1);
  }

  if (examplePaths.length === 0) {
    console.error('No example JSON files found in examples/**/*.json');
    process.exit(1);
  }

  const validators = new Map();
  const schemaIds = new Set();
  const schemaById = new Map();
  const failures = [];

  for (const jsonPath of jsonPaths) {
    loadJson(jsonPath);
  }

  compileSchemas([...schemaPaths, ...profileSchemaPaths], validators, schemaIds, schemaById, failures);

  if (validators.size === 0) {
    console.error('Failed to load any schema validators.');
    process.exit(1);
  }

  for (const examplePath of examplePaths) {
    const payload = loadJson(examplePath);
    validatePayload(payload, validators, examplePath, failures);
  }

  failures.push(...assertOpenApiRefsResolve('openapi.json', schemaIds, schemaById));
  failures.push(...assertProtocolContractMatchesDocs('SPECIFICATION.md', 'openapi.json'));
  failures.push(...assertExampleReadmeMatchesFiles('examples/README.md', examplePaths));
  failures.push(...assertCoreDpProfile(validators));

  if (failures.length > 0) {
    console.error('Schema validation failed:\n');
    for (const failure of failures) {
      console.error(failure);
    }
    process.exit(1);
  }

  console.log(
    `Validated ${examplePaths.length} example file(s), ${jsonPaths.length} JSON artifact(s), and Core-DP profile vectors against ${schemaPaths.length + profileSchemaPaths.length} schema(s).`,
  );
}

if (require.main === module) {
  main();
}

// Exported so other scripts (e.g. profiles/core-dp/conformance/run-conformance.js) can reuse
// the shared AJV setup and Core-DP semantic-check implementations instead of re-implementing
// them. Exporting here is side-effect free: main() only runs when this file is the entry point
// (node scripts/validate-schemas.js / npm run validate:schemas), so `npm test` behavior is
// unchanged.
module.exports = {
  loadJson,
  formatErrors,
  makeAjv,
  compileSchemas,
  canonicalJson,
  sha256Hex,
  coreDpEnvelopeSigningInput,
  validateSemanticCheck,
  validateEnvelopeReplayWindow,
  CORE_DP_SEMANTIC_CHECKS,
  CORE_DP_BODY_SCHEMA_BY_MESSAGE_TYPE,
  CORE_DP_CHOREOGRAPHY_RULES,
  TERMINAL_CORE_DP_STATES,
  CORE_DP_PROFILE_VERSION,
};
