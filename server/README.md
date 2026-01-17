# PocketFlow Server 🛡️

The backend API for PocketFlow, built with **Node.js**, **Express**, and **MongoDB**. It handles data persistence, authentication verification, and report generation.

## 🏗️ Architecture & Structure

The server is organized into routes, schemas, and libraries.

```
server/src/
├── lib/
│   └── firebaseAdmin.ts    # Firebase Admin SDK initialization
├── routes/
│   ├── financial-records.ts # CRUD operations for records
│   └── reports.ts          # Aggregation and export endpoints
├── schema/
│   └── financial-records.ts # Mongoose model definition
└── index.ts                # App entry point (CORS, DB connect)
```

## 🔌 API Endpoints

### Financial Records (`/financial-records`)

*   `GET /getAllByUserId/:userId`: Retrieve all records for a specific user.
*   `POST /`: Create a new financial record.
    *   **Body**: `{ userId, date, description, amount, type, category, paymentMethod }`
    *   **Validation**: `type` must be `'income'` or `'expense'`. `amount` is stored as positive.
*   `PUT /:id`: Update an existing record.
*   `DELETE /:id`: Delete a record.

### Reports (`/reports`)

*   `GET /export`: Stream a CSV export of user records.
    *   **Auth**: Requires `Authorization: Bearer <ID_TOKEN>`.
    *   **Query Params**: `start`, `end`, `granularity`.

---

## 💾 Data Model

**FinancialRecord Schema** (MongoDB)

```typescript
interface FinancialRecord {
  userId: string;         // Firebase UID
  date: Date;
  description: string;
  amount: number;         // Always positive
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
}
```

---

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the `server/` directory.

```properties
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pocketflow

# Server Port
PORT=3001

# Firebase Admin SDK (Required for reports/auth verification)
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/serviceAccountKey.json
```

**Note**: `FIREBASE_SERVICE_ACCOUNT_PATH` should point to your Firebase Service Account JSON file. Do not commit this file to version control.

---

## 📤 Server-Side Export (Feature Deep Dive)

This section describes the CSV export feature prototyped during Phase 2C.

### What it does
*   **Endpoint**: `GET /reports/export`
*   **Authentication**: Verifies Firebase ID token via Admin SDK.
*   **Behavior**: Streams a CSV response using a Mongoose cursor to avoid loading large datasets into memory.

### Why Server-Side?
*   **Security**: Verifies tokens and queries strictly by authenticated user ID.
*   **Scalability**: Streaming reduces memory footprint compared to client-side generation.
*   **Consistency**: Centralized formatting logic.

### Production Considerations
*   **Rate Limiting**: Should be added to prevent abuse.
*   **Background Jobs**: For extremely large datasets, consider moving to an async job queue (e.g., BullMQ) instead of synchronous streaming.
*   **Service Account**: Ensure credentials are managed securely in production (e.g., via Secret Manager or strict env vars).

---

## 🧪 Testing Strategy (Planned)

*   **Unit Tests**: Test aggregation helpers (date bucketing, totals).
*   **Integration Tests**: Use in-memory MongoDB to test API endpoints.
*   **E2E Tests**: Validate full user flows.

See the root `README.md` for the full development roadmap.
