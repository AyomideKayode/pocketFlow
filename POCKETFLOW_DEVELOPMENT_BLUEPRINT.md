# PocketFlow Development Blueprint

## Overview

PocketFlow is a full-stack personal finance tracker designed for modern usability, robust data integrity, and insightful analytics. This document outlines the completed and planned development phases, implementation details, challenges overcome, and a roadmap for future work. It serves as a living blueprint to keep development focused and resilient, especially when facing bugs or complex refactors.

---

## Phases Covered So Far

### **Phase 1: Core UI & Authentication** ✅ COMPLETED

- **Features:**
  - Complete Firebase authentication (sign up, login, forgot password with recovery emails)
  - Toast notification system for all user feedback
  - Empty state components with contextual messaging
  - Confirmation dialogs for destructive actions (delete records)
  - Responsive dark-theme UI matching modern design standards
  - Protected routes with automatic redirection to auth page
  - User personalization (display name and email integration)

- **Implementation Details:**
  - **Frontend Stack:** React 19, TypeScript, Vite with hot reload
  - **Authentication:** Firebase SDK with auth-context.tsx for state management
  - **UI Components:** EmptyState component with variants (welcome, no-data, error)
  - **Toast System:** Context-based toast notifications with auto-dismiss
  - **Styling:** Modern dark theme (#1a1a1a, #2d2d2d) with gradient accents
  - **File Structure:**
    - `client/src/contexts/auth-context.tsx` - Auth state & Firebase integration
    - `client/src/contexts/toast-context.tsx` - Toast notifications
    - `client/src/pages/auth/index.tsx` - Authentication UI
    - `client/src/components/ProtectedRoute.tsx` - Route protection

- **Key Decisions:**
  - Firebase auth chosen for security and ease of implementation
  - Context API for state management to avoid prop drilling
  - Dark theme for visual consistency and modern appeal

- **Challenges Encountered & Solutions:**
  - **Challenge:** Synchronizing Firebase auth state with React component rendering
  - **Solution:** Implemented auth listener in context useEffect hook
  - **Challenge:** Handling loading states during auth initialization
  - **Solution:** Added isLoading flag to prevent flash of unauth UI
  - **Challenge:** New user empty state experience
  - **Solution:** Built dedicated welcome EmptyState variant with clear CTA

---

### **Phase 2A: Data Model & Critical Bug Resolution** ✅ COMPLETED

- **Features:**
  - Enhanced financial record model with required `type` enum field (`income` | `expense`)
  - Complete backend validation for all record fields
  - Frontend migration logic for legacy records without type field
  - Accurate income/expense calculations and categorization

- **Implementation Details:**
  - **Backend Updates:**
    - Updated Mongoose schema with type enum validation
    - Express POST route with explicit field destructuring
    - Validation: type field required, amount > 0, userId from Firebase
    - Used `Math.abs()` to ensure consistent positive amounts
    - File: `server/src/schema/financial-records.ts`
  - **Frontend Updates:**
    - Added type toggle UI in form (Income/Expense buttons with colors)
    - Migration logic to handle existing records without type
    - FinancialRecord interface updated with type field
    - File: `client/src/pages/dashboard/financialRecordForm.tsx`
  - **Database Changes:**
    - MongoDB records now require type field
    - Existing records migrated or filtered appropriately

- **Critical Bug Investigation (5+ Hour Debug Session):**
  - **Symptom:** All expense entries displayed as income in charts and calculations
  - **Initial Investigation:** Checked frontend calculations, chart components, data types
  - **Root Cause Discovery:** Frontend was connecting to production MongoDB server during development
  - **Actual Issue:** `.env.local` file was NOT being used; `.env` was taking precedence
    - Production server had production MongoDB with old data (missing type fields)
    - Development frontend was reading old records without type field
    - Records without type field defaulted to 'income' in calculations
  - **Resolution Steps:**
    1. Fixed environment variable precedence (`.env.local` overrides `.env`)
    2. Verified development frontend connects to localhost:3001
    3. Added explicit backend validation to prevent missing type fields
    4. Implemented frontend migration logic for legacy data
    5. Added comprehensive logging to catch similar issues early

- **Key Learnings:**
  - Environment file precedence is critical in development
  - Small data model issues can cause cascading calculation errors
  - Comprehensive logging at API boundaries helps isolate backend vs frontend issues
  - Type safety with enum fields prevents silent data corruption

---

### **Phase 2B: Dashboard Visualization & Time-Based Filtering** ✅ COMPLETED

- **Features:**
  - **Step 1: Chart Implementation**
    - Interactive pie chart: Income vs Expense breakdown with percentages
    - Interactive bar chart: Spending analysis by category
    - Responsive chart containers with dark theme styling
    - Real-time chart updates when records change
  - **Step 2: Time-Based Filtering**
    - Date range filter with preset buttons (Last 7/30/90 days, This Year, All Time)
    - Custom date range picker with validation
    - Real-time filtering of all dashboard data (balance + charts)
    - Visual indicator showing current selected period

- **Implementation Details:**
  - **Chart Components:**
    - `client/src/components/charts/ChartContainer.tsx` - Reusable wrapper
    - `client/src/components/charts/IncomeExpenseChart.tsx` - Pie chart using Recharts
    - `client/src/components/charts/CategoryBreakdownChart.tsx` - Bar chart for categories
    - Responsive grid layout: 2 columns on desktop, 1 on mobile
  - **Filtering Components:**
    - `client/src/components/DateRangeFilter.tsx` - Preset + custom date picker
    - Props: selectedRange (DateRange), onDateRangeChange callback
    - Presets calculated dynamically (e.g., 7 days ago to today)
  - **Data Processing:**
    - `client/src/utils/chartDataTransforms.ts` utility functions:
      - `filterRecordsByDateRange()` - Filter records by date
      - `getDefaultDateRange()` - Default to last 30 days
      - `groupRecordsByCategory()` - Group spending by category
      - `groupRecordsByMonth()` - Monthly aggregation for trends
      - `calculateTotals()` - Sum income/expenses
  - **Dashboard Integration:**
    - State management: `const [dateRange, setDateRange] = useState(getDefaultDateRange())`
    - Memoized filtering: `useMemo` for performance optimization
    - Balance totals now show "\*Based on selected time period"
    - All charts update when date range changes

- **UI/UX Details:**
  - **CSS Classes:** `.date-range-filter`, `.preset-btn`, `.preset-btn.active`, `.custom-date-form`
  - **Styling:**
    - Inactive buttons: Gray background (#3d3d3d) with border
    - Active preset: Purple gradient background with shadow
    - Custom form: Nested container with nested input fields
    - Responsive: Single-column date inputs on mobile
  - **Color Scheme:**
    - Primary: Purple gradient (#667eea → #764ba2)
    - Success (Apply button): Green gradient (#22c55e → #16a34a)
    - Background: Dark (#2d2d2d, #353535)

- **Technical Challenges & Solutions:**
  - **Challenge:** TypeScript strictness with Recharts props
    - **Solution:** Properly typed Recharts components with generic types
  - **Challenge:** Bundle size warning (867KB gzipped 266KB)
    - **Decision:** Deferred optimization; features prioritized over bundle size
    - **Note:** Recharts (~300KB) + React (~200KB) + Firebase (~200KB) = unavoidable baseline
  - **Challenge:** Ensuring all dashboard data responds to date filter
    - **Solution:** Memoized single source of truth with dateRange state
    - **Result:** Balance container and both charts update synchronously
  - **Challenge:** Performance with large datasets
    - **Solution:** Memoization prevents unnecessary re-renders of expensive calculations

- **Build Status:**
  - TypeScript compilation: ✅ Successful
  - Vite bundle: ✅ Successful (867KB main bundle)
  - Hot reload: ✅ Working in development
  - Production build: ✅ Tested and working

---

### **Phase 2C: Trend Analysis & Advanced Reporting** ✅ COMPLETED

- **Features:**
  - **Advanced Trend Analysis:**
    - Interactive Trend Line Chart with configurable granularity (Day, Week, Month).
    - Smooth curve interpolation ('monotone') for better visual trend identification.
    - Local timezone support ensures data aligns with user's wall-clock time (fixed critical timezone bugs).
  - **Frontend Polish & UX Enhancements:**
    - **Typography:** Integrated 'DM Sans' (Body), 'JetBrains Mono' (Code), and 'Space Mono' (Accents) via Tailwind CSS v4.
    - **Inline Editing:** Financial Record List now supports direct editing of Description, Amount, Category, and Payment Method cells.
    - **Visual Refinements:** Enhanced table layouts, status badges, and consistent dark theme styling.
  - **Data Export:**
    - Secure, streaming server-side CSV export implemented.
    - Client-side export backup.
  - **Infrastructure:**
    - Server development runtime switched to `tsx` for Node 22 compatibility.
    - Robust timezone handling in chart data transformations.

- **Implementation Details:**
  - **Chart Logic:**
    - `client/src/utils/chartDataTransforms.ts` refactored to use local date components for grouping keys.
    - Prevents date shifting issues for users in non-UTC timezones.
  - **Editable Table:**
    - Implemented optimistic UI updates for instant feedback during inline edits.
    - Validation ensures data integrity before backend sync.
  - **Server Compatibility:**
    - Replaced `ts-node` with `tsx` in `server/nodemon.json` to fix startup crashes on modern Node versions.

- **What's been validated:**
  - Chart grouping logic verified with timezone-aware unit tests (`chartDataTransforms.test.ts`).
  - Server startup and build processes confirmed working with new runtime configuration.
  - End-to-end export flows tested locally.

---

### **Phase 6: Quality Assurance & CI/CD** ✅ COMPLETED (Foundation)

- **Features:**
  - **Testing Infrastructure:**
    - **Client-Side:** Vitest + React Testing Library configured with jsdom environment.
    - **Server-Side:** Vitest + Supertest for API integration testing.
    - **End-to-End (E2E):** Playwright setup for critical user flow verification (Auth redirects).
  - **CI/CD Pipeline:**
    - GitHub Actions workflow (`.github/workflows/ci.yml`) created.
    - Automates linting, building, and testing for both client and server on every push/PR.
  - **Frontend Polish:**
    - Refined Navbar logic to hide redundant "Sign In" button on Auth page.
    - Enhanced Financial Record Form with split Income/Expense category lists.

- **Implementation Details:**
  - **Refactoring for Testability:**
    - Separated Server app logic (`server/src/app.ts`) from entry point (`server/src/index.ts`) to allow supertest integration without port conflicts.
  - **Configuration:**
    - `client/vite.config.ts` updated to support test environment.
    - `playwright.config.ts` added for headless browser testing.

- **Challenges Encountered & Solutions:**
  - **Challenge:** Configuring Vite/Vitest for a React + TypeScript project.
  - **Solution:** Added specific `test` configuration in `vite.config.ts` and created a `setup.ts` file for global test environments (jsdom).
  - **Challenge:** Testing Express API without starting the server.
  - **Solution:** Refactored `index.ts` to export the `app` instance, allowing Supertest to wrap it dynamically.

---

### **Optimization Sprint: UX & Stability** ✅ COMPLETED

- **Features:**
  - **Production Favicon:** Designed and implemented a custom wallet SVG favicon in Emerald-500.
  - **Dashboard Synchronization:** Fixed a stale data issue where new records were excluded from charts until refresh (updated date range logic to be end-of-day inclusive).
  - **Layout Fixes:** Resolved chart container warnings by enforcing stable minimum heights.
  - **Auth UX:** Added password visibility toggles (Eye/EyeOff) for better usability during sign-up/sign-in.
  - **Feedback Channel:** Added a "Report Bug" icon in the navbar to facilitate direct user feedback.

- **Implementation Details:**
  - **Date Logic:** Updated `getDefaultDateRange` and `DateRangeFilter` to use inclusive end-of-day timestamps (`23:59:59.999`).
  - **Components:** Integrated Lucide icons (`Eye`, `EyeOff`, `Bug`) into existing UI components.
  - **Styling:** Tailwind-based updates for responsive chart containers.

- **Key Learnings:**
  - **Date Intervals:** "Last 30 days" must include the _full_ current day to feel "real-time" to users.
  - **Chart Responsiveness:** Recharts requires explicit parent dimensions to avoid layout warnings during initial render.

---

## Planned Phases & Next Steps

### **Phase 4: Budgeting & Goals**

- **Features:**
  - Set monthly budgets per category
  - Visual progress bars and alerts
  - Goal tracking (e.g., savings targets)
- **Implementation Plan:**
  - New Mongoose models for budgets/goals
  - Context and UI for budget management
  - Notification system for budget overruns

### **Phase 5: Performance & Optimization**

- **Features:**
  - Bundle/code splitting for faster loads
  - Lazy loading of charts and heavy components
  - Backend query optimization
- **Implementation Plan:**
  - Dynamic imports for chart modules
  - Analyze and optimize MongoDB queries
  - Lighthouse audits and improvements

---

## Key Lessons & Resilience Strategies

### **From Phase 1 (Authentication)**

- Firebase integration is powerful but requires careful state management
- Context API is suitable for app-wide state (auth, toasts) but consider Redux for complex scenarios
- Empty states significantly improve UX for new users

### **From Phase 2A (Critical Bug Resolution)**

- **Environment Management:** CRITICAL - Always verify .env/.env.local precedence and double-check which server you're connecting to
  - Use logging to confirm API endpoints: `console.log('API_URL:', import.meta.env.VITE_API_BASE_URL)`
  - Test with `fetch('/financial-records', {headers: {'X-Debug': 'true'}})`
- **Explicit Validation:** Backend must validate ALL fields - never trust client-side validation alone
  - Use explicit destructuring: `const { userId, date, description, amount, category, paymentMethod, type } = req.body`
  - Validate types: `if (!['income', 'expense'].includes(type)) throw new Error(...)`
  - Ensure positive amounts: `const amount = Math.abs(parseFloat(req.body.amount))`
- **Data Model Clarity:** Use enums and TypeScript interfaces to prevent ambiguity
  - Define record interface early: `type TransactionType = 'income' | 'expense'`
  - Update schema BEFORE writing migrations

### **From Phase 2B (Chart Implementation)**

- **Third-party Library Strictness:** TypeScript strict mode catches Recharts prop mismatches
  - Test component interfaces early: `ReactElement<IncomeExpenseChartProps>`
  - Use proper typing with Recharts components
- **Performance with Data Transformations:** Memoization is essential
  - Use `useMemo` for expensive calculations: `useMemo(() => filterRecordsByDateRange(...), [records, dateRange])`
  - Don't re-calculate if inputs haven't changed
- **Bundle Size Awareness:** Accept that some features have unavoidable bundle cost
  - Document why bundle is large: Recharts + React + Firebase
  - Plan optimization (code splitting, lazy load) for Phase 5, not Phase 2

### **General Resilience Strategies**

- **Documentation is Key:** This blueprint saved hours by providing context when bugs appeared
- **Commit Messages Matter:** Detailed commits (like Phase 2B commit) provide forensic trail
- **Logging at Boundaries:** API request/response logging caught the production server issue
- **Progressive Enhancement:** Each phase builds on solid foundation from previous phase
- **User Feedback Loops:** Empty states, toasts, and clear error messages prevent user confusion

---

## Technical Architecture Summary

### **Frontend Stack**

- **Framework:** React 19 with TypeScript (~5.8.3)
- **Build Tool:** Vite with hot reload
- **State Management:** React Context (auth, financial records, toasts)
- **Authentication:** Firebase SDK with custom auth context
- **Charts:** Recharts library (300KB, justified by features)
- **Styling:** CSS modules + global CSS with dark theme
- **Bundle:** 867KB (warning acknowledged, optimization deferred to Phase 5)
- **Testing:** Vitest + React Testing Library (Unit/Integration), Playwright (E2E)
- **Analytics:** Vercel Analytics (Privacy-friendly web analytics)

### **Backend Stack**

- **Framework:** Express.js with TypeScript
- **Runtime:** Node.js with ESM modules
- **Database:** MongoDB Atlas with Mongoose ODM
- **Background Jobs:** MongoDB-backed Queue (for CSV exports)
- **API Style:** RESTful JSON endpoints
- **Port:** 3001 (development)
- **Development:** Nodemon with ts-node/esm loader

### **Data Model**

```typescript
interface FinancialRecord {
  _id?: string; // MongoDB ObjectId
  userId: string; // Firebase UID
  date: Date; // Transaction date
  description: string; // What was the transaction for
  amount: number; // Always positive (internally)
  category: string; // e.g., "groceries", "salary"
  paymentMethod: string; // e.g., "credit card", "cash"
  type: 'income' | 'expense'; // Transaction type (REQUIRED)
}
```

### **Key Environment Variables**

- **Client:**
  - `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:3001`)
  - `VITE_FIREBASE_*` - Firebase configuration keys
- **Server:**
  - `MONGODB_URI` - MongoDB connection string
  - `PORT` - Server port (default: 3001)

---

## How to Use This Blueprint

- **When stuck:** Review the phase breakdown and implementation notes for context. Check the "Challenges Encountered & Solutions" section.
- **When onboarding:** New contributors should read phases 1-2B to understand current architecture.
- **When planning:** Use the "Planned Phases" to prioritize next work and estimate scope.
- **When debugging:** Check the "Key Lessons" section - Phase 2A debug story is highly relevant to environment issues.
- **When implementing:** Follow the TypeScript and validation patterns established in earlier phases.
- **When optimizing:** Refer to Phase 5 & 6 planning for performance and deployment guidance.

---

- _Last updated: January 2, 2026 | Current Phase: 2B (Complete) | Next Phase: 2C (Trend Analysis & Advanced Reporting)_
- _Last updated: January 13, 2026 | Current Phase: 2C (Trend Analysis & Secure Export prototype) | Next Phase: 3 (Trend Analysis & Advanced Reporting)_
- _Last updated: January 14, 2026 | Current Phase: Refactoring & QA | Next Phase: 6 (Testing & CI/CD)_
- _Last updated: January 16, 2026 | Current Phase: 6 (QA & CI/CD Foundation Established) | Next Phase: 2C (Trend Analysis & Advanced Reporting - Completion)_
- _Last updated: January 18, 2026 | Current Phase: 2C (Trend Analysis & Advanced Reporting - Completed) | Next Phase: 4 (Budgeting & Goals)_
- _Last updated: January 19, 2026 | Current Phase: Optimization Sprint (UX & Stability) | Next Phase: 4 (Budgeting & Goals)_
- _Last updated: January 20, 2026 | Current Phase: Phase 4 Preparation (Sidebar Navigation) | Next Phase: 4 (Budgeting & Goals)_

---

### **Phase 4 Preparation: Sidebar Navigation & Layout Refactor** ✅ COMPLETED

- **Features:**
  - **Sidebar Navigation:**
    - Replaced top navigation with a responsive left-side sidebar.
    - Top navbar now contains only Branding, Menu Toggle, and Feedback icon.
    - Sidebar includes links to Dashboard, Transactions, Budgets, and Goals.
    - User Profile moved to the bottom of the sidebar.
    - Responsive behavior: Collapsible sidebar on desktop, slide-out drawer on mobile.
  - **Dedicated Transactions Page:**
    - Created `/transactions` route for full financial record management.
    - Moved "Add Transaction" modal logic to this new page.
  - **Dashboard Simplification:**
    - Dashboard now acts as a high-level overview.
    - "Recent Transactions" list limited to top 5 records.
    - "Add Transaction" shortcut redirects to the Transactions page.
  - **Placeholder Pages:**
    - Created placeholder components for `/budgets` and `/goals` to prepare for Phase 4 features.

- **Implementation Details:**
  - **Layout Architecture:**
    - Created `DashboardLayout` component to wrap authenticated routes.
    - Manages sidebar state (open/closed) and responsive transitions.
    - `App.tsx` refactored to use nested routes within `DashboardLayout`.
  - **Component Refactoring:**
    - `FinancialRecordList` updated to accept a `limit` prop and handle sorting by date.
    - `Navbar` stripped of user controls, now accepts `onToggleSidebar` prop.

- **Key Learnings:**
  - **Layout State:** Centralizing layout state (sidebar open/close) in a layout wrapper (`DashboardLayout`) simplifies state management compared to prop drilling from App root.
  - **Routing Structure:** Grouping authenticated routes under a common layout route allows for cleaner `App.tsx` and easier context sharing.

---

Implementation tasks (rough order):

1. Add Google OAuth provider in `client/src/lib/firebase.ts` + update `auth-context.tsx` to handle provider sign-in flows and account linking.
2. Implement background export job system (choose lightweight queue: BullMQ / Bee-Queue / simple worker process) and endpoints to create export jobs and retrieve results.
3. Create and run unit + integration tests for aggregation and export functionality; wire tests into CI.
4. Implement server-side rate-limiting and export quotas; add monitoring/alerting hooks.
5. Expand dashboard with export management UI and progress tracking.
6. Prepare deployment checklist: secure service account handling, CI secrets, and migration notes.

Acceptance criteria for Phase 3:

- Google OAuth sign-in + account linking works for new and existing users without data loss.
- Export flows for large datasets operate asynchronously, with secure, time-limited downloadable artifacts and telemetry for success/failure rates.
- Aggregation utilities have unit tests with >90% coverage for core behaviors (bucketing, totals).

---

## Short-term Roadmap Additions (requested)

### Phase 3: OAuth Integration

- Google Sign-In (most popular)
- GitHub Sign-In (developer-friendly)
- Social auth buttons

### Phase 4: Server-Side Security

- Firebase Admin SDK integration
- Token verification middleware
- Secure API endpoints
- User authorization checks

### Phase 5: Advanced Features

- User profile management
- Data export/import
- Advanced analytics (consider Firebase Analytics for telemetry)

---
