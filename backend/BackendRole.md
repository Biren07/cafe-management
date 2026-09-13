# 🔐 Backend RBAC (Role-Based Access Control) Documentation

This document serves as the **Single Source of Truth** for roles, permissions, and access levels in the **Cafe Management System** backend.

---

## 👥 System Roles (Exactly 2 Roles)

```
┌─────────────────────────────────────────────────────────────┐
│                       👑 1. ADMIN                           │
│   Description: Cafe Owner / General Manager                │
│   Access: 100% Full System Control, Settings & Users        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                       🧑‍💼 2. STAFF                          │
│   Description: Cashier / Front-of-House Operator           │
│   Access: POS Orders, Dining Tables, Customer Payments     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Permissions Matrix

| Granular Permission | Description | 👑 ADMIN | 🧑‍💼 STAFF |
| :--- | :--- | :---: | :---: |
| `dashboard:read` | View analytics, revenue, top-selling charts | ✅ Full | 🚫 Forbidden |
| `orders:create` | Create customer dining / takeaway orders | ✅ Full | ✅ Full |
| `orders:read` | View order history and order tickets | ✅ Full | ✅ Full |
| `orders:manage` | Change status, update kitchen tickets, cancel | ✅ Full | 🚫 Forbidden |
| `menu:read` | View food items and prices | ✅ Full | ✅ Full |
| `menu:manage` | Add, edit, delete menu items & prices | ✅ Full | 🚫 Forbidden |
| `categories:read` | View menu categories | ✅ Full | ✅ Full |
| `categories:manage`| Add, edit, delete categories | ✅ Full | 🚫 Forbidden |
| `billing:read` | View billing invoices | ✅ Full | 🚫 Forbidden |
| `billing:manage` | Generate, split, print, and settle bills | ✅ Full | 🚫 Forbidden |
| `payments:read` | View payment transactions & receipts | ✅ Full | ✅ Full |
| `payments:create` | Record cash & QR scan customer payments | ✅ Full | ✅ Full |
| `tables:read` | View dining tables layout & occupancy | ✅ Full | ✅ Full |
| `tables:manage` | Add, edit, delete dining tables | ✅ Full | 🚫 Forbidden |
| `inventory:read` | View stock items and low-stock alerts | ✅ Full | ✅ Full |
| `inventory:manage` | Stock-in, stock-out, add/edit/delete items | ✅ Full | 🚫 Forbidden |
| `employees:read` | View staff roster and attendance logs | ✅ Full | 🚫 Forbidden |
| `employees:manage` | Add staff, edit salary/shift, log attendance | ✅ Full | 🚫 Forbidden |
| `expenses:read` | View operational expense records | ✅ Full | 🚫 Forbidden |
| `expenses:manage` | Record, edit, and delete cafe expenses | ✅ Full | 🚫 Forbidden |
| `users:read` | View staff system login accounts | ✅ Full | 🚫 Forbidden |
| `users:create` | Create new staff logins & assign roles | ✅ Full | 🚫 Forbidden |
| `settings:read` | View cafe profile, tax rates, payment QRs | ✅ Full | 🚫 Forbidden |
| `settings:manage` | Configure tax %, store info, upload QR codes| ✅ Full | 🚫 Forbidden |

---

## 🛡️ Route Authorization Rules

- **`POST /api/v1/users`**: `authorize(ROLES.ADMIN)`
- **`PUT /api/v1/settings`**: `authorize(ROLES.ADMIN)`
- **`POST /api/v1/settings/payment-qr`**: `authorize(ROLES.ADMIN)`
- **`DELETE /api/v1/settings/payment-qr/:provider`**: `authorize(ROLES.ADMIN)`
- **`POST /api/v1/auth/owner-login`**: Accepts `ADMIN` accounts.
