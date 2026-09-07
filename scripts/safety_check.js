#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  let decision = 'allow';
  let reason = '';

  try {
    if (input.trim()) {
      const data = JSON.parse(input);
      const toolCall = data.toolCall || {};
      const toolName = toolCall.name || '';
      const args = toolCall.args || {};
      const workspacePaths = Array.isArray(data.workspacePaths) ? data.workspacePaths : [];
      const projectRoot = workspacePaths.length > 0 ? path.resolve(workspacePaths[0]) : '';

      // Helper: Check if an absolute path is outside the active workspace
      function isOutsideWorkspace(targetPath) {
        if (!targetPath || !projectRoot) return false;
        const resolved = path.resolve(targetPath);
        
        // Allowed system and internal IDE directories
        const allowedPrefixes = [
          projectRoot,
          path.resolve('/home/Sujeet-work/.gemini/antigravity-ide/brain'),
          path.resolve('/home/Sujeet-work/.gemini/config'),
          path.resolve('/tmp')
        ];

        return !allowedPrefixes.some((prefix) => resolved.startsWith(prefix));
      }

      // 1. Boundary Check: Analysis or operations outside the active project folder
      const targetPathToCheck = args.TargetFile || args.AbsolutePath || args.DirectoryPath || args.SearchPath || '';
      if (targetPathToCheck && isOutsideWorkspace(targetPathToCheck)) {
        decision = 'force_ask';
        reason = `Path "${targetPathToCheck}" is outside the active project directory. User permission is required to access external folders.`;
      }

      // Check working directory or external path traversal in run_command
      if (toolName === 'run_command' && decision === 'allow') {
        const cwd = args.Cwd || '';
        if (cwd && isOutsideWorkspace(cwd)) {
          decision = 'force_ask';
          reason = `Command working directory "${cwd}" is outside the project folder. User permission required.`;
        }
      }

      // 2. Destructive Operations Check in run_command
      if (toolName === 'run_command' && decision === 'allow') {
        const cmd = (args.CommandLine || '').toLowerCase();
        const destructivePatterns = [
          /\brm\s+/,
          /\brmdir\b/,
          /\bunlink\b/,
          /\bshred\b/,
          /\bgit\s+clean\b/,
          /\bgit\s+reset\s+--hard\b/,
          /\bdrop\s+(table|database)\b/,
          /\btruncate\s+table\b/
        ];

        const isDestructive = destructivePatterns.some((pattern) => pattern.test(cmd));
        if (isDestructive) {
          decision = 'force_ask';
          reason = `Destructive command detected: "${args.CommandLine}". User permission is required before deleting or removing files.`;
        }
      }

      // 3. File Overwrite Check in write_to_file
      if (toolName === 'write_to_file' && decision === 'allow') {
        if (args.Overwrite === true && args.TargetFile) {
          try {
            if (fs.existsSync(args.TargetFile)) {
              const stat = fs.statSync(args.TargetFile);
              if (stat.size > 0) {
                decision = 'force_ask';
                reason = `Overwriting existing file "${args.TargetFile}" requires user permission.`;
              }
            }
          } catch (e) {}
        }
      }

      // 4. Content Replacement Check in replace_file_content
      if ((toolName === 'replace_file_content' || toolName === 'multi_replace_file_content') && decision === 'allow') {
        decision = 'force_ask';
        reason = `Modifying or replacing content in "${args.TargetFile}" requires user confirmation.`;
      }
    }
  } catch (err) {
    decision = 'allow';
  }

  const result = { decision };
  if (reason) {
    result.reason = reason;
  }
  process.stdout.write(JSON.stringify(result) + '\n');
});
