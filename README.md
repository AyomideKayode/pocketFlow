# PocketFlow 💸

**PocketFlow** is a modern, full-stack personal finance tracker designed to help users manage their income and expenses with ease. Built with reliability and user experience in mind, it features secure authentication, real-time analytics, and data integrity checks.

![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![License](https://img.shields.io/badge/License-ISC-blue)

## 🚀 Key Features

- **Secure Authentication**: Flexible sign-in options including Email/Password and Google OAuth (via Firebase Authentication).
- **Financial Dashboard**: Interactive overview of your financial health with real-time updates.
- **Analytics & Visualization**:
  - **Income vs. Expense**: Visual breakdown using Pie charts.
  - **Category Analysis**: Spending habits categorized by type.
  - **Trend Analysis**: Track financial activity over time.
- **Data Management**:
  - Add, edit, and delete financial records.
  - **CSV Export**: Download your financial data for external analysis (Client & Server-side support).
- **Responsive Design**: A sleek, dark-themed UI that works on desktop and mobile.

---

## 🛠️ Tech Stack

### Frontend (Client)

- **Framework**: [React 19](https://react.dev/)
- **Language**: TypeScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: React Context API
- **Styling**: CSS Modules, Dark Theme
- **Charts**: [Recharts](https://recharts.org/)

### Backend (Server)

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose ODM)
- **Authentication**: Firebase Admin SDK

---

## 📂 Project Structure

This repository is a monorepo containing both the client and server applications:

- **`client/`**: The React frontend application.
- **`server/`**: The Express backend API.

See the respective `README.md` files in each directory for detailed documentation:

- [Client Documentation](./client/README.md)
- [Server Documentation](./server/README.md)

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Instance (Local or Atlas)
- Firebase Project (for Authentication)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pocketflow.git
cd pocketflow
```

### 2. Setup Server

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in `server/` based on `.env.example`:

```bash
# server/.env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pocketflow
PORT=3001
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/serviceAccountKey.json
```

### 3. Setup Client

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

Create a `.env` file in `client/` based on `.env.example`:

```bash
# client/.env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_BASE_URL=http://localhost:3001
```

### 4. Run the Application

**Start the Backend:**

```bash
# In server/ terminal
npm run dev
```

**Start the Frontend:**

```bash
# In client/ terminal
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🗺️ Development Journey & Roadmap

PocketFlow is being built in distinct phases to ensure stability and code quality.

### ✅ Completed Phases

- **Phase 1: Core Foundation**: Set up React+Vite, Firebase Auth, and basic UI structure.
- **Phase 2A: Data Integrity**: Implemented robust backend validation, `income`/`expense` typing, and bug fixes for environment configurations.
- **Phase 2B: Visualization**: Added Recharts for spending breakdowns and date range filtering.
- **Phase 2C: Trend Analysis & Advanced Reporting**: Completed configurable trend charts (Day/Week/Month), server-side CSV exports, and UI polish (Fonts, Editable Cells).
- **Phase 3: OAuth Integration**: Added Google Sign-In and account linking capabilities.
- **Phase 6: Quality Assurance**: Established Testing Infrastructure (Vitest, Playwright) and CI/CD Pipelines (GitHub Actions).

### 🔮 Future Direction

- **Phase 4: Budgeting & Goals**: Set monthly limits and savings targets.
- **Phase 5: Performance**: Code splitting, lazy loading, and query optimization.

For a detailed history of the development process, challenges, and architectural decisions, see the [Development Blueprint](./POCKETFLOW_DEVELOPMENT_BLUEPRINT.md).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
