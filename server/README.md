# PocketFlow Server 🛡️

The backend API for PocketFlow, built with **Node.js**, **Express**, and **MongoDB**. It handles data persistence, authentication verification, and report generation.

## 🏗️ Architecture & Structure

The server is organized into routes, schemas, services, middleware, scripts, and utilities.

```sh
server/src/
├── lib/
│   └── firebaseAdmin.ts         # Firebase Admin SDK initialization
│   └── email/                  # Email sending providers and templates
│       ├── types.ts            # Email type definitions
│       ├── providers/          # Email provider implementations (console, resend)
│       └── templates/          # Email templates (budget alert, goal achieved, etc.)
├── middleware/
│   └── auth.ts                 # Express middleware for authentication
├── routes/
│   ├── analytics.ts            # Analytics endpoints
│   ├── bill.ts                 # Bill management (CRUD, pay/unpay)
│   ├── budget.ts               # Budget management
│   ├── cloudinary.ts           # Cloudinary signature endpoints
│   ├── cron.ts                 # Scheduled/recurring jobs
│   ├── financial-records.ts    # CRUD operations for records
│   ├── goal.ts                 # Financial goals
│   ├── insights.ts             # Deterministic insight generation
│   ├── reports.ts              # Aggregation and export endpoints
│   ├── user-preferences.ts     # User preferences (currency, theme, etc.)
│   └── user-profile.ts         # User profile management
├── schema/
│   ├── bill.ts                 # Bill schema
│   ├── budget.ts               # Budget schema
│   ├── export-job.ts           # Export job tracking
│   ├── financial-records.ts    # Financial record schema
│   ├── goal.ts                 # Goal schema
│   ├── import-job.ts           # Import job tracking
│   └── user-profile.ts         # User profile schema
├── scripts/
│   └── test-email.ts           # Script for testing email sending
├── services/
│   ├── analytics.service.ts    # Analytics logic
│   ├── bill.service.ts         # Bill logic
│   ├── budget.service.ts       # Budget logic
│   ├── email.service.ts        # Email sending logic
│   ├── exportService.ts        # Export logic
│   ├── goal.service.ts         # Goal logic
│   ├── insight.service.ts      # Insights logic
│   ├── notifications.test.ts   # Notification logic tests
│   └── summary.service.ts      # Weekly summary logic
├── utils/
│   ├── currency.ts             # Currency formatting helpers
│   └── date.ts                 # Date utilities and validation
├── app.test.ts                 # Main app integration tests
├── app.ts                      # Express app setup
└── index.ts                    # App entry point (CORS, DB connect)
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

### Insights (`/insights`)

- `GET /`: Retrieve personalized financial insights.
  - **Auth**: Requires `Authorization: Bearer <ID_TOKEN>`.
  - **Returns**: Array of `Insight` objects (Upcoming Bills, Subscription Checks).

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

# Cloudinary (Required for profile image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Note**: `FIREBASE_SERVICE_ACCOUNT_PATH` should point to your Firebase Service Account JSON file. Do not commit this file to version control.
**Note**: `CLOUDINARY_API_SECRET` is sensitive. Keep it out of version control and load it via environment variables/secret manager.

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

### Bill Management

- **Bill CRUD**: Endpoints and logic for creating, updating, paying, and unpaying bills.
- **Validation**: Ensures correct period and payment status, with server-side checks.
- **Schema**: Tracks bill details, payment history, and user association.

### User Profile & Preferences

- **Profile Management**: Endpoints for updating user profile data (name, photo, etc.).
- **Preferences**: Endpoints for user settings such as currency and theme.
- **Schema**: Stores user profile and preferences separately for flexibility.

### Cloudinary Integration

- **Direct Uploads**: Secure signature generation for client-side image uploads.
- **Security**: Only authenticated users can request upload signatures.

### Analytics & Insights

- **Analytics**: Endpoints and services for aggregating user financial data.
- **Insights**: Deterministic, rule-based engine for generating financial nudges (e.g., upcoming bills, subscription checks).

### Email Notifications

- **Providers**: Pluggable email providers (console, Resend, etc.).
- **Templates**: Modular email templates for budget alerts, goal achievements, weekly summaries, and more.
- **Service**: Centralized logic for sending and testing notifications.

### Data Import & Export

- **Export**: Streaming CSV export of user records, tracked by export-job schema.
- **Import**: CSV import job tracking and validation (import-job schema).

### Scheduled Jobs

- **Cron**: Endpoints and logic for scheduled tasks (e.g., weekly summaries).

### Utilities

- **Currency**: Helpers for formatting and validating currency values.
- **Date**: Utilities for date parsing, validation, and overflow logic.

### Testing

- **Integration & Unit Tests**: Comprehensive tests for routes, services, and notification logic using Vitest and Supertest.
- **Scripts**: Standalone scripts for testing email delivery and other features.

---

## 🧪 Testing Strategy

- **Unit Tests**: Test aggregation helpers (date bucketing, totals).
- **Integration Tests**: Use in-memory MongoDB to test API endpoints (`vitest` + `supertest`).
- **E2E Tests**: Validate full user flows (`playwright`).

See the root `README.md` for the full development roadmap.
