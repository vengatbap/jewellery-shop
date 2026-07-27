# Module Specification: [Module Name]

* **Status**: `DRAFT | PROPOSED | APPROVED`
* **Version**: `0.0.1`
* **Target Milestone**: `Milestone X`
* **Owner**: `[Developer Name]`

---

## 1. Business Overview
[Provide a high-level summary of what business need this module solves, why it is necessary, and the general scope.]

## 2. Objectives
* [Objective 1]
* [Objective 2]

## 3. Actors & Personas
* **[Actor Name]**: [Brief description of what this actor does in the module context.]

## 4. Business Workflow
[Map out the sequential steps or state transitions of the domain workflow.]
```
Step 1 (Trigger) ➔ Step 2 (Validation) ➔ Step 3 (Mutation) ➔ Step 4 (Completion)
```

## 5. Database Schema
[List the tables, columns, constraints, and data types owned by this domain schema.]
```text
### table_name
- id: UUID (PK)
- organization_id: UUID (FK)
- ...
```

## 6. Business Rules
* **[Rule 1]**: [Detail rule logic, e.g. "Gold rate must lock based on the booking_rate policy."]
* **[Rule 2]**:

## 7. Permissions Registry
* `[domain]:create` - [Description]
* `[domain]:read` - [Description]

## 8. API Contracts
Define versioned path contracts:
* `POST /api/v1/[domain]` (Request payload, successful response code and envelope, error states).

## 9. Domain Events
List the events published by this domain:
* `[DomainEventCreated]` - [Trigger criteria]

## 10. Validation Rules
* [Validation Rule 1, e.g. "gross_weight must be a positive numeric value."]

## 11. User Experience (UX) Pattern
[Reference layouts, keyboard navigation shortcuts, data table filtering rules, and loading states matching docs/design/ux-standards.md.]

## 12. Reporting Requirements
* **[Report Name]**: [List target columns, filters, and target persona readers.]

## 13. Edge Cases & Mitigations
* **[Edge Case 1]**: [Mitigation strategy]

## 14. Acceptance Criteria
- [ ] [Criteria 1]
- [ ] [Criteria 2]
- [ ] Unit test coverage >= 80%
