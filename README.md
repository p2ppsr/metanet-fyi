# Metanet.fyi

Metanet.fyi is the “concept → proof → action” field guide for the Metanet. Its first skyscraper guide explains BSV overlays to non-technical readers while maintaining a direct source trail into current specifications, working code, and operational choices.

## What is here

- `/overlays` — the flagship visual guide
- `/overlays/recovery` — an interactive, browser-local data survival test
- `/overlays/build` — a six-stage implementation and operational roadmap
- `/resources` — a reviewed, status-labeled source atlas
- `/resources.json` and `/llms.txt` — machine-readable discovery surfaces

The site is server-rendered by a small Node.js HTTP service. It has no production package dependencies, uses no remote fonts, and sends only privacy-bounded interaction signals when the browser does not advertise GPC or DNT.

## Development and verification

Requires Node.js 22 or later.

```sh
npm install
npx playwright install chromium
npm run dev
npm run verify
```

The local site listens on `http://localhost:4321`. Verification includes unit/API tests, build generation, Chromium accessibility and responsive checks, and four mobile Lighthouse audits. Lighthouse thresholds are 95 performance and 100 accessibility, best practices, and SEO.

## Deployment

GitHub Actions builds a traceable Linux/amd64 image on the Evans Creek self-hosted runner and pushes it to the cluster registry. Kubernetes, DNS, certificates, rollback, and operational evidence are owned by the private `network-ops` repository.

## Licensing

Code is licensed under the MIT License in `LICENSE-CODE`. Original editorial content and diagrams are licensed CC BY 4.0 in `LICENSE-CONTENT`.
