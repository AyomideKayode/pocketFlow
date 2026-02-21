# PocketFlow Client 🎨

The frontend application for PocketFlow, built with **React 19** and **TypeScript**, powered by **Vite**.

## 📖 Overview

This client-side application provides a responsive, privacy-focused interface for managing personal finances. It connects to the PocketFlow API and handles user authentication via Firebase.

---

## 🛠️ Tech Stack

- **Core**: React 19 + TypeScript
- **Build Tool**: Vite (Hot Module Replacement)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Visualization**: Recharts
- **Icons**: Lucide React
- **Auth**: Firebase SDK
- **State Management**: React Context API

---

## 📂 Project Structure

```sh
client/src/
├── components/       # Reusable UI components (Charts, Modals, etc.)
├── contexts/         # React Context (Auth, Toast, FinancialRecords)
├── pages/            # Page components (Dashboard, Transactions, Budgets, etc.)
├── landing/          # Landing page components
├── services/         # API service layers
├── hooks/            # Custom React hooks
├── utils/            # Helper functions (Formatting, Date logic)
├── assets/           # Static assets (Images, Icons)
└── App.tsx           # Root component with routing
```

---

## 🔑 Key Components

- **Auth System**: Firebase-based authentication managed via `AuthContext`. Handles login, registration, and session persistence.
- **Dashboard**: The main view featuring real-time charts (Income vs Expense) and recent transaction history.
- **Budgets**: Interface for setting monthly limits and visualizing progress bars with color-coded alerts.
- **Bills**: Manages recurring payments with "Upcoming", "Overdue", and "Paid" states.
- **Landing Page**: A high-conversion marketing page with scroll animations and responsive design.
- **Toast System**: A global notification system for user feedback (Success/Error messages).

---

## 🧠 State Management

- **Auth Context**: Manages the current user state (`user`, `loading`) and provides login/logout methods.
- **Financial Record Context**: Handles CRUD operations for transactions, including optimistic UI updates and server synchronization.
- **Toast Context**: Exposes a `showToast` method to trigger transient notifications from anywhere in the app.

---

## 🎨 Styling Approach

- **Theme**: Full Light/Dark mode support.
  - Persisted user preference via `localStorage` ('pocketflow-theme').
  - Uses semantic CSS variables (e.g., `--color-bg-primary`) mapped to Tailwind v4 theme.
  - Includes script to prevent Flash of Incorrect Theme (FOUC).
- **Accent**: Emerald Green (`#10b981`) for primary actions and positive values.
- **Typography**: Clean, sans-serif fonts for readability.
- **Responsive**: Mobile-first design using Tailwind's utility classes (e.g., `md:grid-cols-2`).

---

## 💻 Development

### Prerequisites

- Node.js 18+
- Backend server running on port 3001

### Setup & Run

1. **Install dependencies**

   ```bash
   cd client
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

---

## ⚙️ Environment Variables

Create a `.env` file in the `client/` directory:

```properties
# Backend API URL
VITE_API_BASE_URL=http://localhost:3001

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📦 Build & Deploy

To create a production build:

```bash
npm run build
```

The output will be generated in the `dist/` directory.

To preview the build locally:

```bash
npm run preview
```

---

## ✨ Key Features Implemented

- **Protected Routes**: Redirects unauthenticated users to the landing page.
- **CSV Import**: robust client-side parsing with validation and error reporting.
- **Date Range Filtering**: Global filter affecting all charts and lists.
- **Budget Alerts**: Visual indicators when spending exceeds defined limits.
- **Goal Tracking**: Progress bars for savings targets.
- **Responsive Navigation**: Adaptive sidebar/mobile menu.

---

## 🖼️ Image Handling Best Practices

To ensure performance and visual stability, we follow these guidelines for images:

1. **WebP Optimization**: All static assets should be converted to `.webp` for reduced file size.
2. **Explicit Sources**: Components like `ProductShowcase` use explicit paths for both `jpg` (fallback) and `webp` versions to avoid brittle string manipulation.
3. **Layout Stability**: Use `aspect-ratio` utilities (e.g., `aspect-[16/10]`) on containers to prevent layout shifts (CLS) while images load.
4. **Object Fit**: Use `object-cover` in combination with `w-full h-full` to ensure images fill their containers correctly without distortion.
