# ADR-001: Bill Payment Authority & Validation Hardening (Phase 11B)

## Context

Phase 11B established the `Bill` entity and lifecycle. To ensure long-term system integrity and prevent state drift or client-side manipulation of history, we must harden the authority model for bill payments and validation rules.

## Decisions

### 1. Authority Over `last_paid_period`

We will implement **Option B: Explicit Actions** to centralize control over bill payment status.

**Strategy:**
- The client is **forbidden** from modifying `lastPaidPeriod` directly via `PUT /bills/:id`.
- Two new explicit endpoints will be introduced:
  - `POST /bills/:id/pay`: Sets `lastPaidPeriod` to the **current server-derived period** (YYYY-MM).
  - `POST /bills/:id/unpay`: Sets `lastPaidPeriod` to `null`.

**Refined "Unpay" Constraints:**
- The "Unpay" action is **conditional**.
- It succeeds **only if** `lastPaidPeriod` matches the **current server period**.
- Rationale: We must prevent accidental erasure of historical payments. If a user paid a bill in January (`2024-01`) and attempts to "unpay" it in February (`2024-02`), the action must be rejected to preserve history.

### 2. PUT Behavior & Determinism

**Strict Rejection:**
- `PUT /bills/:id` requests that include the `lastPaidPeriod` field in the payload will be **rejected with a 400 Bad Request**.
- Silent ignores are explicitly forbidden to prevent client-side state drift and debugging confusion.

### 3. Period Computation Authority

**Single Source of Truth:**
- The **current period** is derived exclusively inside the **service layer**.
- It is **never** accepted from request input, query parameters, or route logic.
- We maintain one internal clock for payment operations.

### 4. Validation Hierarchy

We enforce a strict order of trust for data validation:

1.  **Route Boundary:**
    - Immediate rejection of malformed data types or invalid formats (e.g., regex check for `YYYY-MM`) before business logic is invoked.
2.  **Service Enforcement:**
    - Business rules and state validity (e.g., "Is this bill already paid?", "Is the due day valid for this month?").
3.  **Schema Defense:**
    - Database-level constraints (Mongoose validators) act as the final safety net against corruption.

### 5. Due Day Overflow Rule

The logic to handle "Day 31 in February" must be consistent and reusable.

**Location:** `server/src/utils/date.ts`

**Implementation:**
- Function: `normalizeDueDay(year: number, month: number, day: number): Date`
- Logic: If `day` exceeds the number of days in the given month, it clamps to the **last day of that month**.

### 6. Access Outcomes & Responses

For `POST /pay` and `POST /unpay`:

| Scenario | HTTP Status | Reason |
| :--- | :--- | :--- |
| Bill not found | **404** | ID does not exist. |
| Not owned by user | **404** | Security best practice (avoid leaking existence). |
| Unpay mismatch | **409** | `lastPaidPeriod` does not match current period. |
| Success | **200** | State updated successfully. |

### 7. Timezone & Period Computation

**Current Behavior:**
- Periods are derived from **Server Time (UTC)**.
- Example: A user in New York (UTC-5) paying a bill at 8 PM on Jan 31st will be recorded as paying in **February** (Feb 1st UTC).

**Decision:**
- We acknowledge this behavior as **intentional** for Phase 11B to maintain determinism without complex user-timezone logic.

---

## Frontend Impact

This design introduces breaking changes to the frontend `BillService`.

### Breaking Changes
1.  **`PUT /bills/:id`**: Will no longer accept `lastPaidPeriod`. Calls attempting to update this field will be rejected with **400 Bad Request**.
2.  **Optimistic Updates**: The frontend must handle the **409 Conflict** case for "Unpay" actions (e.g., show an error toast if trying to unpay a past bill).

### Required Refactoring
- **Client Service:**
    - Remove `lastPaidPeriod` from `updateBill` payload.
    - Add `markBillPaid(id: string)` and `markBillUnpaid(id: string)` methods.
- **UI Components (`BillCard` / `BillsPage`):**
    - Update "Mark Paid" button to call the new endpoint.
    - Update "Mark Unpaid" button to call the new endpoint.
    - Handle loading states and error toasts (especially 409s).

### Migration Strategy
- Deploy backend changes first (with backward compatibility if possible, or simultaneous deploy).
- Since this is a controlled environment, a simultaneous deploy of Client + Server is recommended to avoid "Mark Paid" failures during rollout.

---

## Files to Change

### Server
1.  `server/src/utils/date.ts` (New file: Validation regex, Overflow logic).
2.  `server/src/schema/bill.ts` (Add validation validator to `lastPaidPeriod`).
3.  `server/src/routes/bill.ts`:
    - Remove `lastPaidPeriod` from `PUT` handler -> Reject with 400.
    - Add `POST /:id/pay` route.
    - Add `POST /:id/unpay` route.
4.  `server/src/services/bill.service.ts`:
    - Add `markAsPaid(id, userId)` logic (derives period internally).
    - Add `markAsUnpaid(id, userId)` logic (checks period match).

### Client
1.  `client/src/services/bill.service.ts` (Add new methods).
2.  `client/src/pages/bills/index.tsx` (Update handlers).
