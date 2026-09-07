---
name: fullstack-expert
description: >-
  Enterprise-grade full-stack engineering standards, architectural patterns,
  and code quality benchmarks. Activate when designing, building, auditing,
  or refactoring web applications, APIs, databases, or frontend architectures.
---

# 🚀 Full-Stack Engineering Excellence Playbook

This skill defines the technical standards, architectural patterns, and quality benchmarks that the AI Agent must uphold on every full-stack engineering task.

---

## 1. Architectural Principles

### 1.1 Frontend Architecture
* **Component Modularity:** Strict separation between Presentation Components, Container/Data-fetching Components, and Custom Hooks.
* **Server-First Mindset:** In frameworks like Next.js, default to React Server Components (RSC). Only designate components as `"use client"` when state, lifecycle hooks (`useEffect`), or browser-only APIs are strictly necessary.
* **Zero Layout Shift (CLS):** Always set explicit dimensions on images, use `next/font` or `font-display: swap`, and reserve space for dynamic client content.
* **State Management:** Keep state local whenever possible. Use URL search params (`nuqs` or native router) for filterable state to preserve shareability.

### 1.2 Backend & API Design
* **Stateless & Idempotent:** Design RESTful endpoints with appropriate HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) and semantic HTTP status codes (`200`, `201`, `400`, `401`, `403`, `404`, `422`, `429`, `500`).
* **Input Validation:** Every external input (headers, query, params, body) must be strictly validated at runtime using **Zod** or equivalent schema libraries before hitting business logic.
* **Defensive Error Handling:** Never expose raw database errors or stack traces to client consumers. Always return standardized JSON error envelopes:
  ```json
  { "success": false, "error": { "code": "INVALID_INPUT", "message": "User-friendly description" } }
  ```

### 1.3 Database & Data Persistence
* **Connection Pooling:** Always reuse connection pools (Prisma, Drizzle, Mongoose, pg, mysql2) across serverless/edge invocations.
* **Index Strategy:** Every foreign key, unique constraint, and frequently filtered field (`where`, `sort`, `join`) must have a corresponding database index.
* **Atomic Transactions:** Wrap multi-table mutation sequences in atomic database transactions (`tx`).

---

## 2. Code Quality & Output Standards

1. **Zero Incomplete Stubs:** Never write lazy code, omitted blocks (`// ... existing code ...`), or unhandled `// TODO` comments. Every code artifact must be complete, functional, and drop-in ready.
2. **Strict Type Safety:** Avoid `any`. Use generics, discriminated unions, and utility types (`Omit`, `Pick`, `Partial`, `Record`).
3. **Graceful Degradation & Fallbacks:** Every network call, file read, or external API integration must be wrapped in `try/catch` with graceful UI fallback states (skeletons, error boundaries).
4. **Environment Isolation:** Secrets, API keys, and connection strings must strictly be accessed via `process.env` and validated at build/boot time.

---

## 3. Security & Compliance Checklist (OWASP)

* [ ] **Sanitization:** Escape all user inputs to prevent Cross-Site Scripting (XSS).
* [ ] **SQL Injection Prevention:** Use parameterized queries or ORM abstractions exclusively.
* [ ] **Authentication & Tokens:** Store session tokens in `HttpOnly; Secure; SameSite=Strict` cookies, never in `localStorage`.
* [ ] **CORS & Framing:** Restrict `Access-Control-Allow-Origin` to trusted domains and set `X-Frame-Options: SAMEORIGIN`.
* [ ] **Rate Limiting:** Protect public submission endpoints (login, contact, search) with rate limiters (e.g. Upstash Redis, Redis, or memory token buckets).
