#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    if (input.trim()) {
      const data = JSON.parse(input);
      const toolCall = data.toolCall || {};
      const args = toolCall.args || {};
      const command = args.CommandLine || '';
      const cwd = args.Cwd || process.cwd();
      
      // Determine project directory
      let projectDir = cwd;
      if (Array.isArray(data.workspacePaths) && data.workspacePaths.length > 0) {
        projectDir = data.workspacePaths[0];
      }

      if (command && projectDir) {
        const logFile = path.join(projectDir, '.agent_terminal_commands.log');
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] [DIR: ${cwd}] CMD: ${command}\n`;
        fs.appendFileSync(logFile, logLine, 'utf8');
      }
    }
  } catch (err) {
    // Fail silently so hooks never break execution
  }
  // Contract requires empty JSON object on stdout
  process.stdout.write('{}\n');
});
