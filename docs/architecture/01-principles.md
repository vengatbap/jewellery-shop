# 01. Architecture Principles

Every service, library, and tool developed within the Auric One platform must adhere to the following principles:

1. **Domain First**  
   Business domains own their data and business rules. A domain logic change must not require changes in other domains.

2. **API First**  
   Services communicate only through explicit, versioned API contracts.

3. **Database Ownership**  
   Every schema/table is owned strictly by one service. No cross-service SQL joins or direct reads are allowed.

4. **Event Ready**  
   Business events (e.g., `InvoiceCreated`, `SchemeInstallmentPaid`) are first-class citizens. Communication paths are designed to facilitate eventual consistency.

5. **Tenant First**  
   Every business request executes inside a strict tenant context (`Tenant-ID`).

6. **Branch Aware**  
   Every operational transaction belongs to a specific branch (`Branch-ID`).

7. **Audit by Default**  
   Every database write (create, update, delete) generates an append-only audit trail record.

8. **Backward Compatible APIs**  
   Breaking API changes must not be deployed without path versioning (e.g., `/api/v2/*`).
