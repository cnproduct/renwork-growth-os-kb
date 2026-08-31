# Reviewed video-production learning

## Purpose

RenWork may learn production methods from text, audio, video, images, subtitles, editing incidents, manifests, and finished films. Learning is a reviewed governance loop, not automatic memory. Raw extraction, generated artifacts, and candidate patterns remain private and inactive until the applicable gates pass.

This design adapts the review mechanics of `cnproduct/renasset-brand-video-master` to RenWork. It deliberately does not import RenAsset brand assets, financial claims, terminology, or product positioning.

## State model

```text
source available
  -> parsed observation
  -> STAGED candidate
  -> evidence and scope review
  -> APPROVED knowledge
  -> selected for a production brief
  -> generated artifact
  -> technical validation
  -> audiovisual acceptance
  -> optional new STAGED learning
```

The loop does not skip backward or forward. `generated` does not mean `accepted`; `accepted` does not automatically mean reusable; `APPROVED` knowledge does not mean deployed, published, destination verified, or business effective.

## Five governed record types

| Type | Purpose | Promotion boundary |
|---|---|---|
| asset | Inventory an exact source and observation | Never active guidance by itself |
| knowledge | Atomic claim or operating rule | Evidence state, applicability, risk, authority, and reviewer must fit |
| glossary | Canonical term and observed variants | Source-backed, sentence-level correction review |
| FAQ | Reproducible production incident and narrow repair | Root cause must be confirmed before deterministic approval |
| success pattern | One reusable characteristic from a finished video | Exact hash, manifest, human acceptance, QA evidence, scope limits, and forward test |

## Tenant and privacy boundary

Tenant and brand profile are resolved from trusted project context, never accepted from generated content as authority to switch scope. Raw media, transcripts, local paths, customer data, approval logs, and private traces stay in the tenant project. Only reviewed, de-identified governance or reusable method cards may enter the public RenWork Growth OS knowledge base.

Cross-tenant learning requires explicit authorization, de-identification, provenance, review, and a defined reusable method. It cannot copy customer media, contacts, claims, or brand assets.

## Claim and subtitle boundary

ASR/OCR and model rewrites are proposals. Names, numbers, dates, units, products, prices, buyer-evidence wording, compliance, performance, customer claims, and CTA must be checked against sources. High-risk claims require current authoritative evidence, a review date, prohibited overstatement, and an accountable reviewer.

Buyer evidence, contact verification, and sales priority remain independent. Public clues, email addresses, model scores, or inaccessible customs sources cannot become confirmed buyers or recent transactions through video copy.

## Accepted-video boundary

A reusable pattern requires all of the following:

1. exact artifact URI and SHA-256;
2. linked `video-production-manifest.json`;
3. human acceptance of the final rendered file;
4. QA evidence relevant to the proposed pattern;
5. narrow applicability and scope limits;
6. one representative forward test before default activation.

Metadata inspection, an automated score, a rendered file, a single scrub, or a repository commit is not audiovisual acceptance.

## Seven gates

1. source, scope, rights, privacy, and stable identity;
2. claim, terminology, authority, applicability, and prohibited overstatement;
3. sentence-level subtitle review for the full affected batch;
4. render integrity and source/timeline mapping;
5. representative audiovisual QA including the final frame and picture-subtitle-audio sync;
6. immutable accepted-artifact evidence for success patterns;
7. separate reporting of local, validation, acceptance, knowledge, repository, deployment, publication, destination, and business-result states.

## Operating integration

The implementation lives in the `renwork-video-production-knowledge-base` skill in `cnproduct/renwork-brand-video-service`. Scene-by-scene acceptance evidence comes from `renwork-training-scene-videos`. The Growth OS knowledge base stores only the governance contract and golden cases; operational registries stay private and tenant-scoped.
