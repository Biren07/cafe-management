# 🎨 Frontend RBAC (Role-Based Access Control) Documentation

This document explains the Frontend UI and Navigation permissions for the **Cafe Management System**.

---

## 👥 Role Structure (Exactly 2 Roles)

1. 👑 **ADMIN**: Full 100% control over the entire system (Dashboard, Billing, Settings, Staff Users, Menu, Categories, Tables, Inventory, Employees, Expenses, Payments).
2. 🧑‍💼 **STAFF**: Front-of-house operations (Orders, Tables, Menu catalog view, Category view, Stock view, Payments).

---

## 🧭 Sidebar Navigation Visibility

| Nav Section | Page Route | Icon | 👑 ADMIN | 🧑‍💼 STAFF | Required Role / Permission |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Main Menu** | `/dashboard` | `LayoutDashboard` | 👁️ Visible | 🚫 **Hidden** | `ROLES.ADMIN` |
| | `/orders` | `ShoppingBag` | 👁️ Visible | 👁️ **Visible** | `orders:read` |
| | `/menu` | `UtensilsCrossed` | 👁️ Visible | 👁️ **Visible** (View Only) | `menu:read` |
| | `/categories` | `Grid` | 👁️ Visible | 👁️ **Visible** (View Only) | `categories:read` |
| | `/billing` | `Receipt` | 👁️ Visible | 🚫 **Hidden** | `ROLES.ADMIN` |
| | `/payments` | `DollarSign` | 👁️ Visible | 👁️ **Visible** | `payments:read` |
| **Management** | `/inventory` | `Package` | 👁️ Visible | 👁️ **Visible** (View Only) | `inventory:read` |
| | `/tables` | `Armchair` | 👁️ Visible | 👁️ **Visible** | `tables:read` |
| | `/employees` | `Users` | 👁️ Visible | 🚫 **Hidden** | `ROLES.ADMIN` |
| | `/expenses` | `DollarSign` | 👁️ Visible | 🚫 **Hidden** | `ROLES.ADMIN` |
| **Administration** | `/users` | `UserCheck` | 👁️ Visible | 🚫 **Hidden** | `ROLES.ADMIN` |
| | `/settings` | `Settings` | 👁️ Visible | 🚫 **Hidden** | `ROLES.ADMIN` |

---

## 🔘 Button & Action-Level Permissions

| Module | Action | 👑 ADMIN | 🧑‍💼 STAFF |
| :--- | :--- | :---: | :---: |
| **Menu** | Add, Edit, Delete | ✅ Visible | 🚫 Hidden (View-only table) |
| **Categories** | Add, Edit, Delete | ✅ Visible | 🚫 Hidden (View-only table) |
| **Orders** | Create Order, View Breakdown | ✅ Visible | ✅ Visible |
| | Change Status Dropdown, Cancel | ✅ Interactive | 🚫 Read-only status badge |
| **Billing** | Generate Bill, Split Bill, Print | ✅ Full Access | 🚫 Hidden |
| **Payments** | Process Cash / QR Payment | ✅ Full Access | ✅ Full Access |
| **Tables** | Add, Edit, Delete | ✅ Visible | 🚫 Hidden |
| | Live Status & Occupancy Toggle | ✅ Interactive | ✅ Interactive |
| **Inventory** | Stock-In, Stock-Out, Add, Edit, Delete | ✅ Visible | 🚫 Hidden (View-only table) |
| **Employees**| Add Staff, Edit, Delete, Attendance Log | ✅ Visible | 🚫 Hidden |
| **Expenses** | Add, Edit, Delete Expense Vouchers | ✅ Visible | 🚫 Hidden |
| **Staff Users** | Create Staff Login, Deactivate, Delete | ✅ Full Access | 🚫 Hidden |
| **Settings** | Tax %, Profile, Payment QR Upload | ✅ Full Access | 🚫 Hidden |
