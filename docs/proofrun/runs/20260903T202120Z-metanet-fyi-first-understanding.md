# ProofRun Record: metanet-fyi/first-understanding

- ProofRun version: `1`
- Flow definition: `docs/proofrun/flows/metanet-fyi-first-understanding.proofrun.yaml`
- Run ID: `metanet-fyi-first-understanding-20260903`
- Started at: `2026-09-03T20:20:05.902Z`
- Completed at: `2026-09-03T20:21:20.955Z`
- Outcome: `pass`
- Operator: `AI agent`

## Scope

- Surface: `Metanet FYI`
- Repo: `p2ppsr/metanet-fyi`
- Environment: `production`
- Base URL: `https://metanet.fyi`
- Target audience: a curious reader with 5% domain familiarity and 30% technical confidence
- Flow category: first understanding, conceptual accuracy, and role-based wayfinding
- State changing: `no`
- Spend cap: `USD 0`

## Deployment Identity

- Source commit: `3c817ad812c9106a07af4f7dde44570c315f28b1`
- Branch: `main`
- Workflow run: `https://github.com/p2ppsr/metanet-fyi/actions/runs/33802793074`
- Image tag: `registry.cars-operator-system.svc.cluster.local:5000/p2ppsr/metanet-fyi:3c817ad812c9-production-20260903`
- Image digest: `sha256:c70428d26389f675b5c85a76ab848d3c7a09b3e9a579d5de30d3e0672209b5f8`
- Kubernetes namespace/workload: `metanet-fyi/metanet-fyi`

## Matrix And Results

| Device | Result | Evidence |
| --- | --- | --- |
| Chromium desktop | pass | Clear first-viewport entry, accurate 30-second model, working reader path, zero axe violations, 280 ms measured navigation. |
| Chromium mobile | pass | Clear mobile entry, accurate model and proof limitation, working reader path, zero axe violations, 255 ms measured navigation. |

The adaptive computer-use agent independently identified the publication's role, distinguished blockchain ordering from overlay selection/retention and application presentation, and correctly stated that a proof cannot reconstruct missing transaction bytes. It then chose the reader route and reached the immediately actionable official overview in the Source Atlas.

## Evidence

- Result: `artifacts/proofrun/p2ppsr/metanet-fyi/20260903T202005Z-first-understanding/result.json`
- Evidence manifest: `artifacts/proofrun/p2ppsr/metanet-fyi/20260903T202005Z-first-understanding/evidence/metanet-fyi-first-understanding-20260903/evidence-manifest.json`
- Manifest SHA-256: `0c07ab501f83fea6fe4be84f8933e6566e2c4689397f9f146cc6fa7d0a19a2a5`
- Provider calls: `19`
- Recorded provider cost: `USD 0.01059776`
- Full run duration: `75,053 ms`

## Readiness Impact

- Commercial readiness changed: `yes`
- Product repo update needed: `no`
- Registry update needed: `no`
- Dossier update needed: `yes`
- Follow-up defects: none

