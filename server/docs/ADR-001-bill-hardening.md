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

**Trade-offs & Risks:**
- **Risk:** "Unpaying" a bill wipes the `lastPaidPeriod` entirely. If a user paid a bill in January (`2024-01`) and accidentally marks it as paid in February (`2024-02`), then clicks "Unmark Paid", the system reverts to `null` (Unpaid for all time), losing the January record.
- **Mitigation:** This is an acceptable constraint of the current `Bill` schema (which only tracks *most recent* payment). A full history would require a separate `BillPayment` entity, which is out of scope for this hardening pass.

### 2. Period Format Validation

We will enforce strict format validation for the `period` string (`YYYY-MM`) at the API boundary.

**Location:**
- A new centralized utility file: `server/src/utils/date.ts`.
- **Regex:** `/^\d{4}-(0[1-9]|1[0-2])$/`

**Behavior:**
- Invalid formats will be rejected with a `400 Bad Request` before reaching the service layer.
- Schema-level validation (Mongoose) will also use this regex for double safety.

### 3. Due Day Overflow Rule

The logic to handle "Day 31 in February" must be consistent and reusable.

**Location:**
- `server/src/utils/date.ts`

**Implementation:**
- Function: `normalizeDueDay(year: number, month: number, day: number): Date`
- Logic: If `day` exceeds the number of days in the given month, it clamps to the **last day of that month**.

### 4. Timezone & Period Computation

**Current Behavior:**
- Periods are derived from **Server Time (UTC)**.
- Example: A user in New York (UTC-5) paying a bill at 8 PM on Jan 31st will be recorded as paying in **February** (Feb 1st UTC).

**Decision:**
- We acknowledge this behavior as **intentional** for Phase 11B to maintain determinism without complex user-timezone logic.
- **Future Implication:** When we move to user-locale evaluation (Phase 12+), we will need to pass the user's timezone or a client-provided reference timestamp (validated within a reasonable skew) to the `pay` endpoint.

---

## Frontend Impact

This design introduces breaking changes to the frontend `BillService`.

### Breaking Changes
1.  **`PUT /bills/:id`**: Will no longer accept `lastPaidPeriod`. Calls attempting to update this field will be ignored or rejected (server-side strictness).
2.  **Optimistic Updates**: The frontend can no longer simply toggle a boolean. It must understand that "marking paid" is a server-authoritative action.

### Required Refactoring
- **Client Service:**
    - Remove `lastPaidPeriod` from `updateBill` payload.
    - Add `markBillPaid(id: string)` and `markBillUnpaid(id: string)` methods.
- **UI Components (`BillCard` / `BillsPage`):**
    - Update "Mark Paid" button to call the new endpoint.
    - Update "Mark Unpaid" button to call the new endpoint.
    - Handle loading states for these specific actions.

### Migration Strategy
- Deploy backend changes first (with backward compatibility if possible, or simultaneous deploy).
- Since this is a controlled environment, a simultaneous deploy of Client + Server is recommended to avoid "Mark Paid" failures during rollout.

---

## Files to Change

### Server
1.  `server/src/utils/date.ts` (New file: Validation regex, Overflow logic).
2.  `server/src/schema/bill.ts` (Add validation validator to `lastPaidPeriod`).
3.  `server/src/routes/bill.ts`:
    - Remove `lastPaidPeriod` from `PUT` handler.
    - Add `POST /:id/pay` route.
    - Add `POST /:id/unpay` route.
4.  `server/src/services/bill.service.ts`:
    - Add `markAsPaid(id, userId)` logic.
    - Add `markAsUnpaid(id, userId)` logic.

### Client
1.  `client/src/services/bill.service.ts` (Add new methods).
2.  `client/src/pages/bills/index.tsx` (Update handlers).
