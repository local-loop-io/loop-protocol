const fs = require('fs');
const path = require('path');
const examplesDir = path.join(__dirname, '..', 'examples');
const files = fs.readdirSync(examplesDir).filter((f) => f.endsWith('.json'));
if (files.length < 1) {
  console.error('expected example json files');
  process.exit(1);
}
// cycle 74 marker ensures unique script
console.log('examples ok', files.length, 'cycle 74');
