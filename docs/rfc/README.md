# Auric One Request for Comments (RFC) Process

This directory houses proposed feature designs and business capabilities. 

## What is an RFC?
An **RFC (Request for Comments)** is a technical proposal describing a new business feature or system integration. It allows the engineering, product, and business teams to align on requirements, data models, and workflow changes before writing code.

* **ADR (Architecture Decision Record):** Focuses on core system changes (e.g. choosing a database engine, changing microservices boundary guidelines).
* **RFC (Request for Comments):** Focuses on functional capabilities (e.g. adding offline POS support, integrating WhatsApp reminders, implementing product reservations).

---

## Proposal Template

Every new proposal must copy and fill out the template below as `docs/rfc/RFC-XXXX-feature-title.md`:

```markdown
# RFC-XXXX: [Feature Title]

* **Status**: `PROPOSED | IN REVIEW | APPROVED | DEPRECATED`
* **Author**: `[Name]`
* **Date**: `YYYY-MM-DD`

---

## 1. Executive Summary
[Brief description of the proposed feature and why it is needed.]

## 2. Business Requirements
* [Requirement 1]
* [Requirement 2]

## 3. Workflow & Data Models
[Describe how data flows or how existing schemas change to support this.]

## 4. API Design (Endpoints & Payloads)
* `POST /api/v1/new-endpoint`

## 5. Security & Tenant Scoping
[How is tenant isolation and branch validation enforced?]

## 6. Drawbacks & Alternatives Considered
[What are the negative consequences or alternative implementations?]
```
