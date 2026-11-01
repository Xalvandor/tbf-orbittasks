const { spawn } = require('node:child_process');

function spawnNpm(args, options = {}) {
  const npmExecPath = process.env.npm_execpath;
  const command = npmExecPath
    ? process.execPath
    : process.platform === 'win32'
      ? 'npm.cmd'
      : 'npm';
  const commandArgs = npmExecPath ? [npmExecPath, ...args] : args;

  return spawn(command, commandArgs, {
    ...options,
    shell: !npmExecPath && process.platform === 'win32',
  });
}

module.exports = spawnNpm;
