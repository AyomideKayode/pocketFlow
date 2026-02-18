# PocketFlow Server 🛡️

The backend API for PocketFlow, built with **Node.js**, **Express**, and **MongoDB**. It handles data persistence, authentication verification, and report generation.

## 📖 Overview

This server provides a RESTful API for managing personal finance data. It enforces strict validation rules and handles complex business logic like recurring bills, budget alerts, and data insights.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose (Schema validation)
- **Auth**: Firebase Admin SDK
- **Email**: Resend (via Nodemailer transport)
- **Security**: JWT verification, Input sanitization

---

## 📂 Project Structure

```
server/src/
├── routes/          # API endpoints (Controllers)
├── schema/          # Mongoose data models
├── services/        # Business logic & external integrations
├── middleware/      # Authentication & Error handling
├── utils/           # Helper functions (Dates, Currency)
├── lib/             # Third-party library configurations
├── scripts/         # Maintenance & testing scripts
└── index.ts         # Server entry point
```

---

## 🔌 API Documentation

### Authentication
All protected endpoints require a Firebase ID token in the `Authorization` header:
`Authorization: Bearer <firebase_id_token>`

### Key Endpoints

#### Financial Records
- `GET /financial-records/getAllByUserId/:userId`: Retrieve records with filtering & pagination.
- `POST /financial-records`: Create a new transaction (Income/Expense).
- `PUT /financial-records/:id`: Update a transaction.
- `DELETE /financial-records/:id`: Remove a transaction.

#### Budgets
- `GET /budgets`: List budgets with current spending progress.
- `POST /budgets`: Set a monthly limit for a category.
- `PUT /budgets/:id`: Update budget amount or category.
- `DELETE /budgets/:id`: Remove a budget.

#### Bills
- `GET /bills`: List recurring and one-time bills.
- `POST /bills`: Create a new bill.
- `POST /bills/:id/pay`: Mark a bill as paid for the current period.
- `POST /bills/:id/unpay`: Revert payment status (current period only).
- `PUT /bills/:id`: Update bill details (excludes payment history).
- `DELETE /bills/:id`: Remove a bill.

#### Goals
- `GET /goals`: List financial goals.
- `POST /goals`: Create a savings target.
- `PUT /goals/:id`: Update goal progress.

#### Insights
- `GET /insights`: Retrieve deterministic financial advice (e.g., upcoming bills).

---

## 💾 Data Models

### FinancialRecord
- `userId`: String (Firebase UID)
- `description`: String
- `amount`: Number (Always positive)
- `type`: 'income' | 'expense'
- `category`: String
- `date`: Date
- `paymentMethod`: String

### Budget
- `userId`: String
- `category`: String
- `amount`: Number
- `notified`: Boolean (Tracks alert state)

### Bill
- `userId`: String
- `name`: String
- `amount`: Number
- `dueDay`: Number (1-31)
- `isRecurring`: Boolean
- `lastPaidPeriod`: String (YYYY-MM)

### Goal
- `userId`: String
- `name`: String
- `targetAmount`: Number
- `currentAmount`: Number
- `deadline`: Date (Optional)
- `achievedNotified`: Boolean

---

## 🏗️ Services Architecture

- **BudgetService**: Handles budget creation and checks for overspending.
- **GoalService**: Manages goal progress and achievement notifications.
- **BillService**: centralized logic for bill payments and "paid" status determination.
- **InsightService**: Generates rule-based insights (e.g., "Subscription Check").
- **EmailService**: Sends transactional emails using templates (Resend/Console).
- **SummaryService**: Generates weekly financial summaries via cron jobs.

---

## 🧠 Key Design Decisions

1.  **Server-Side Authority**:
    -   Payment logic and "is paid" status are calculated on the server to prevent client-side state manipulation.
    -   Budget alerts are triggered by server-side hooks on record creation/updates.

2.  **Strict Validation**:
    -   Period strings must match `YYYY-MM`.
    -   Due days are normalized (e.g., Feb 30 -> Feb 28).

3.  **Idempotency**:
    -   Notification flags (`notified`, `achievedNotified`) prevent duplicate alerts.
    -   Weekly summaries track the last sent week to avoid re-sending.

4.  **Derived State**:
    -   Bill status (Overdue/Paid/Upcoming) is derived at runtime from `lastPaidPeriod` vs `currentDate`.

---

## 💻 Development

### Prerequisites
- Node.js 18+
- MongoDB instance running

### Setup & Run

1.  **Install dependencies**
    ```bash
    cd server
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```
    Server runs on `http://localhost:3001`.

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

```properties
PORT=3001
MONGO_URI=mongodb://localhost:27017/pocketflow
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/serviceAccountKey.json
FIREBASE_PROJECT_ID=your_project_id
EMAIL_USER=resend
EMAIL_PASS=your_resend_api_key
EMAIL_FROM=noreply@pocketflow.app
```

---

## 🛡️ Security Measures

- **Firebase Verification**: Every request is authenticated against Firebase Auth.
- **User Isolation**: Middleware ensures users can only access their own data.
- **Input Validation**: Schema-level validation prevents invalid data types.
- **Sanitization**: Inputs are cleaned to prevent injection attacks.

---

## 🔔 Notification System

- **Budget Alerts**: Triggered when spending exceeds 100% of the budget.
- **Goal Achievements**: Sent when a goal reaches its target amount.
- **Weekly Summaries**: A cron job runs every Monday to send a digest of the previous week's activity.

---

## 🧪 Testing

Run the test suite using Vitest:

```bash
npm test
```
