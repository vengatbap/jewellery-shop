# 05. Security Layer Pipeline

Security controls must execute before request context reaches business routes. Every route handler runs through this sequence:

```
Request 
  │
  ▼
JWT Verification (validate credentials & identity)
  │
  ▼
Tenant Context Validation (extract & lock organization isolation)
  │
  ▼
Branch Context Verification (verify active user location authorization)
  │
  ▼
Permission Check (enforce RBAC rules against action)
  │
  ▼
Controller Execute (business logic)
```

## Security Handlers

1. **JWT Verification:** Middleware checks the `Authorization` header token, decodes identity, and assigns it to the context.
2. **Tenant Context Validation:** Verifies the `X-Tenant-ID` header, ensuring it matches the tenant the user is registered under.
3. **Branch Context Verification:** Verifies the `X-Branch-ID` header, enforcing branch access permissions.
4. **Permission check:** RBAC module checks that the user holds the required permissions (e.g. `invoice:create`) for the requested endpoint.
