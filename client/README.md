# PocketFlow Client 🎨

The frontend application for PocketFlow, built with **React 19** and **TypeScript**, powered by **Vite**.

## 🏗️ Architecture & Structure

The application follows a modular structure focusing on feature-based organization and shared utilities.

```sh
client/src/
├── assets/         # Static assets (images, global styles)
├── components/     # Reusable UI components
│   ├── charts/     # Recharts visualizations (Pie, Bar, Line)
│   └── ...
├── contexts/       # React Context Providers
│   ├── auth-context.tsx            # Firebase Auth state
│   ├── financial-record-context.tsx # Data fetching & state
│   ├── budget-context.tsx          # Budget management
│   ├── goal-context.tsx            # Financial goals
│   └── toast-context.tsx           # Notification system
├── lib/            # External library configurations (Firebase)
├── pages/          # Route components
│   ├── auth/       # Login/Register pages
│   ├── dashboard/  # Main application view
│   ├── learn/      # Educational content & Insights
│   └── ...
├── utils/          # Helper functions
│   ├── chartDataTransforms.ts # Data aggregation logic
│   └── exportUtils.ts         # CSV export logic
└── App.tsx         # Main router and layout
```

## 🔑 Key Features & Implementation

### Authentication

Managed via `auth-context.tsx` using Firebase Authentication.

- **Providers**: Email/Password, Google OAuth.
- **Persistence**: Handled automatically by Firebase SDK.
- **Protection**: `ProtectedRoute` wrapper ensures only authenticated users access the dashboard.

### Dashboard & State

Financial records are managed in `financial-record-context.tsx`.

- **Fetching**: Loads records associated with the logged-in User ID.
- **Updates**: Optimistic UI updates for adding/deleting records.
- **Validation**: Frontend typing ensures `income` or `expense` categorization.
- **Performance**: Charts are lazy-loaded via `React.lazy` and `Suspense` to optimize initial load time.

### Analytics

Built with **Recharts**.

- **IncomeExpenseChart**: Pie chart for quick balance overview.
- **CategoryBreakdownChart**: Bar chart for spending habits.
- **TrendLineChart**: Line chart for historical data analysis.
- **Date Filtering**: All charts respond to the global date range filter.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `client/` directory with your Firebase configuration and Backend URL.

```properties
# Backend Connection
VITE_API_BASE_URL=http://localhost:3001

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### ESLint Configuration

This project uses extended ESLint rules for type-aware linting.

- **Standard**: `tseslint.configs.recommended`
- **Strict**: `tseslint.configs.strictTypeChecked` (Optional, can be enabled in `eslint.config.js`)

---

## 📜 Available Scripts

Run these commands from the `client/` directory:

- **`npm run dev`**: Starts the development server with HMR (Hot Module Replacement).
- **`npm run build`**: Compiles the TypeScript code and builds the production-ready bundle.
- **`npm run lint`**: Runs ESLint to catch code quality issues.
- **`npm run preview`**: Locally previews the production build.

---

## 🎨 Styling

- **CSS Modules**: Used for component-specific styles (e.g., `financial-record.css`).
- **Global Styles**: `App.css` and `index.css` define the dark theme variables and base typography.
- **Theme**: Dark mode by default (`#1a1a1a` background).

---

## 📦 Dependencies

Major libraries used:

- `react`, `react-dom` (v19)
- `react-router-dom` (Routing)
- `firebase` (Auth)
- `recharts` (Visualization)
- `lucide-react` (Icons)
