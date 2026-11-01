const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const paths = [
  'node_modules',
  'apps/api/node_modules',
  'apps/web/node_modules',
  'apps/api/dist',
  'apps/web/dist',
  'coverage',
  'baseline.log',
];

for (const relativePath of paths) {
  fs.rmSync(path.join(root, relativePath), { recursive: true, force: true });
}
