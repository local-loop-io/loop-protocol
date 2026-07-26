const fs = require('fs');
const path = require('path');

// Documentation anchors placed by agent cycles. Each entry pins a marker to the
// file that is meant to carry it, so a doc rewrite cannot silently drop it.
// Replaces the former per-cycle check-cycle-NNN.js scripts, which duplicated
// this logic once per cycle (and, from cycle 042 on, only re-asserted that the
// examples directory was non-empty — already covered by validate-schemas.js).
const MARKERS = [
  ['SPECIFICATION.md', 'agent-cycle-035'],
  ['README.md', 'agent-cycle-036'],
  ['PROJECT_STRUCTURE.md', 'agent-cycle-037'],
  ['DOMAIN-POLICY.md', 'agent-cycle-038'],
  ['SECURITY.md', 'agent-cycle-039'],
  ['CONTRIBUTING.md', 'agent-cycle-040'],
  [path.join('schemas', 'README.md'), 'agent-cycle-027'],
];

const root = path.join(__dirname, '..');
const missing = [];

for (const [file, marker] of MARKERS) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    missing.push(`${file}: file not found (expected marker ${marker})`);
    continue;
  }
  if (!fs.readFileSync(full, 'utf8').includes(marker)) {
    missing.push(`${file}: missing marker ${marker}`);
  }
}

if (missing.length > 0) {
  for (const problem of missing) {
    console.error(problem);
  }
  process.exit(1);
}

console.log(`agent markers ok (${MARKERS.length} anchors)`);
