# PocketFlow 💸

> A privacy-first personal finance tracker built with modern web technologies.

![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20TypeScript%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20Firebase-blue)
![License](https://img.shields.io/badge/License-ISC-blue)

[Live Demo](#) | [Documentation](./docs) | [Report Bug](https://github.com/yourusername/pocketflow/issues)

---

## 📖 Overview

**PocketFlow** solves the problem of scattered financial data without compromising privacy. Unlike other trackers that require bank credentials, PocketFlow operates on a **manual-first** principle with **smart automation** capabilities.

### Core Value Proposition
- 🔒 **Privacy First**: Your data stays yours. No bank account linking required.
- ⚡ **Simplicity**: Clean, distraction-free interface focused on what matters.
- 🧠 **Smart Insights**: Deterministic algorithms analyze your spending habits.

### Target Users
- Privacy-conscious individuals who want control over their financial data.
- Users who prefer manual tracking or CSV imports over direct bank integration.

---

## ✨ Key Features

- 💸 **Bills & Subscriptions**: Track recurring payments and avoid late fees.
- 📊 **Smart Budget Tracking**: Set monthly limits and get alerted *before* you overspend.
- 📈 **Spending Insights & Analytics**: Visual analytics for income, expenses, and category breakdowns.
- 🎯 **Financial Goals**: Set savings targets and track your progress.
- 📧 **Email Notifications**: Receive weekly summaries and budget alerts.
- 📂 **CSV Import/Export**: Robust data handling with smart parsing and validation.
- 🎨 **Production-Grade Landing Page**: High-conversion marketing site included.

---

## 📸 Screenshots

| Landing Page | Dashboard |
|:---:|:---:|
| ![Landing Page](./docs/assets/landing-preview.png) | ![Dashboard](./docs/assets/dashboard-preview.png) |

| Budgets & Goals | Mobile View |
|:---:|:---:|
| ![Budgets](./docs/assets/budgets-preview.png) | ![Mobile](./docs/assets/mobile-preview.png) |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Framer Motion**
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** + **Express** + **TypeScript**
- **MongoDB** + **Mongoose**
- **Firebase Auth** (Admin SDK)
- **Resend** for email notifications

### Infrastructure
- RESTful API architecture
- JWT-based authentication (Firebase ID Tokens)
- Server-side validation
- Responsive design (mobile-first)

---

## 🏗️ Architecture Overview

The application follows a standard **Client-Server** architecture with a clear separation of concerns.

```mermaid
graph TD
    Client[Client (React + Vite)] <-->|REST API (JSON)| Server[Server (Express + Node.js)]
    Server <-->|Mongoose| DB[(MongoDB)]
    Client <-->|Auth SDK| Firebase[Firebase Auth]
    Server <-->|Admin SDK| Firebase
    Server -->|SMTP/API| Email[Email Service (Resend)]
```

### Key Design Decisions
1.  **Manual Tracking**: Deliberate choice to avoid bank APIs (Plaid/Yodlee) for privacy and "active" financial awareness.
2.  **Firebase Auth**: Offloads complexity of secure authentication while keeping user data in our own MongoDB.
3.  **Server-Side Authority**: All critical logic (bill payments, budget calculations) resides on the server to prevent client-side manipulation.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (Local or Atlas)
- Firebase Project (Authentication enabled)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/pocketflow.git
    cd pocketflow
    ```

2.  **Install dependencies**
    ```bash
    # Install dependencies for both client and server
    npm install
    cd client && npm install
    cd ../server && npm install
    ```

3.  **Set up Environment Variables**
    - Copy `.env.example` to `.env` in both `client/` and `server/` directories.
    - Fill in your Firebase and MongoDB credentials.

4.  **Run Development Servers**
    ```bash
    # Terminal 1: Server
    cd server
    npm run dev

    # Terminal 2: Client
    cd client
    npm run dev
    ```

---

## 📂 Project Structure

```
pocketflow/
├── client/          # React frontend application
├── server/          # Express backend API
├── docs/            # Documentation & specifications
└── README.md        # This file
```

---

## 📅 Development Phases

- **Phase 1**: Core UI & Auth ✅
- **Phase 2**: Data Model & Visualization ✅
- **Phase 3**: Budget System ✅
- **Phase 4**: Goals & Insights ✅
- **Phase 5**: Bills Management ✅
- **Phase 6**: Production Landing Page ✅

For a detailed history, see [Development Blueprint](./POCKETFLOW_DEVELOPMENT_BLUEPRINT.md).

---

## 🧠 Key Architectural Decisions

- **Manual Tracking**: Prioritizes privacy and mindfulness over automation.
- **Firebase Auth**: Industry-standard security for identity management.
- **MongoDB**: Flexible schema for evolving financial data models.
- **Server-Side Authority**: Ensures data integrity and consistent business logic.
- **Deterministic Notifications**: Prevents spam by tracking notification state.

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Jules**
- Status: Active Development 🚀
