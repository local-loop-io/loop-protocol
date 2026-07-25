const fs = require('fs');
const path = require('path');
const readme = fs.readFileSync(path.join(__dirname, '..', 'schemas', 'README.md'), 'utf8');
if (!readme.includes('npm test')) {
  console.error('schemas/README.md must document npm test validation');
  process.exit(1);
}
console.log('schemas README ok');
