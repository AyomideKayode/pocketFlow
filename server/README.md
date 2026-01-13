# pocketFlow — Server README

This document describes the server-side CSV export feature that was prototyped during Phase 2C, why it was added, and considerations for a future production-ready implementation.

## What the server export does (prototype)

- Endpoint: `GET /reports/export`
- Authentication: requires a Firebase ID token in the `Authorization: Bearer <ID_TOKEN>` header; tokens are verified with the Firebase Admin SDK.
- Query parameters supported: `start` (YYYY-MM-DD), `end` (YYYY-MM-DD), and `granularity` (optional: `daily|weekly|monthly`).
- Behavior: verifies the token, finds the authenticated user's financial records in MongoDB, applies optional date filters, aggregates by the requested granularity (if provided), and streams a CSV response with appropriate `Content-Type` and `Content-Disposition` headers.
- Implementation note: the prototype uses a Mongoose cursor to stream rows rather than loading the entire result set into memory.

## Why server-side export can be useful

- Security: the server verifies ID tokens and queries records by the authenticated user server-side — reduces risk of exposing other users' data compared with unauthenticated endpoints.
- Scalability: streaming via a cursor reduces memory usage for large datasets compared to building a complete CSV in memory on the client or server.
- Consistency: server-side aggregation ensures all clients receive consistent data formatting and reduces client-side CPU/logic for heavy aggregations.

## Trade-offs & considerations before production

- Authentication: the server requires a Firebase service account (private key) to verify ID tokens. Do not commit service account JSON to the repo; provide it via secure environment variables (`FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT_JSON`) in CI/CD.
- Rate limiting & abuse: implement rate limiting or require additional authorization (e.g., user roles, OTP) if exports are heavy or sensitive.
- Privacy & compliance: exporting full financial records may require logging, user consent, or data retention policies depending on jurisdiction.
- Pagination and partial exports: allow chunked exports or background export jobs for very large datasets; consider producing a time-limited pre-signed download link instead of synchronous streaming.
- CSV format and encoding: support UTF-8 with BOM for compatibility, and document column schema/versioning for downstream consumers.
- Monitoring: capture telemetry (export requests, sizes, durations) and error handling for long-running exports.

## Testing strategy (high level)

- Unit tests: test the aggregation helpers (date bucketing, totals, CSV row formatting) in isolation using deterministic sample records.
- Integration tests: spin up a test instance of the server with an in-memory MongoDB (or a test database) and a mocked Firebase Admin (or use short-lived test tokens). Verify that `GET /reports/export` returns expected CSV content, correct headers, and status codes for valid/invalid tokens.
- E2E tests: simulate a real client flow (sign in, create records, request export) to validate auth and end-to-end behaviour.

## Next steps to harden this feature

1. Add comprehensive unit and integration tests (see testing strategy)
2. Add CI job to run typecheck, lint, and tests on branches/PRs
3. Move export to background job if dataset sizes or export durations become large
4. Add server-side rate limiting and request quotas
5. Add monitoring and error alerts for export failures

## Where to look in the codebase

- Route implementation: `server/src/routes/reports.ts`
- Firebase Admin helper: `server/src/lib/firebaseAdmin.ts`
- Database models: `server/src/schema/financial-records.ts`

## Decision guidance

If you expect users to frequently export small-to-medium datasets, a secure synchronous streaming endpoint is acceptable. If exports are large, sensitive, or shared, prefer an asynchronous export job with background processing and secure, time-limited download links.
