const path = require('node:path');
const spawnNpm = require('./npm-command');

const root = path.resolve(__dirname, '..');
const servers = [
  spawnNpm(['run', 'dev', '--workspace=apps/api'], {
    cwd: root,
    stdio: 'inherit',
  }),
  spawnNpm(['run', 'dev', '--workspace=apps/web'], {
    cwd: root,
    stdio: 'inherit',
  }),
];

let stopping = false;

function stopServers(exitCode) {
  if (stopping) {
    return;
  }

  stopping = true;
  process.exitCode = exitCode;
  for (const server of servers) {
    if (server.exitCode === null && server.signalCode === null) {
      server.kill();
    }
  }
}

for (const server of servers) {
  server.on('error', (error) => {
    console.error(`Failed to start a development server: ${error.message}`);
    stopServers(1);
  });
  server.on('exit', (code, signal) => {
    if (!stopping) {
      stopServers(signal ? 1 : code ?? 1);
    }
  });
}

process.on('SIGINT', () => stopServers(130));
process.on('SIGTERM', () => stopServers(143));
