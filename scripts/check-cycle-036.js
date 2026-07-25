const fs = require('fs');
const path = require('path');
const t = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
if (!t.includes('agent-cycle-036')) {
  console.error('missing marker agent-cycle-036');
  process.exit(1);
}
console.log('ok agent-cycle-036');
