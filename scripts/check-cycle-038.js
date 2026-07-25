const fs = require('fs');
const path = require('path');
const t = fs.readFileSync(path.join(__dirname, '..', 'DOMAIN-POLICY.md'), 'utf8');
if (!t.includes('agent-cycle-038')) {
  console.error('missing marker agent-cycle-038');
  process.exit(1);
}
console.log('ok agent-cycle-038');
