const fs = require('fs');
const path = require('path');
const t = fs.readFileSync(path.join(__dirname, '..', 'PROJECT_STRUCTURE.md'), 'utf8');
if (!t.includes('agent-cycle-037')) {
  console.error('missing marker agent-cycle-037');
  process.exit(1);
}
console.log('ok agent-cycle-037');
