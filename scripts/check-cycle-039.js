const fs = require('fs');
const path = require('path');
const t = fs.readFileSync(path.join(__dirname, '..', 'SECURITY.md'), 'utf8');
if (!t.includes('agent-cycle-039')) {
  console.error('missing marker agent-cycle-039');
  process.exit(1);
}
console.log('ok agent-cycle-039');
