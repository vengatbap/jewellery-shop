# Definition of Done (DoD) Checklist

A module is declared **complete** and ready to merge into `develop`/`main` branches only when it meets all criteria in this checklist.

---

## 1. Business Logic
- [ ] Core business requirements are fully implemented according to the module specification sheet.
- [ ] Calculations are isolated into stateless functional libraries (Engines) inside `packages/core` or module libraries.
- [ ] Functional edge cases are handled (e.g. weight mismatches, zero pricing bounds).

## 2. Database Layer
- [ ] Database schema is updated inside the ORM and SQL migration files are generated.
- [ ] Migrations run cleanly on dev and testing databases.
- [ ] All tables are bounded strictly by the service's schema prefix. No cross-schema direct joins.

## 3. API & Validation
- [ ] REST API endpoints utilize path versioning prefix (e.g. `/api/v1/[module]/*`).
- [ ] Response payloads conform to the standard JSON response envelope.
- [ ] Zod validation is implemented for all incoming request bodies, headers, and query parameters.
- [ ] Mutation endpoints require and support the `X-Idempotency-Key` header.

## 4. Security & Compliance
- [ ] Middleware verifies JWT authorization tokens on all gateway routes.
- [ ] Tenant and Branch headers are extracted, validated, and bound to the database transaction queries context.
- [ ] RBAC permission tokens are validated for the action.
- [ ] All database writes (create, update, delete) trigger append-only audit trail logging.

## 5. Event Publishing
- [ ] Domain events (e.g. `InvoiceCreated`, `SchemeInstallmentPaid`) are generated and published successfully.
- [ ] Event schemas conform to global definitions in `@jewellery-erp/events`.

## 6. Testing & Quality
- [ ] Unit test coverage for business logic and validation files is >= 80%.
- [ ] Integration tests verify successful API responses and correct error payload formats.
- [ ] Static code analysis (linting, typescript compiling) passes with zero errors.

## 7. UX & Interface
- [ ] Screen layouts and grid navigation match standards defined in `docs/design/ux-standards.md`.
- [ ] Tables support sorting, searching, pagination, and visibility controls.
- [ ] Skeleton loading states and empty-page helper actions are implemented.

## 8. Documentation
- [ ] Module specification sheet is completed and committed to the workspace.
- [ ] Public API documentation (under `docs/api/public/` if applicable) is updated.
