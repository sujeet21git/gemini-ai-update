---
name: performance-optimizer
description: >-
  Systematic performance tuning, speed optimization, and high-velocity
  execution protocols for full-stack applications and AI agent workflows.
  Activate when optimizing web performance, Core Web Vitals, API latency,
  or accelerating development iteration velocity.
---

# ⚡ Performance Tuning & Speed Optimization Playbook

This skill provides optimization patterns for both **web application runtime performance** and **AI agent execution velocity**.

---

## 1. AI Agent Output Velocity & Execution Speedup

To maximize IDE responsiveness and minimize latency for the user:

### 1.1 Token Economy & High-Signal Responses
* **Cut Conversational Overhead:** Eliminate pleasantries, preamble ("Sure, I can help with that..."), and redundant meta-commentary.
* **Direct Solution Delivery:** Present solutions immediately with clear headings, file links, and concrete technical facts.
* **Zero Re-Summarization:** Never regurgitate entire files or duplicate artifact content in the final response. Highlight only key findings and decisions.

### 1.2 Precision Tool Operations
* **Targeted File Reading:** Never read an entire large file (1,000+ lines) if only one function or section is needed. Use `StartLine` and `EndLine` slice notation or `grep_search`.
* **Bounded Terminal Output:** Never execute unconstrained commands that output thousands of lines. Always pipe through `head -n [N]`, `tail -n [N]`, or `grep`.
* **Proactive Batching:** Formulate comprehensive solutions in structured passes rather than fragmented micro-edits.

---

## 2. Web Application & Runtime Performance Optimization

### 2.1 Frontend & Core Web Vitals (CWV)
* **LCP (Largest Contentful Paint < 2.0s):**
  * Preload critical hero images in `<head>`.
  * Inline critical path CSS; defer non-critical scripts (`defer` or `async`).
  * Use modern image formats (AVIF / WebP) with responsive `srcset` and `sizes`.
* **CLS (Cumulative Layout Shift = 0.00):**
  * Reserve layout space using explicit `aspect-ratio` or `width`/`height` attributes.
  * Use `font-display: swap` paired with fallback font adjustments (`next/font`).
* **INP / FID (Interaction to Next Paint < 100ms):**
  * Offload long-running calculations to Web Workers or server actions.
  * Debounce fast user inputs (search, filter, scroll).
  * Break monolithic JavaScript chunks using dynamic code splitting (`next/dynamic` / `React.lazy`).

### 2.2 Backend & Database Performance
* **N+1 Query Elimination:** Always fetch relational data using eager loading (`include` in Prisma, `populate` in Mongoose, joins in SQL).
* **Lean Field Projections:** Never fetch `SELECT *` on large tables. Select only the specific fields required by the UI view.
* **Intelligent Caching:**
  * Implement Edge caching (`stale-while-revalidate`) for read-heavy public pages.
  * Cache expensive database calculations in Redis / Upstash with appropriate TTLs.
  * Use HTTP conditional requests with `ETag` and `Last-Modified`.
