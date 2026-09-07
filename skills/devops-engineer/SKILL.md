---
name: devops-engineer
description: >-
  Production DevOps, CI/CD pipeline automation, containerization, cloud infrastructure,
  and deployment reliability. Covers Docker, Kubernetes, GitHub Actions, GitLab CI,
  Vercel/Cloudflare deployments, Terraform/IaC, Nginx/reverse proxies, SSL/TLS certificates,
  zero-downtime blue-green/canary releases, and monitoring/alerting. Activate when writing
  deployment scripts, debugging build pipelines, configuring Docker/Kubernetes, setting
  up cloud infrastructure, or optimizing deployment workflows.
---

# 🚀 DevOps, Infrastructure & CI/CD Engineering Playbook

This skill provides enterprise standards for infrastructure-as-code (IaC), automated deployment pipelines, containerization, and production observability.

---

## 1. Containerization & Docker Hardening

### 1.1 Multi-Stage Docker Builds (Lean & Secure)
Always use multi-stage builds to produce tiny, production-ready images with minimal attack surfaces:
```dockerfile
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Runner Stage (Minimal Distroless / Alpine)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

### 1.2 Container Security Checklist
* **Non-Root Execution:** Never run container workloads as `root` (UID 0). Always create an unprivileged system user.
* **Immutable Tags:** Pin base images with specific SHA digests or version tags; avoid unpinned `:latest`.
* **Read-Only Root Filesystem:** Mount root filesystems as read-only (`--read-only`), using temporary in-memory volumes (`tmpfs`) for temporary writes.

---

## 2. CI/CD Pipeline Automation (GitHub Actions & GitLab CI)

### 2.1 Standard Pipeline Architecture
Every production pipeline must enforce the **Quality & Security Gate**:
```
[Commit / PR]
      │
      ▼
[1. Lint & Format] ────► ESLint, Prettier, ShellCheck
      │
      ▼
[2. Security Audit] ───► npm audit, Snyk/Trivy, Secret Scanning
      │
      ▼
[3. Type Check & Tests]► tsc --noEmit, Jest/Vitest, Playwright E2E
      │
      ▼
[4. Build Artifact] ───► Container build with layer caching
      │
      ▼
[5. Staging / Canary] ─► Automated preview environment deployment
      │
      ▼
[6. Production Deploy] ─► Zero-downtime Blue/Green or Rolling release
```

### 2.2 GitHub Actions Speed & Cache Tuning
* **Dependency Caching:** Cache `~/.npm`, `~/.pnpm-store`, or Next.js build cache (`.next/cache`) using `actions/cache`.
* **Concurrency Gates:** Cancel redundant runs on rapid consecutive commits:
  ```yaml
  concurrency:
    group: ${{ github.workflow }}-${{ github.ref }}
    cancel-in-progress: true
  ```
* **Strict Secret Masking:** Never echo environment secrets in bash debug commands (`set -x`).

---

## 3. Web Servers, Reverse Proxies & Edge Delivery

### 3.1 Nginx High-Performance Reverse Proxy Blueprint
```nginx
server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Gzip & Brotli Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 10M;
    }
}
```

---

## 4. Observability, Health Checks & Reliability

* **Liveness & Readiness Probes:**
  * `/healthz/live`: Validates that the process is running.
  * `/healthz/ready`: Validates that database, cache, and third-party dependencies are connected.
* **Structured JSON Logging:** Output logs in structured JSON format with `timestamp`, `level`, `traceId`, `service`, and `message` for ingestion by Datadog, Grafana Loki, or CloudWatch.
