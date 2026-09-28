const { spawnSync } = require('node:child_process');
const path = require('node:path');
require('dotenv').config({ quiet: true });
const { configureTestDatabase } = require('./test-database.cjs');

try {
  configureTestDatabase(process.env);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const cwd = path.resolve(__dirname, '..');
for (const [entry, args] of [
  ['prisma/build/index.js', ['migrate', 'deploy']],
  ['jest/bin/jest', ['--runInBand', ...process.argv.slice(2)]],
]) {
  const result = spawnSync(process.execPath, [require.resolve(entry), ...args], {
    cwd, env: process.env, stdio: 'inherit',
  });
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) process.exit(result.status || 1);
}
