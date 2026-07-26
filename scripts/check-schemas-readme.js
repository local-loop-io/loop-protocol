const fs = require('fs');
const path = require('path');
const readme = fs.readFileSync(path.join(__dirname, '..', 'schemas', 'README.md'), 'utf8');

// Only fenced command blocks are inspected: prose is allowed to mention bare
// `npm test` (the caution below the block does exactly that), but no block may
// instruct it. Where npm is aliased to bun, bare `npm test` dispatches to Bun's
// built-in test runner (0 test files, exit 1) rather than the validation script.
const codeBlocks = [...readme.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].map((m) => m[1]);
const commands = codeBlocks.join('\n');

if (!commands.includes('npm run test')) {
  console.error('schemas/README.md must document `npm run test` validation in a command block');
  process.exit(1);
}

const bareNpmTest = /(^|[^-\w])npm test(?![-\w])/m;
if (bareNpmTest.test(commands)) {
  console.error('schemas/README.md command block uses bare `npm test`; use `npm run test`');
  process.exit(1);
}

console.log('schemas README ok');
