# Auric One Foundation 1.0 (FROZEN - Final)

This document serves as the **Master Index** and source of truth for the **Auric One Enterprise Platform**. This specification defines the system boundaries, design principles, database constraints, coding guidelines, product requirements, backlog priorities, and implementation roadmap of the platform.

---

## 📚 Master Index

### 🏗️ Part 1: Core System Specifications
1. **[01. Architecture Principles](./01-principles.md)**  
   The core engineering values guiding all design, database, and integration code.
   
2. **[02. System Overview](./02-system-overview.md)**  
   A high-level view of the monorepo workspace and application topology.
   
3. **[03. Service Boundaries](./03-service-boundaries.md)**  
   Responsibility matrix detailing domain ownership (owns/never-owns) per service.
   
4. **[04. Database Schema Ownership](./04-database-ownership.md)**  
   Guidelines for database logical separation, schema isolation, and cross-service queries.
   
5. **[05. Security Layer Pipeline](./05-security.md)**  
   The sequential authorization pipeline (JWT ➔ Tenant ➔ Branch ➔ RBAC ➔ Route).
   
6. **[06. Event & Integration Architecture](./06-event-architecture.md)**  
   Standards for versioned paths, traceability headers, compensating transactions, health endpoints, and idempotency keys.
   
7. **[07. Business Engines](./07-business-engines.md)**  
   Topology of stateless domain calculation engines (pricing, inventory, tax, etc.).
   
8. **[08. Platform Roadmap](./08-roadmap.md)**  
   The frozen 10-phase execution timeline from core infrastructure to advanced features.
   
9. **[09. Savings Scheme Management](./09-savings-scheme.md)**  
   Domain specifications, schemas, flows, and accounting entries for monthly gold savings plans.
   
10. **[10. Governance & Changelog](./10-governance.md)**  
    Document control table, versioning status, and ADR workflow rules.

### 📋 Part 2: Operations, Standards & Product
11. **[11. Module Implementation Registry](./11-module-registry.md)**  
    The status dashboard tracking progress and package dependencies of each domain.

12. **[12. API Standards](./12-api-standards.md)**  
    Unified REST standards, query conventions, pagination formats, and response/error JSON shapes.

13. **[13. Engineering & Coding Standards](./13-engineering-standards.md)**  
    Source folder guidelines, layering rules, DTO formats, and structured logging expectations.

14. **[Product Requirements Document (PRD)](../product/01-product-requirements.md)**  
    The product vision, problems solved, personas, MVP scopes, and success metrics.

15. **[Product Editions & Licensing](../product/editions-and-licensing.md)**  
    Module packaging rules for Community, Professional, and SaaS Enterprise editions.

16. **[Product Backlog Registry](../backlog/product-backlog.md)**  
    The Now / Next / Later product priorities list.

17. **[Module Specification Template](../templates/module-specification-template.md)**  
    Unified markdown template to be used when writing technical specifications for new domains.

18. **[Definition of Done (DoD) Checklist](../templates/done-criteria.md)**  
    The quality and checklist criteria needed before declaring a module finished.

19. **[Release History v0.1.0 (Platform)](../releases/v0.1.0-platform.md)**  
    The active release specification and database schema deployment roadmap.

20. **[RFC Feature Proposal Process](../rfc/README.md)**  
    The functional feature request-for-comment RFC workflow and proposal template.

21. **[Public Integration APIs Guide](../api/public/README.md)**  
    Authentication, rate limiting, and interface standards for external systems.

### 🎨 Part 3: Design & Styling Blueprints
22. **[User Experience Standards](../design/ux-standards.md)**  
    Enterprise layout models, UI tech stack, Main table grids, Keyboard shortcuts, and form standards.

---

## 🔬 Project Status
* **Status**: `FROZEN (Foundation 1.0 Release)`
* **governance rule:** No new module may be developed or refactored unless it conforms strictly to these specifications. Architectural deviations require a formal **Architecture Decision Record (ADR)**. Features additions are managed via the **RFC Process**.
