# ☕ Cafe Management System - Frontend Web Application

High-performance, reactive, and responsive modern Point-of-Sale (POS) & Cafe Management web application built with **Next.js (App Router)**, **React**, **TypeScript**, **Redux Toolkit (RTK Query)**, **Tailwind CSS**, **Recharts**, and **React Hook Form + Zod**.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features & Modules](#-key-features--modules)
- [Technology Stack](#-technology-stack)
- [Folder Structure](#-folder-structure)
- [Default Demo Credentials](#-default-demo-credentials)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Environment Setup](#installation--environment-setup)
  - [Running Development Server](#running-development-server)
  - [Building for Production](#building-for-production)
- [State Management & API Architecture](#-state-management--api-architecture)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [License](#-license)

---

## 🌟 Overview

The **Cafe Management Frontend** delivers a point-of-sale and administrative control center tailored for specialty cafes, coffee shops, and restaurants. It connects seamlessly to the Express.js REST API, offering real-time order processing, floor plan table layout, inventory tracking, employee attendance, billing with split-bill capabilities, and graphical sales analytics.

---

## 🚀 Key Features & Modules

### 🔐 Authentication & Session Security
- **Dedicated Owner & Staff Login Flows**: Role-specific endpoints (`/owner/login` and `/auth/login`) with JWT access & refresh token auto-rotation.
- **1-Click Quick Demo Sign-In**: Instant preset credentials for Owner, Manager, and Cashier roles.
- **Remember Me & Persistent Auth**: Local storage caching with silent background token refresh and session recovery.
- **Route & Component Guards**: Strict `ProtectedRoute` and `GuestGuard` components enforcing granular permissions.

### 📊 Real-Time Analytics Dashboard
- **Key Performance Indicators (KPIs)**: Today's Sales, Today's Orders, Monthly Sales, Available/Occupied Tables, Low Stock alerts, and Active Staff count.
- **Interactive Graphs (`Recharts`)**:
  - **7-Day Weekly Sales Trend**: Smooth Area chart with date-based sales volume.
  - **12-Month Annual Revenue**: Bar chart tracking monthly financial performance.
  - **Top Selling Menu Items**: Ranked distribution of best-selling food and beverages.
- **Live Orders Feed**: Live status indicators and fast navigation to pending orders.

### 🍽️ Menu & Category Management
- **Visual Catalog**: Card and table views with multi-field search (name, description), category filtering, and price filters.
- **Image Upload Integration**: Direct media uploads with live image preview.
- **Dynamic Pricing & Prep Time**: Configurable prep times (in minutes), availability toggles, and price fields.
- **Category Taxonomy**: Category creation with slug auto-generation.

### 🧾 Point of Sale (POS) & Order Engine
- **Fast Order Creation**: Multi-item ordering supporting `DINE_IN` and `TAKE_AWAY` order types.
- **Dynamic Table Binding**: Table assignment with real-time capacity and occupancy validation.
- **Workflow State Machine**: Status tracking (`PENDING` ➔ `PREPARING` ➔ `SERVED` ➔ `COMPLETED` / `CANCELLED`).
- **Financial Calculation Engine**: Instant calculation of Subtotal, Tax (VAT), Discount, Service Charge, and Grand Total.

### 🪑 Interactive Dining Table Layout
- **Floor Plan Visualizer**: Grid-based status indicator for cafe seating.
- **Status State Machine**: Live states: `AVAILABLE` (Emerald), `OCCUPIED` (Amber), `CLEANING` (Blue), and `RESERVED` (Purple).
- **Fast Action Controls**: Quick status toggling, table details modal, and occupancy protection against accidental deletion.

### 💰 Billing, Invoicing & Split-Bills
- **One-Click Bill Generation**: Instant invoice generation with unique receipt numbering (`RCP-YYYYMMDD-XXXX`).
- **Smart Split-Bill Engine**:
  - **Equal Split**: Even division across multiple diners with exact remainder rounding.
  - **Custom Split**: Custom monetary splits with validation against the total amount.
- **Printable Thermal Receipts**: Clean, printer-friendly modal formatted for hardware receipt/thermal printers.
- **Automatic Order & Table Synchronization**: Automatically marks order as `COMPLETED` and frees occupied tables upon settlement.

### 📦 Inventory & Stock Movement Audits
- **Real-Time Stock Counters**: Live quantity tracking with configurable minimum threshold warnings (`isLowStock`).
- **Stock Movement Log**: Action modals for `STOCK_IN` (receiving), `STOCK_OUT` (waste/consumption), and `ADJUSTMENT` (audits) with audit notes.
- **Low Stock Badges**: Alert badges drawing immediate attention to depleted ingredients.

### 👥 Staff & Attendance Management
- **Employee Directory**: Full staff profiles with position, contact info, shift timing, and salary.
- **Daily Attendance Tracker**: Attendance logging (`PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `ON_LEAVE`) with check-in/out timestamps.

### ⚙️ Operating Expenses & Settings
- **Operating Expense Tracker**: Daily expense records with receipt image attachment and category classifications.
- **System Configuration**: Cafe profile, tax/VAT rates, service charge percentages, and invoice headers.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js (App Router)](https://nextjs.org/) | Server-driven routing, layouts, and React server/client optimization |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict type safety, interface contracts, and autocompletion |
| **State Management** | [Redux Toolkit (RTK)](https://redux-toolkit.js.org/) | Global client state management (Auth, Theme, Cart) |
| **Data Fetching & Cache** | [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) | Server caching, auto tag-invalidation, re-fetching, optimistic updates |
| **Styling & CSS** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first styling with sleek dark-mode aesthetic |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icon system |
| **Form Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Performant forms with schema-based client-side validation |
| **Data Visualization** | [Recharts](https://recharts.org/) | Responsive charts for sales trends, revenues, and top sellers |
| **Feedback & Alerts** | [React Hot Toast](https://react-hot-toast.com/) | Lightweight, customizable toast notifications |

---

## 📁 Folder Structure

```
cafe-management-frontend/
├── public/                     # Static assets (favicons, logos, demo media)
├── src/
│   ├── app/                    # Next.js App Router root
│   │   ├── (auth)/             # Authentication route group
│   │   │   ├── layout.tsx      # Auth split-screen container layout
│   │   │   └── page.tsx        # Sign-in page with 1-click credentials
│   │   ├── (dashboard)/        # Protected administrative dashboard route group
│   │   │   ├── layout.tsx      # Sidebar & header shell layout
│   │   │   ├── billing/        # Customer Billing & Invoices
│   │   │   ├── categories/     # Menu Categories catalog
│   │   │   ├── dashboard/      # Analytics KPI cards & charts
│   │   │   ├── employees/      # Staff & Attendance roster
│   │   │   ├── inventory/      # Stock tracking & movement history
│   │   │   ├── menu/           # Food & beverage items catalog
│   │   │   ├── orders/         # POS & live order workflow
│   │   │   ├── payments/       # Payment logs & settlement
│   │   │   └── tables/         # Visual floor plan layout
│   │   ├── error.tsx           # Global runtime error boundary
│   │   ├── globals.css         # Tailwind base styles and CSS variables
│   │   ├── layout.tsx          # Root HTML layout with providers
│   │   ├── loading.tsx         # Global loading fallback indicator
│   │   ├── not-found.tsx       # Custom 404 page
│   │   └── page.tsx            # Landing & redirection handler
│   │
│   ├── components/             # Reusable UI component library
│   │   ├── auth/               # Route guard wrappers
│   │   │   ├── GuestGuard.tsx      # Redirects authenticated users to dashboard
│   │   │   └── ProtectedRoute.tsx  # RBAC & token check wrapper
│   │   ├── common/             # Shared utilities
│   │   │   ├── ConfirmDialog.tsx   # Deletion / action confirmation modal
│   │   │   ├── EmptyState.tsx      # Empty list placeholder illustration
│   │   │   ├── LoadingSpinner.tsx  # Loading spinner indicator
│   │   │   ├── Pagination.tsx      # Table page switcher & item counters
│   │   │   └── StatCard.tsx        # Standard KPI metric card
│   │   ├── layout/             # Application shell components
│   │   │   ├── AdminLayout.tsx     # Admin dashboard wrapper
│   │   │   ├── Header.tsx          # Top navigation bar with quick search
│   │   │   ├── nav-config.ts       # Navigation routes & RBAC rules definition
│   │   │   ├── ProfileDropdown.tsx # User profile menu & logout trigger
│   │   │   ├── SearchModal.tsx     # Global quick-jump search modal
│   │   │   └── Sidebar.tsx         # Collapsible desktop & mobile sidebar
│   │   └── ui/                 # Base UI primitives
│   │       ├── badge.tsx           # Status badge component
│   │       ├── button.tsx          # Interactive button variants
│   │       ├── card.tsx            # Glassmorphic card container
│   │       ├── input.tsx           # Form input field
│   │       └── modal.tsx           # Base dialog modal overlay
│   │
│   ├── constants/              # System-wide configuration & constants
│   │   ├── api-endpoints.ts    # Centralized backend REST API URLs
│   │   ├── permissions.ts      # Granular permissions & role definitions
│   │   ├── routes.ts           # Frontend route constants
│   │   ├── site-config.ts      # Application metadata & branding info
│   │   └── storage-keys.ts     # LocalStorage token & profile keys
│   │
│   ├── features/               # Modular domain-driven feature packages
│   │   ├── auth/               # Authentication domain
│   │   │   ├── components/         # LoginForm.tsx
│   │   │   ├── schemas/            # auth.schema.ts (Zod validation)
│   │   │   ├── services/           # authApi.ts (RTK Query auth endpoints)
│   │   │   └── types/              # auth.types.ts
│   │   ├── billing/            # Invoicing & split-bill domain
│   │   │   ├── components/         # BillingTable, GenerateBillModal, PrintReceiptModal, SplitBillModal
│   │   │   ├── services/           # billingApi.ts
│   │   │   └── types/              # billing.ts
│   │   ├── categories/         # Category domain
│   │   │   ├── components/         # CategoryTable, CategoryFormModal, DeleteCategoryModal
│   │   │   ├── schemas/            # category.schema.ts
│   │   │   ├── services/           # categoryApi.ts
│   │   │   └── types/              # category.ts
│   │   ├── dashboard/          # Analytics & metrics domain
│   │   │   ├── components/         # SummaryCardsGrid, WeeklySalesChart, MonthlyRevenueChart, TopSellingChart, RecentOrdersTable
│   │   │   ├── services/           # dashboardApi.ts
│   │   │   └── types/              # dashboard.ts
│   │   ├── employees/          # Staff & attendance domain
│   │   │   ├── components/         # EmployeeTable, EmployeeFormModal, AttendanceModal, AttendanceHistoryModal
│   │   │   ├── schemas/            # employee.schema.ts
│   │   │   ├── services/           # employeeApi.ts
│   │   │   └── types/              # employee.ts
│   │   ├── expenses/           # Operating expenses domain
│   │   │   ├── components/         # ExpenseTable, ExpenseFormModal
│   │   │   ├── services/           # expenseApi.ts
│   │   │   └── types/              # expense.ts
│   │   ├── inventory/          # Stock tracking domain
│   │   │   ├── components/         # InventoryTable, InventoryFormModal, StockMovementModal, InventoryHistoryModal
│   │   │   ├── schemas/            # inventory.schema.ts
│   │   │   ├── services/           # inventoryApi.ts
│   │   │   └── types/              # inventory.ts
│   │   ├── menu/               # Food & beverages domain
│   │   │   ├── components/         # MenuTable, MenuFormModal, DeleteMenuModal
│   │   │   ├── schemas/            # menu.schema.ts
│   │   │   ├── services/           # menuApi.ts
│   │   │   └── types/              # menu.ts
│   │   ├── orders/             # Point of Sale & orders domain
│   │   │   ├── components/         # OrderTable, CreateOrderModal, OrderDetailsModal, OrderStatsBar
│   │   │   ├── schemas/            # order.schema.ts
│   │   │   ├── services/           # orderApi.ts
│   │   │   └── types/              # order.ts
│   │   ├── payments/           # Payments & transactions domain
│   │   │   ├── components/         # PaymentTable, PaymentModal
│   │   │   ├── services/           # paymentApi.ts
│   │   │   └── types/              # payment.ts
│   │   ├── settings/           # System settings domain
│   │   │   ├── components/         # SettingsForm
│   │   │   ├── services/           # settingsApi.ts
│   │   │   └── types/              # settings.ts
│   │   └── tables/             # Floor plan & table layout domain
│   │       ├── components/         # TableCard, TableFormModal, TableListView, DeleteTableModal, TableStatsBar
│   │       ├── schemas/            # table.schema.ts
│   │       ├── services/           # tableApi.ts
│   │       └── types/              # table.ts
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAppDispatch.ts   # Typed Redux dispatch
│   │   ├── useAppSelector.ts   # Typed Redux selector
│   │   ├── useAuth.ts          # Authentication status & RBAC helper
│   │   ├── useDebounce.ts      # Debounce input for real-time search
│   │   └── useTheme.ts         # Theme controller hook
│   │
│   ├── providers/              # React context providers
│   │   ├── AppProviders.tsx    # Root master provider combining all contexts
│   │   ├── AuthProvider.tsx    # Session hydration & token initialization
│   │   ├── ReduxProvider.tsx   # Redux Toolkit store provider
│   │   ├── ThemeProvider.tsx   # Dark/Light theme context
│   │   └── ToastProvider.tsx   # React Hot Toast toast container
│   │
│   ├── services/               # Base networking & RTK Query configuration
│   │   ├── api.service.ts      # Axios fallback client
│   │   └── baseApi.ts          # Core RTK Query base with auto token inject & re-auth
│   │
│   ├── store/                  # Redux Toolkit store configuration
│   │   ├── rootReducer.ts      # Combined reducer registry
│   │   ├── index.ts            # Configured Redux store
│   │   └── slices/             # Client state slices
│   │       ├── authSlice.ts    # Authentication tokens & user credentials
│   │       └── themeSlice.ts   # UI Theme & sidebar state
│   │
│   ├── types/                  # Global TypeScript interface definitions
│   │   ├── api.ts              # Generic API response contracts
│   │   ├── billing.ts          # Billing & invoice models
│   │   ├── category.ts         # Category models
│   │   ├── dashboard.ts        # Analytics & chart models
│   │   ├── employee.ts         # Employee & attendance models
│   │   ├── expense.ts          # Expense tracking models
│   │   ├── inventory.ts        # Inventory stock models
│   │   ├── menu.ts             # Menu item models
│   │   ├── order.ts            # Order models
│   │   ├── payment.ts          # Payment transaction models
│   │   ├── settings.ts         # Cafe settings models
│   │   ├── table.ts            # Dining table models
│   │   └── user.ts             # User & profile models
│   │
│   └── utils/                  # Helper utilities
│       ├── auth-storage.ts     # LocalStorage token & user data persistence
│       ├── cn.ts               # Tailwind class merging utility (clsx + twMerge)
│       ├── error-handler.ts    # Unified API error parser
│       └── formatters.ts       # Currency ($), date, and time formatting helpers
│
├── .env.example                # Example environment variables template
├── .env.local                  # Local environment configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript compiler configuration
└── README.md                   # Full frontend documentation
```

---

## 🔑 Default Demo Credentials

The login page contains a **1-Click Quick Fill** bar with pre-configured demo accounts:

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| 👑 **Owner** | `admin@gmail.com` | `admin123` | **Full Unrestricted Access** (All modules, settings, staff, finances) |
| 👔 **Manager** | `manager@cafe.com` | `manager123` | **Operations Access** (POS, Tables, Menu, Categories, Billing, Inventory, Staff) |
| 🧑‍💼 **Cashier** | `cashier@cafe.com` | `cashier123` | **POS Access** (Orders, POS, Table Status, Billing, Payments) |

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: `v18.18.0` or higher (Recommended: Node.js `20.x` LTS)
- **npm** or **yarn** or **pnpm**
- **Backend API**: The [Cafe Management Backend](../cafe-management-backend) running on port `5000`.

### Installation & Environment Setup

1. **Clone the repository and navigate to the frontend folder**:
   ```bash
   cd cafe-management-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

   Ensure `.env.local` contains the following settings:
   ```env
   # API Server URL
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

   # App Configuration
   NEXT_PUBLIC_APP_NAME=Artisan Cafe Admin
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Feature Flags
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   ```

### Running Development Server

Start the local development server with Turbopack / Fast Refresh:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Compile and optimize the production bundle:
```bash
npm run build
```

Run the production server:
```bash
npm run start
```

---

## 🌐 State Management & API Architecture

### RTK Query Central API (`src/services/baseApi.ts`)
The application utilizes a unified `baseApi` with automatic endpoint injection:
- **Automatic Authorization**: Injects Bearer token from Redux state or local storage on every request.
- **Silent Token Refresh**: Intercepts `401 Unauthorized` responses and automatically triggers refresh token rotation before retrying the failed request.
- **Tag-Based Cache Invalidation**: Automatic real-time UI synchronization via tags:
  ```typescript
  tagTypes: [
    'User',
    'Category',
    'Menu',
    'Order',
    'Table',
    'Inventory',
    'Employee',
    'Billing',
    'Payment',
    'Dashboard',
    'Expense',
    'Settings',
  ]
  ```

---

## 🛡️ Role-Based Access Control (RBAC)

The frontend implements dynamic menu and route filtering governed by [nav-config.ts](file:///C:/Users/dhami/Desktop/Personal%20Project/cafe-management-frontend/src/components/layout/nav-config.ts) and [ProtectedRoute.tsx](file:///C:/Users/dhami/Desktop/Personal%20Project/cafe-management-frontend/src/components/auth/ProtectedRoute.tsx):

- **Sidebar Navigation**: Navigation links dynamically show or hide based on the authenticated user's `role`.
- **Direct URL Guarding**: Direct navigation to restricted routes triggers an immediate permission denial screen with a redirection button.
- **Action Level Disabling**: Buttons for sensitive operations (e.g. deleting categories or viewing staff salaries) are hidden from lower-tier roles.

---

## 📄 License

This project is licensed under the **ISC License**. Designed and developed for modern cafe and restaurant operations.
