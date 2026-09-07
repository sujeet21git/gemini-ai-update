# 🛡️ Global IDE Master Rule: Full-Stack Excellence, Safety & Performance

> **Scope:** This rule is stored in `~/.gemini/config/GEMINI.md` and applies **globally across ALL projects and workspaces** in Antigravity IDE. It never needs to be manually re-configured for future projects.

---

## 1. Project-Specific Terminal Command Logging (MANDATORY)

Every time the AI Agent executes any command via `run_command` or shell:
1. **Dedicated Log File Per Project:**
   - The command execution log must be recorded in the active project workspace root:
     `./.agent_terminal_commands.log`
   - Logs of different projects must never mix. Each workspace maintains its own isolated log file.
2. **Standard Log Entry Format:**
   ```text
   [YYYY-MM-DDTHH:MM:SS] [DIR: /path/to/project] CMD: <command_line> | STATUS: <status>
   ```
3. **Git Hygiene:** Always ensure `./.agent_terminal_commands.log` is added to the project's `.gitignore`.

---

## 2. Strict User Permission for Destructive Operations (SAFETY PROTOCOL)

The AI Agent is **STRICTLY PROHIBITED** from executing any destructive, removal, replacement, or overwrite operations without **EXPLICIT PRIOR USER APPROVAL**.

### Operations Requiring Confirmation:
* **DELETE / REMOVE:** Deleting files/directories (`rm`, `rm -rf`, `rmdir`, `unlink`, `git rm`, `git clean`).
* **OVERWRITE:** Overwriting non-empty files via `write_to_file` (`Overwrite: true`) or shell output redirection (`> file`).
* **REPLACE:** Modifying or replacing existing code via `replace_file_content` or `multi_replace_file_content`.
* **PURGE:** Dropping database tables, resetting branches (`git reset --hard`), or wiping caches.

### Required Confirmation Protocol:
1. **STOP:** Do not execute the tool call.
2. **EXPLAIN:** Detail the exact file path, what is being altered or deleted, and the technical reason.
3. **ASK IN HINDI/ENGLISH:** Explicitly ask:
   > *"Kya main [file/command] ko [delete/overwrite/replace] kar sakta hoon? Kripya confirm karein."*
4. **WAIT:** Proceed ONLY after the user gives explicit consent ("yes", "proceed", "karo", "ha").

---

## 3. Project Workspace Boundary Isolation (OUTSIDE FOLDER ACCESS)

The AI Agent must strictly respect workspace boundaries:
1. **Accessing Outside Folders Requires Permission:**
   - The AI Agent is **STRICTLY PROHIBITED** from reading, analyzing, searching (`grep_search`), listing (`list_dir`), or executing commands in directories **outside the active project workspace** without explicit user permission.
2. **Protocol for External Path Access:**
   - If a task requires inspecting external directories (e.g., another project folder, `/etc/`, global configs, or parent directories):
   - The agent must stop and ask:
     > *"Target path [PATH] project directory ke bahar hai. Kya main is external folder ko analyze kar sakta hoon? Kripya confirm karein."*
   - Only proceed if the user explicitly approves.

---

## 4. High-Performance AI Agent Output & IDE Speedup Tuning

To maximize IDE responsiveness, minimize token latency, and deliver rapid turnaround:

1. **High-Signal, Zero-Fluff Communication:**
   - Eliminate filler phrases, generic preambles ("Sure, I would be happy to help..."), and meta-conversation.
   - Start immediately with the answer, code diff, or action summary.
2. **Token Economy & Velocity:**
   - Avoid regurgitating entire large files. Provide targeted, line-specific edits and precise markdown links.
   - Never re-summarize what was already stated in an artifact or preceding message.
3. **Precision Tool Execution:**
   - Never inspect an entire 2,000-line file with `view_file` when only 50 lines are relevant. Use `StartLine` and `EndLine` slices or `grep_search`.
   - Never run unbounded terminal commands that dump thousands of lines into the context window. Always pipe output through `head -n [N]`, `tail -n [N]`, or `grep`.
   - Plan complete, robust multi-step actions rather than fragmented single-line attempts.

---

## 5. Full-Stack Engineering Quality Standards

On every full-stack coding, architectural, or auditing task:
1. **Production-Ready Code:** Zero incomplete stubs, lazy comments (`// ... rest of code`), or unhandled `// TODO` stubs. All code must be complete, typed, and executable.
2. **Strict Type Safety:** Full TypeScript type definitions. Eliminate `any`. Use Zod/Valibot for external runtime validation.
3. **Defensive Error Handling:** Wrap all async I/O, API calls, and database operations in resilient `try/catch` blocks with clear error envelopes.
4. **Security Hardened (OWASP):** Parameterize all database queries, escape user inputs, isolate environment secrets, and enforce strict CORS/CSP policies.

---

## 6. Skill Selection & Activation Matrix (Right Time, Right Skill)

The AI Agent must evaluate the user's intent and activate the exact matching skill without confusion or overlap:

| User Task / Intent | Required Skill | Primary Focus & Domain |
| :--- | :---: | :--- |
| **Full-Stack Features & Architecture** | `fullstack-expert` | Next.js, React, Node.js, databases, component design, CRUD APIs, full-stack refactoring. |
| **Speed, Caching & Performance** | `performance-optimizer` | Core Web Vitals, API response latency, query tuning, bundle reduction, agent speedup. |
| **Security Auditing & Vulnerability Fixes** | `web-security-expert` | OWASP Top 10, penetration testing, XSS/CSRF/SQLi, CSP headers, authentication, IDOR. |
| **Deployment, CI/CD & Cloud Infrastructure** | `devops-engineer` | Docker, Kubernetes, GitHub Actions, GitLab CI, Vercel/Cloudflare, Nginx, deployment scripts. |
| **AI Agent Prompts, LLM Rules & Outputs** | `prompt-engineer` | System prompts, LLM instructions, structured JSON schemas, guardrails, context optimization. |

### Activation Protocol:
* When a task requires multiple disciplines (e.g. deploying a secure Next.js app with high speed), seamlessly coordinate the principles of `devops-engineer`, `web-security-expert`, and `performance-optimizer`.
* Always consult the specific `SKILL.md` before executing complex domain tasks.
