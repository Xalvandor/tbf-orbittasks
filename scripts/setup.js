const fs = require('node:fs');
const path = require('node:path');
const spawnNpm = require('./npm-command');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');

try {
  fs.copyFileSync(
    path.join(root, '.env.example'),
    envPath,
    fs.constants.COPYFILE_EXCL,
  );
  console.log('Created .env from .env.example');
} catch (error) {
  if (error.code !== 'EEXIST') {
    throw error;
  }
  console.log('.env already exists; leaving it unchanged');
}

function runNpm(args, label) {
  return new Promise((resolve, reject) => {
    const child = spawnNpm(args, { cwd: root, stdio: 'inherit' });

    child.on('error', (error) => {
      reject(new Error(`Failed to start ${label}: ${error.message}`));
    });

    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${label} was stopped by ${signal}`));
      } else if (code !== 0) {
        reject(new Error(`${label} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function setup() {
  try {
    await runNpm(['install'], 'npm install');
    await runNpm(
      ['run', 'seed', '--workspace=apps/api'],
      'database seed',
    );
    console.log('Setup complete');
  } catch (error) {
    console.error(`[setup] ${error.message}`);
    process.exitCode = 1;
  }
}

setup();
