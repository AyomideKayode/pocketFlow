# PocketFlow Server 🛡️

The backend API for PocketFlow, built with **Node.js**, **Express**, and **MongoDB**. It handles data persistence, authentication verification, and report generation.

## 🏗️ Architecture & Structure

The server is organized into routes, schemas, and services.

```sh
server/src/
├── lib/
│   └── firebaseAdmin.ts    # Firebase Admin SDK initialization
├── routes/
│   ├── financial-records.ts # CRUD operations for records
│   ├── budget.ts           # Budget management
│   ├── goal.ts             # Financial goals
│   └── reports.ts          # Aggregation and export endpoints
├── schema/
│   ├── financial-records.ts # Mongoose model (Indexed)
│   ├── budget.ts           # Budget model (Indexed)
│   └── goal.ts             # Goal model
├── services/
│   └── budget.service.ts   # Core budget logic
└── index.ts                # App entry point (CORS, DB connect)
```

## 🔌 API Endpoints

### Financial Records (`/financial-records`)

- `GET /getAllByUserId/:userId`: Retrieve all records for a specific user.
- `POST /`: Create a new financial record.
  - **Side Effect**: Triggers budget checks.
  - **Body**: `{ userId, date, description, amount, type, category, paymentMethod }`
  - **Validation**: `type` must be `'income'` or `'expense'`. `amount` is stored as positive.
- `PUT /:id`: Update an existing record.
  - **Side Effect**: Triggers budget checks (and potentially resets notifications).
- `DELETE /:id`: Delete a record.
  - **Side Effect**: Checks if budget is back within limits.

### Budgets (`/budgets`)

- `GET /:userId`: Retrieve budgets with calculated progress (spent vs limit).
- `POST /`: Create a budget.
- `PUT /:id`: Update a budget.
- `DELETE /:id`: Delete a budget.

### Reports (`/reports`)

- `GET /export`: Stream a CSV export of user records.
  - **Auth**: Requires `Authorization: Bearer <ID_TOKEN>`.
  - **Query Params**: `start`, `end`, `granularity`.

---

## 💾 Data Model

**FinancialRecord Schema** (MongoDB)

```typescript
interface FinancialRecord {
  userId: string; // Firebase UID
  date: Date;
  description: string;
  amount: number; // Always positive
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
}
// Indexes: { userId: 1, date: -1 }, { userId: 1, category: 1 }
```

**Budget Schema** (MongoDB)

```typescript
interface Budget {
  userId: string;
  category: string;
  amount: number;
  period: string; // YYYY-MM
  notified: boolean; // Tracks alert state
}
// Indexes: { userId: 1, category: 1, period: 1 } (Unique), { userId: 1, period: 1 }
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

## 🧠 Core Logic Features

### Smart Budget Notifications
The server implements logic to track budget adherence dynamically:
- **Checks**: Runs on Record Create, Update, and Delete.
- **Alerts**: Marks a budget as `notified=true` when spending exceeds the limit.
- **Resets**: Automatically resets `notified=false` if spending drops back below the limit (e.g., after deleting a record).
- **Optimization**: Uses optimized MongoDB aggregation pipelines to calculate spending totals efficiently.

### Server-Side Export
- **Endpoint**: `GET /reports/export`
- **Authentication**: Verifies Firebase ID token via Admin SDK.
- **Behavior**: Streams a CSV response using a Mongoose cursor to avoid loading large datasets into memory.

---

## 🧪 Testing Strategy

- **Unit Tests**: Test aggregation helpers (date bucketing, totals).
- **Integration Tests**: Use in-memory MongoDB to test API endpoints (`vitest` + `supertest`).
- **E2E Tests**: Validate full user flows (`playwright`).

See the root `README.md` for the full development roadmap.
