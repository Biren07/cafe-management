# 🛡️ Cafe Management System — Backend Role & Access Control (RBAC) Documentation

This document provides a comprehensive and exhaustive guide to the **Role-Based Access Control (RBAC)** architecture, permission hierarchy, and API endpoint protection implemented in the Cafe Management Backend system.

---

## 📑 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [User Roles Hierarchy](#-user-roles-hierarchy)
3. [Granular Permissions Matrix](#-granular-permissions-matrix)
4. [Module-by-Module Access Control](#-module-by-module-access-control)
   - [1. Authentication & Security](#1-authentication--security)
   - [2. Staff User Accounts Management](#2-staff-user-accounts-management)
   - [3. Categories Management](#3-categories-management)
   - [4. Menu Items Management](#4-menu-items-management)
   - [5. Order Taking & Lifecycle](#5-order-taking--lifecycle)
   - [6. Billing & Invoice Generation](#6-billing--invoice-generation)
   - [7. Payments & QR Settlement](#7-payments--qr-settlement)
   - [8. Dining Tables Management](#8-dining-tables-management)
   - [9. Inventory & Stock Tracking](#9-inventory--stock-tracking)
   - [10. Employees HR & Attendance](#10-employees-hr--attendance)
   - [11. Cafe Expenses Management](#11-cafe-expenses-management)
   - [12. Analytics & Dashboard](#12-analytics--dashboard)
   - [13. Store Settings & Payment QRs](#13-store-settings--payment-qrs)
5. [Authentication & Authorization Middlewares](#-authentication--authorization-middlewares)
6. [Summary Guide (नेपाली विवरण)](#-summary-guide-नेपाली-विवरण)

---

## 🏛️ Architecture Overview

The backend uses a **Hybrid RBAC System**:
1. **Roles (`ROLES`)**: High-level actor classification (`OWNER`, `MANAGER`, `CASHIER`).
2. **Granular Permissions (`PERMISSIONS`)**: Distinct, resource-specific capabilities (e.g. `orders:create`, `menu:manage`, `settings:manage`).
3. **Permission Matrix (`ROLE_PERMISSIONS`)**: Maps each role to its allowed set of granular permissions.

```
┌─────────────────────────────────────────────────────────────┐
│                      👑 OWNER (Admin)                       │
│    Full Unrestricted Root Access (All Permissions + Core)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     👔 MANAGER (Ops Lead)                   │
│   Operations, Menu, Inventory, Staff HR, Expenses, Reports │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    🧑‍💼 CASHIER (POS Staff)                  │
│       POS Terminal, Order Taking, Billing, Payments & QRs   │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 User Roles Hierarchy

| Role | Badge | Description | Target Users |
| :--- | :---: | :--- | :--- |
| **`OWNER`** | 👑 | **Root Administrator**. Full access to everything, including store settings, system tax/VAT configuration, online payment QR upload, staff account creation/deactivation, and financial records. | Cafe Owner / Proprietor |
| **`MANAGER`** | 👔 | **Operations Supervisor**. Can manage menu items, categories, inventory stock in/out, employee profiles & attendance, daily expenses, and view business analytics. Cannot modify core store settings or delete payment logs. | Cafe Manager, Head Chef, Shift Lead |
| **`CASHIER`** | 🧑‍💼 | **Front-of-House / POS Operator**. Can take orders, manage dining tables, generate customer bills, split bills, accept Cash and Online QR payments (Fonepay, eSewa, Khalti), and view menu items. Cannot edit salaries or modify inventory items. | Cashier, Waiter, Barista |

---

## 🎯 Granular Permissions Matrix

| Granular Permission Code | Action / Capability | 👑 OWNER | 👔 MANAGER | 🧑‍💼 CASHIER |
| :--- | :--- | :---: | :---: | :---: |
| **`users:create`** | Create new staff login accounts | ✅ | ❌ | ❌ |
| **`users:read`** | View staff user list and profiles | ✅ | ✅ | ❌ |
| **`categories:manage`** | Create, edit, and delete menu categories | ✅ | ✅ | ❌ |
| **`categories:read`** | View menu categories | ✅ | ✅ | ✅ |
| **`menu:manage`** | Create, edit, delete menu items & upload images | ✅ | ✅ | ❌ |
| **`menu:read`** | View menu items list and details | ✅ | ✅ | ✅ |
| **`orders:create`** | Create new customer orders | ✅ | ✅ | ✅ |
| **`orders:read`** | View active, completed & cancelled orders | ✅ | ✅ | ✅ |
| **`orders:manage`** | Change order status (Preparing, Ready, Cancel) | ✅ | ✅ | ❌ |
| **`billing:manage`** | Generate bills, split bills, update bill status | ✅ | ✅ | ✅ |
| **`billing:read`** | View bills, receipts, and print invoices | ✅ | ✅ | ✅ |
| **`payments:create`** | Process & record Cash/Online QR payments | ✅ | ✅ | ✅ |
| **`payments:read`** | View payment histories and invoices | ✅ | ✅ | ✅ |
| **`tables:manage`** | Add, edit, and delete dining tables | ✅ | ✅ | ❌ |
| **`tables:read`** | View dining tables and live occupancy status | ✅ | ✅ | ✅ |
| **`inventory:manage`** | Add/edit stock items, perform Stock-In/Out | ✅ | ✅ | ❌ |
| **`inventory:read`** | View stock levels and low-stock alerts | ✅ | ✅ | ✅ |
| **`employees:manage`** | Add/edit employee HR records & log attendance | ✅ | ✅ | ❌ |
| **`employees:read`** | View employee roster and attendance history | ✅ | ✅ | ✅ |
| **`expenses:manage`** | Add, edit, and delete daily operational expenses | ✅ | ✅ | ❌ |
| **`expenses:read`** | View expenses records | ✅ | ✅ | ✅ |
| **`dashboard:read`** | View revenue charts, sales analytics & KPIs | ✅ | ✅ | ✅ |
| **`settings:manage`** | Change cafe profile, tax %, and upload payment QRs | ✅ | ❌ | ❌ |
| **`settings:read`** | View cafe store settings and active payment QRs | ✅ | ✅ | ✅ |

---

## 🚪 Module-by-Module Access Control

### 1. Authentication & Security
Base Route: `/api/v1/auth` & `/api/v1/owner`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | All Roles | Authenticate staff (Owner, Manager, Cashier) via email & password. |
| `POST` | `/auth/owner-login` | Public | `OWNER` Only | Dedicated secure Owner login endpoint. |
| `POST` | `/auth/refresh-token` | Public (Refresh Cookie/Header) | All Roles | Issue new access token using refresh token. |
| `POST` | `/auth/logout` | `authenticate` | All Logged-in | Invalidate session & clear refresh token. |
| `GET` | `/auth/profile` | `authenticate` | All Logged-in | Fetch currently authenticated user profile. |
| `PUT` | `/auth/change-password` | `authenticate` | All Logged-in | Update current account password. |

---

### 2. Staff User Accounts Management
Base Route: `/api/v1/users`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/users` | `authorize(OWNER)` | 👑 OWNER | Create a new staff login user (Manager or Cashier). |
| `GET` | `/users` | `hasPermission(users:read)` | 👑 OWNER, 👔 MANAGER | List all staff user accounts with pagination & filters. |
| `GET` | `/users/:id` | `hasPermission(users:read)` | 👑 OWNER, 👔 MANAGER | Get details of a specific staff user. |
| `PUT` | `/users/:id` | `hasPermission(users:read)` | 👑 OWNER, 👔 MANAGER | Update staff user details. |
| `PATCH` | `/users/:id/deactivate` | `authorize(OWNER)` | 👑 OWNER | Deactivate / Suspend staff login access. |
| `DELETE` | `/users/:id` | `authorize(OWNER)` | 👑 OWNER | Permanently remove a staff user account. |

---

### 3. Categories Management
Base Route: `/api/v1/categories`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/categories` | `hasPermission(categories:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | List all categories with search & filters. |
| `GET` | `/categories/:id` | `hasPermission(categories:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Get category details by ID or slug. |
| `POST` | `/categories` | `hasPermission(categories:manage)` | 👑 OWNER, 👔 MANAGER | Create new category (with Cloudinary image). |
| `PUT` | `/categories/:id` | `hasPermission(categories:manage)` | 👑 OWNER, 👔 MANAGER | Update category title, image, or status. |
| `DELETE` | `/categories/:id` | `hasPermission(categories:manage)` | 👑 OWNER, 👔 MANAGER | Delete a category. |

---

### 4. Menu Items Management
Base Route: `/api/v1/menu`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/menu` | `hasPermission(menu:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | List all food & beverage menu items. |
| `GET` | `/menu/:id` | `hasPermission(menu:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Get single menu item details. |
| `POST` | `/menu` | `hasPermission(menu:manage)` | 👑 OWNER, 👔 MANAGER | Add new menu item with pricing, prep time & image. |
| `PUT` | `/menu/:id` | `hasPermission(menu:manage)` | 👑 OWNER, 👔 MANAGER | Update menu item details, prices, or availability. |
| `DELETE` | `/menu/:id` | `hasPermission(menu:manage)` | 👑 OWNER, 👔 MANAGER | Delete a menu item. |

---

### 5. Order Taking & Lifecycle
Base Route: `/api/v1/orders`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/orders` | `hasPermission(orders:create)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Create a new DINE_IN, TAKEAWAY, or DELIVERY order. |
| `GET` | `/orders` | `hasPermission(orders:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | List all customer orders with filters. |
| `GET` | `/orders/:id` | `hasPermission(orders:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Get single order breakdown and status. |
| `PATCH` | `/orders/:id/status`| `hasPermission(orders:manage)` | 👑 OWNER, 👔 MANAGER | Advance order status (`PREPARING`, `READY`, `COMPLETED`, `CANCELLED`). |
| `DELETE` | `/orders/:id` | `hasPermission(orders:manage)` | 👑 OWNER, 👔 MANAGER | Delete or cancel an order record. |

---

### 6. Billing & Invoice Generation
Base Route: `/api/v1/billing`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/billing/generate` | `hasPermission(billing:manage)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Generate bill for an order with VAT, Service charge & discount. |
| `GET` | `/billing` | `hasPermission(billing:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | List all generated bills and receipt numbers. |
| `GET` | `/billing/:id` | `hasPermission(billing:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Get specific bill invoice details. |
| `POST` | `/billing/:id/print`| `hasPermission(billing:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Format thermal receipt payload & log print event. |
| `POST` | `/billing/:id/split`| `hasPermission(billing:manage)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Split bill equally or custom among multiple customers. |
| `PATCH` | `/billing/:id/status`| `hasPermission(billing:manage)`| 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Update bill status (`PENDING`, `PAID`, `CANCELLED`). |

---

### 7. Payments & QR Settlement
Base Route: `/api/v1/payments`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/payments` | `hasPermission(payments:create)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Record Cash or Online QR (`FONEPAY`, `ESEWA`, `KHALTI`) payment. |
| `GET` | `/payments` | `hasPermission(payments:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | List all payments and transaction logs. |
| `GET` | `/payments/:id` | `hasPermission(payments:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | View payment invoice and receipt details. |
| `PATCH` | `/payments/:id/status`| `hasPermission(payments:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Update payment status (`COMPLETED`, `PENDING`, `REFUNDED`). |
| `DELETE` | `/payments/:id` | `authorize(OWNER)` | 👑 OWNER | Delete a payment log (strictly restricted to Owner). |

---

### 8. Dining Tables Management
Base Route: `/api/v1/tables`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/tables` | `hasPermission(tables:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | View all tables, floor capacity & occupancy status. |
| `GET` | `/tables/:id` | `hasPermission(tables:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | View single table details & current occupied order. |
| `POST` | `/tables` | `hasPermission(tables:manage)` | 👑 OWNER, 👔 MANAGER | Create a new table with capacity & location. |
| `PUT` | `/tables/:id` | `hasPermission(tables:manage)` | 👑 OWNER, 👔 MANAGER | Update table number, capacity, or location. |
| `PATCH` | `/tables/:id/status`| `hasPermission(tables:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Quick-toggle table status (`AVAILABLE`, `OCCUPIED`, `RESERVED`). |
| `DELETE` | `/tables/:id` | `hasPermission(tables:manage)` | 👑 OWNER, 👔 MANAGER | Delete a dining table. |

---

### 9. Inventory & Stock Tracking
Base Route: `/api/v1/inventory`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/inventory` | `hasPermission(inventory:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | List all inventory items and quantities. |
| `GET` | `/inventory/low-stock` | `hasPermission(inventory:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | View critical low stock alert items. |
| `GET` | `/inventory/:id` | `hasPermission(inventory:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Get inventory item details & history logs. |
| `POST` | `/inventory` | `hasPermission(inventory:manage)` | 👑 OWNER, 👔 MANAGER | Create a new inventory ingredient / supply item. |
| `PUT` | `/inventory/:id` | `hasPermission(inventory:manage)` | 👑 OWNER, 👔 MANAGER | Update stock item name, unit, cost, threshold. |
| `POST` | `/inventory/:id/stock-in` | `hasPermission(inventory:manage)` | 👑 OWNER, 👔 MANAGER | Add incoming raw material stock (Stock-In). |
| `POST` | `/inventory/:id/stock-out` | `hasPermission(inventory:manage)` | 👑 OWNER, 👔 MANAGER | Record usage / wastage / spoilage (Stock-Out). |
| `DELETE` | `/inventory/:id` | `hasPermission(inventory:manage)` | 👑 OWNER, 👔 MANAGER | Remove an inventory item. |

---

### 10. Employees HR & Attendance
Base Route: `/api/v1/employees`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/employees` | `hasPermission(employees:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | List employees, positions, shifts, and salaries. |
| `GET` | `/employees/:id` | `hasPermission(employees:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Get employee profile and attendance overview. |
| `POST` | `/employees` | `hasPermission(employees:manage)` | 👑 OWNER, 👔 MANAGER | Add staff member (with optional instant User login account creation). |
| `PUT` | `/employees/:id` | `hasPermission(employees:manage)` | 👑 OWNER, 👔 MANAGER | Update employee salary, shift, position, or status. |
| `POST` | `/employees/:id/attendance` | `hasPermission(employees:manage)` | 👑 OWNER, 👔 MANAGER | Log daily check-in / check-out / leave attendance. |
| `GET` | `/employees/:id/attendance` | `hasPermission(employees:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | View attendance history log. |
| `DELETE` | `/employees/:id` | `hasPermission(employees:manage)` | 👑 OWNER, 👔 MANAGER | Delete employee record from database. |

---

### 11. Cafe Expenses Management
Base Route: `/api/v1/expenses`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/expenses` | `hasPermission(expenses:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | List all operational expense vouchers & category totals. |
| `GET` | `/expenses/:id` | `hasPermission(expenses:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Get single expense voucher details. |
| `POST` | `/expenses` | `hasPermission(expenses:manage)` | 👑 OWNER, 👔 MANAGER | Add new expense voucher (Supplies, Utility, Rent, etc.). |
| `PUT` | `/expenses/:id` | `hasPermission(expenses:manage)` | 👑 OWNER, 👔 MANAGER | Edit an expense record. |
| `DELETE` | `/expenses/:id` | `hasPermission(expenses:manage)` | 👑 OWNER, 👔 MANAGER | Delete an expense record. |

---

### 12. Analytics & Dashboard
Base Route: `/api/v1/dashboard`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/dashboard` | `hasPermission(dashboard:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Fetch summary cards, revenue stats, today orders, and top-selling items. |

---

### 13. Store Settings & Payment QRs
Base Route: `/api/v1/settings`

| Method | Endpoint | Protection Middleware | Permitted Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/settings` | `hasPermission(settings:read)` | 👑 OWNER, 👔 MANAGER, 🧑‍💼 CASHIER | Read cafe name, tax %, currency, and active payment QRs. |
| `PUT` | `/settings` | `authorize(OWNER)` | 👑 OWNER | Update cafe name, VAT %, Service charge %, address, and logo. |
| `POST` | `/settings/payment-qr` | `authorize(OWNER)` | 👑 OWNER | Upload & configure Fonepay, eSewa, and Khalti QR codes. |
| `DELETE`| `/settings/payment-qr/:provider` | `authorize(OWNER)` | 👑 OWNER | Remove a specific digital payment QR code. |

---

## 🔒 Authentication & Authorization Middlewares

1. **`authenticate` (`auth.middleware.js`)**:
   - Validates the incoming JWT `Bearer <token>` from the `Authorization` header or HTTP-only cookies.
   - Verifies token signature, expiration, and ensures user exists and is `ACTIVE`.
   - Attaches `req.user` to the request object.

2. **`authorize(...roles)` (`auth.middleware.js`)**:
   - Enforces strict role whitelisting (e.g. `authorize(ROLES.OWNER)`).
   - Throws `403 Forbidden` if `req.user.role` is not present in the allowed roles list.

3. **`hasPermission(requiredPermission)` (`auth.middleware.js`)**:
   - Dynamically checks if the user's role possesses the required granular permission code in `ROLE_PERMISSIONS`.
   - `OWNER` automatically inherits 100% of all permissions.
   - Throws `403 Forbidden` if unauthorized.

---

## 🇳🇵 Summary Guide (नेपाली विवरण)

### १. 👑 Owner (मालिक / Admin)
- **पहुँच**: सम्पूर्ण १००% सिस्टम पहुँच।
- **विशेष अधिकार (Only Owner)**:
  - नयाँ Staff User (Manager / Cashier) बनाउने, Deactivate गर्ने र Delete गर्ने।
  - क्याफेको Profile, Tax/VAT %, Service Charge र Receipt Footer परिवर्तन गर्ने।
  - **Fonepay, eSewa, र Khalti का QR Codes अपलोड तथा व्यवस्थापन गर्ने**।
  - Payment Logs हटाउने।

### २. 👔 Manager (व्यवस्थापक / सुपरीवेक्षक)
- **पहुँच**: दैनिक सञ्चालन, व्यवस्थापन र रिपोर्टिङ।
- **गर्न सक्ने काम**:
  - Menu Items र Categories थप्ने/सच्याउने/हटाउने।
  - Inventory (स्टक इन / स्टक आउट) व्यवस्थापन गर्ने।
  - कर्मचारी (Employees) थप्ने, तलब तोक्ने, र हाजिरी (Attendance) लिने।
  - दैनिक खर्च (Expenses) रेकर्ड गर्ने।
  - अर्डरको स्थिति परिवर्तन गर्ने (`PREPARING`, `READY`, `CANCELLED`)।
  - सम्पूर्ण Dashboard Analytics र बिक्री रिपोर्ट हेर्ने।
- **गर्न नसक्ने काम**:
  - Owner को पासवर्ड फेर्न, Store Settings बदल्न वा QR Code फेर्न पाउँदैन।

### ३. 🧑‍💼 Cashier (बिलिङ र काउन्टर कर्मचारी)
- **पहुँच**: काउन्टर, POS बिलिङ, अर्डर र भुक्तानी।
- **गर्न सक्ने काम**:
  - ग्राहकको अर्डर लिने (`Create Order`)।
  - Table स्थिति हेर्ने र अपडेट गर्ने।
  - बिल बनाउने (`Generate Bill`), बिल बाँड्ने (`Split Bill`), र थर्मल रसिद प्रिन्ट गर्ने।
  - **Cash वा Online QR (Fonepay, eSewa, Khalti) बाट भुक्तानी लिने र इनभ्वाइस काट्ने**।
  - Menu र Categories हेर्ने।
- **गर्न नसक्ने काम**:
  - Menu/Category को मूल्य बदल्न वा मेटाउन पाउँदैन।
  - Inventory थप्न वा कर्मचारीको तलब बदल्न पाउँदैन।
  - अरू staff user बनाउन वा Store Settings बदल्न पाउँदैन।
