const fs = require('fs');
const path = require('path');
const t = fs.readFileSync(path.join(__dirname, '..', 'CONTRIBUTING.md'), 'utf8');
if (!t.includes('agent-cycle-040')) {
  console.error('missing marker agent-cycle-040');
  process.exit(1);
}
console.log('ok agent-cycle-040');
