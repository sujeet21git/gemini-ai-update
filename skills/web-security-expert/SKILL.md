---
name: web-security-expert
description: >-
  Enterprise web application security, penetration testing heuristics, threat
  modeling, and vulnerability remediation (OWASP Top 10, XSS, CSRF, SQLi, SSRF,
  IDOR, authentication bypass, CSP/CORS policies, secrets management, and cryptographic standards).
  Activate when auditing code for security vulnerabilities, hardening APIs, reviewing
  authentication/authorization, setting security headers, or securing sensitive customer data.
---

# 🛡️ Web Application Security & Hardening Playbook

This skill provides industry-standard security protocols, penetration testing methodologies, and defensive coding blueprints based on OWASP Top 10 standards.

---

## 1. Threat Modeling & Vulnerability Remediation (OWASP Top 10)

### 1.1 A01: Broken Access Control & IDOR (Insecure Direct Object References)
* **Vulnerability:** Relying on client-supplied IDs (e.g. `/api/users/1024/invoices`) without verifying that the authenticated session owns the requested resource.
* **Defense:** Always enforce server-side tenancy checks at the database query level:
  ```typescript
  // BAD: Insecure direct object lookup
  const invoice = await db.invoice.findUnique({ where: { id: req.params.id } });

  // SECURE: Enforce session user/tenant boundary
  const invoice = await db.invoice.findFirst({
    where: { id: req.params.id, userId: session.user.id }
  });
  if (!invoice) throw new ForbiddenError("Access denied");
  ```

### 1.2 A02: Cryptographic Failures & Sensitive Data Protection
* **Data at Rest:** Encrypt sensitive fields (PII, tokens) using authenticated encryption (`AES-256-GCM`). Never roll custom cryptography.
* **Passwords:** Hash credentials exclusively using **Argon2id** or **Bcrypt** (cost factor >= 12).
* **Data in Transit:** Enforce TLS 1.3, disable weak ciphers, and inject `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.

### 1.3 A03: Injection (SQL, NoSQL, OS Command)
* **SQL Injection:** Parameterize all queries. Never concatenate raw strings into SQL statements.
* **Command Injection:** Avoid `child_process.exec()` with user input. Use `child_process.spawn()` with array arguments, or avoid shell execution entirely.
* **NoSQL Injection:** Sanitize `$where`, `$gt`, and regex operators from MongoDB/Mongoose query payloads using schema validation (Zod).

### 1.4 A05: Security Misconfiguration & HTTP Defense Headers
Always inject security headers on edge proxies (Nginx, Cloudflare, Next.js `next.config.js`):
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...' https://trusted.cdn.com; object-src 'none'; base-uri 'self';
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 1.5 A07: Authentication & Session Integrity
* **Session Storage:** Set `HttpOnly; Secure; SameSite=Strict; Path=/` on session cookies. Never expose JWTs or session keys to `window.localStorage` (susceptible to XSS exfiltration).
* **Brute-Force Defense:** Implement progressive delays and rate-limiting on login/password reset routes (e.g., 5 attempts per 15 minutes per IP/account).

---

## 2. Secure API & Data Transmission Checklist

1. **CORS Hardening:**
   * Never configure `Access-Control-Allow-Origin: *` on authenticated APIs.
   * Explicitly whitelist trusted origins and reject wildcard origins with credentials (`credentials: true`).
2. **SSRF (Server-Side Request Forgery) Prevention:**
   * When fetching user-provided URLs (webhooks, avatar imports, PDF generation), resolve the IP first and block private IP spaces (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.1/8`, `169.254.169.254` AWS metadata).
3. **Secrets Leakage Prevention:**
   * Scan code repositories for leaked secrets (`git-secrets`, `trufflehog`).
   * Never check `.env` files into source control; always provide a scrubbed `.env.example`.
