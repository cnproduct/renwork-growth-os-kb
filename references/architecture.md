# Architecture and scope

## Three layers

### RenWork Core

Stable, industry-neutral responsibilities:

- identity, organization, tenant, permissions, consent, evidence, audit, and retention;
- Organization, Offering, Persona, Account, Contact, Opportunity, Interaction, Transaction, Delivery, Risk, and Metric objects;
- 21 stable module IDs, knowledge-card schema, source registry, public-claim gate, evaluation format, and operating ownership.

Do not fork this layer per customer or industry.

### Growth Operating System

Reusable workflow chain:

```text
product truth
  -> market and ICP
  -> buyer discovery and evidence
  -> account/contact/opportunity lifecycle
  -> inquiry and qualification
  -> solution, quote, negotiation, order and delivery
  -> content and multi-touch execution
  -> review, metrics and learning
```

For ordinary users, describe the outcome as “AI 找客户/买家增长”. Keep provider, API, MCP, license, verification time, cost, and operator details in administrator audit or advanced configuration.

### Industry Packs

Packs may add only:

- object aliases and terminology;
- module-specific required fields;
- industry sources and source-quality requirements;
- business rules, compliance candidates, hard stops, and approval gates;
- retrieval filters, evaluation cases, and pilot metrics.

Packs must not copy real tenant data, weaken core governance, or claim production readiness from a template.

## 21 modules

The canonical list is `assets/starter-kit/module-catalog.json`:

- 00-01: governance, sources, permissions, terminology, conflicts;
- 02-07: company truth, brand, product, quality, compliance, commercial delivery;
- 08-12: market, ICP, intent, competitors, product-market fit;
- 13-19: buyer discovery, customer assets, inquiry, quotation, negotiation, content, delivery and aftersales;
- 20: learning, evaluation, quality and business metrics.

Use module IDs as stable contracts. Add fields or pack rules before inventing a new module.

## State model

Keep these states separate:

| State | Meaning |
|---|---|
| local artifact | file or code exists locally |
| repository | committed and visible in the intended remote repository |
| packaged | installable artifact or release exists |
| integrated | connected to a real provider, identity, permission, and data path |
| deployed | running in the intended environment |
| destination verified | actual site, channel, or API result was checked |
| business accepted | owner-approved success criteria and real workflow evidence passed |

Never infer a later state from an earlier one.
