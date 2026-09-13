# Cafe Management System - Backend REST API

High-performance, secure, and production-ready Node.js & Express.js REST API for modern Cafe Management Operations. Built with MongoDB, Mongoose, JWT Authentication, Granular Permission-Based Role Control (RBAC), Repository Pattern, MongoDB Aggregation Pipelines, Cloudinary Media Integration, and OpenAPI 3.0 (Swagger) documentation.

---

## Key System Features & Modules

- **Owner Main Authentication & Bootstrapping**:
  - Dedicated Owner login endpoint (`POST /api/v1/owner/login`) with default credentials (`admin@gmail.com` / `admin123`).
  - Automatic Owner account seeding upon database initialization.
  - Profile viewing and password management.
- **Staff User Management & Granular RBAC**:
  - Role Hierarchy: `OWNER`, `MANAGER`, and `CASHIER`.
  - Granular system permissions (`users:create`, `menu:manage`, `orders:create`, `billing:manage`, `expenses:manage`, `settings:manage`, etc.).
  - Staff account CRUD, pagination, filtering by role/status, search, and soft account deactivation.
- **Category Management Module**:
  - Menu categories with auto-slugification (`hot-beverages`, `pastries`).
  - Cloudinary image upload & automatic deletion on updates/deletions.
- **Menu Management Module**:
  - Food and beverage catalog tied to Category references.
  - Multi-field search (name, description), price range filtering, availability toggles, and Cloudinary image handling.
- **Order Processing & Workflow Engine**:
  - Auto-generated unique order numbers (`ORD-YYYYMMDD-XXXX`).
  - Supports `DINE_IN` and `TAKE_AWAY` order types.
  - Order status workflow state machine (`PENDING` -> `PREPARING` -> `SERVED` -> `COMPLETED` / `CANCELLED`).
  - Automatic financial total calculations (subtotal, tax, discount, service charge, grand total).
- **Payment Settlement & Invoice Tracking Module**:
  - Supports `CASH` and `ONLINE` payment methods.
  - Auto-generated invoice numbers (`INV-YYYYMMDD-XXXX`).
  - Automatic Order status synchronization to `COMPLETED` upon full payment.
- **Inventory & Stock Movement Audit Logging**:
  - Raw material stock tracking (`currentStock`, `minimumStock`, `unit`).
  - Real-time low stock detection and query filters (`isLowStock` boolean & `$expr` checks).
  - Transaction history audit logs (`IN`, `OUT`, `ADJUSTMENT`) with performer tracking.
- **Employee HR & Attendance Management**:
  - Staff profile records (`fullName`, `email`, `phone`, `position`, `salary`, `shift`, `status`).
  - Daily attendance logging (`PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `ON_LEAVE`) with check-in and check-out timestamps.
- **Dining Table Management**:
  - Table layout mapping (`tableNumber`, `tableName`, `capacity`, `status`, `isActive`).
  - Status Enum (`AVAILABLE`, `OCCUPIED`, `CLEANING`, `RESERVED`).
  - Business Constraints: Constraint preventing deletion of occupied tables, constraint preventing occupying inactive tables.
- **Customer Billing & Invoicing Module**:
  - Bill generation from Order (`receiptNumber`, `subtotal`, `tax`, `discount`, `serviceCharge`, `grandTotal`).
  - Status Enum (`PENDING`, `PAID`, `CANCELLED`).
  - Auto receipt number generation (`RCP-YYYYMMDD-XXXX`).
  - Split Bill feature (equal and custom share split breakdown storing `splitDetails`).
  - Structured printable invoice JSON generator for hardware/thermal receipt printing (`GET /billing/:id/print`).
  - Automatic Order completion & Table status release (`OCCUPIED` -> `AVAILABLE`) upon bill settlement.
- **High-Performance Dashboard Analytics Module**:
  - **Summary Cards Aggregation**: Today's Sales, Today's Orders, Monthly Sales, Available Tables, Occupied Tables, Total Employees, Total Menu Items, Low Stock Items.
  - **Charts & Graph Aggregations**:
    - 7-Day Weekly Sales chart (with auto zero-fill for continuous frontend graphs).
    - 12-Month Monthly Revenue chart.
    - Top Selling Menu Items.
    - Most Ordered Categories (optimized grouping before `$lookup` stages).
  - **Recent Orders Feed**: Populated real-time recent orders list.
- **Expense & Receipt Tracking Module**:
  - Expense record management (`title`, `category`, `amount`, `description`, `expenseDate`, `receiptImage`, `createdBy`).
  - Cloudinary receipt image upload & automatic asset deletion on updates/deletes.
  - Search, category filter, date range filter (`startDate`/`endDate`), amount range filter (`minAmount`/`maxAmount`), sorting, and soft deletion.
- **Global Cafe System Settings Module**:
  - Global store metadata & branding configuration (`cafeName`, `logo`, `phone`, `email`, `address`, `vatNumber`, `currency`, `receiptFooter`, `businessHours`, `taxPercentage`, `serviceChargePercentage`).
  - **Strict Authorization Guard**: Restricted strictly to the **OWNER** role (`authorize('OWNER')`).
- **Standardized API Responses & Operational Error Handling**:
  - Predictable `{ statusCode, success, message, data }` response format using custom `ApiResponse`.
  - Operational exception handling with custom `ApiError` and Express `asyncHandler`.
- **Interactive API Documentation**: OpenAPI 3.0 / Swagger UI generated via JSDoc comments available at `/api-docs`.

---

## Permission Matrix Overview

| Module / Action | Required Permission | OWNER | MANAGER | CASHIER |
| :--- | :--- | :---: | :---: | :---: |
| **Create User / Staff** | `users:create` | YES | NO | NO |
| **Read User / Staff** | `users:read` | YES | YES | NO |
| **Deactivate / Delete User** | `users:create` / `authorize(OWNER)` | YES | NO | NO |
| **Manage Category** | `categories:manage` | YES | YES | NO |
| **Read Category** | `categories:read` | YES | YES | YES |
| **Manage Menu** | `menu:manage` | YES | YES | NO |
| **Read Menu** | `menu:read` | YES | YES | YES |
| **Manage Inventory** | `inventory:manage` | YES | YES | NO |
| **Read Inventory** | `inventory:read` | YES | YES | YES |
| **Create Order** | `orders:create` | YES | YES | YES |
| **Read Order** | `orders:read` | YES | YES | YES |
| **Manage / Delete Order** | `orders:manage` | YES | YES | NO |
| **Create / Process Payment** | `payments:create` | YES | NO | YES |
| **Read Payment** | `payments:read` | YES | YES | YES |
| **Manage Employees** | `employees:manage` | YES | YES | NO |
| **Read Employees** | `employees:read` | YES | YES | YES |
| **Manage Tables** | `tables:manage` | YES | YES | NO |
| **Read Tables** | `tables:read` | YES | YES | YES |
| **Manage Billing** | `billing:manage` | YES | YES | YES |
| **Read Billing** | `billing:read` | YES | YES | YES |
| **Read Dashboard** | `dashboard:read` | YES | YES | YES |
| **Manage Expenses** | `expenses:manage` | YES | YES | NO |
| **Read Expenses** | `expenses:read` | YES | YES | YES |
| **Manage Settings** | `settings:manage` / `authorize(OWNER)` | YES | NO | NO |
| **Read Settings** | `settings:read` | YES | YES | YES |

---

## Complete Directory Structure

```text
cafe-management-backend/
├── .env.example                # Template for environment configuration
├── .env                        # Local environment configuration (git-ignored)
├── .gitignore                  # Git ignore rules
├── package.json                # Project manifest and scripts
├── package-lock.json           # Locked dependency tree
├── README.md                   # System documentation
└── src/
    ├── app.js                  # Express app setup and middleware assembly
    ├── server.js               # HTTP server listener and DB initializer
    ├── test-rbac.js            # Automated RBAC verification script
    ├── test-dashboard.js       # Dashboard aggregation test script
    ├── test-expense.js         # Expense CRUD & Cloudinary test script
    ├── test-settings.js        # Settings OWNER authorization test script
    ├── config/                 # Configurations
    │   ├── cloudinary.js       # Cloudinary media storage SDK configuration
    │   ├── db.js               # Mongoose MongoDB connection client
    │   ├── env.js              # Environment variable loader & validator
    │   ├── logger.js           # Winston logger (Console + File logging)
    │   └── swagger.js          # Swagger JSDoc and Swagger UI setup
    ├── constants/              # System Constants & Enums
    │   ├── httpStatusCodes.js  # HTTP status codes mapping
    │   ├── permissions.js      # System permission strings & ROLE_PERMISSIONS matrix
    │   ├── responseMessages.js # Standard response messages
    │   └── roles.js            # User roles enum (OWNER, MANAGER, CASHIER)
    ├── controllers/            # Request Controllers
    │   ├── auth.controller.js       # Auth endpoints controller
    │   ├── billing.controller.js    # Customer billing & split bill controller
    │   ├── category.controller.js   # Category management controller
    │   ├── dashboard.controller.js  # Dashboard analytics controller
    │   ├── employee.controller.js   # Employee HR & attendance controller
    │   ├── expense.controller.js    # Expense & receipt controller
    │   ├── inventory.controller.js  # Stock management & movement controller
    │   ├── menu.controller.js       # Menu items controller
    │   ├── order.controller.js      # Order processing & workflow controller
    │   ├── payment.controller.js    # Payment settlement controller
    │   ├── settings.controller.js   # System settings controller
    │   ├── table.controller.js     # Dining tables controller
    │   └── user.controller.js       # Staff User CRUD & deactivation controller
    ├── docs/                   # OpenAPI / Swagger Specification Schemas
    │   ├── auth.swagger.js          # Swagger docs for authentication routes
    │   ├── billing.swagger.js       # Swagger docs for billing routes
    │   ├── category.swagger.js      # Swagger docs for category routes
    │   ├── dashboard.swagger.js     # Swagger docs for dashboard analytics
    │   ├── employee.swagger.js      # Swagger docs for employee routes
    │   ├── expense.swagger.js       # Swagger docs for expense routes
    │   ├── inventory.swagger.js     # Swagger docs for inventory routes
    │   ├── menu.swagger.js          # Swagger docs for menu routes
    │   ├── order.swagger.js         # Swagger docs for order routes
    │   ├── owner.swagger.js        # Swagger docs for Owner Main API
    │   ├── payment.swagger.js       # Swagger docs for payment routes
    │   ├── settings.swagger.js      # Swagger docs for settings routes
    │   ├── table.swagger.js        # Swagger docs for table routes
    │   └── user.swagger.js         # Swagger docs for user management routes
    ├── middlewares/            # Express Middlewares
    │   ├── auth.middleware.js         # JWT auth, authorize, & hasPermission middlewares
    │   ├── error.middleware.js        # Global error & 404 handler
    │   ├── rateLimiter.middleware.js  # Express rate limiting
    │   ├── requestLogger.middleware.js# HTTP logger middleware (Morgan -> Winston)
    │   ├── upload.middleware.js       # Multer upload middleware
    │   └── validate.middleware.js     # express-validator error evaluator
    ├── models/                 # Mongoose Data Schemas
    │   ├── billing.model.js    # Billing schema with split details & audit history
    │   ├── category.model.js   # Category schema with slugify hook
    │   ├── employee.model.js   # Employee HR schema with attendance sub-schema
    │   ├── expense.model.js    # Expense schema with receipt image fields
    │   ├── inventory.model.js  # Inventory schema with history audit sub-schema
    │   ├── menu.model.js       # Menu item schema referencing Category
    │   ├── order.model.js      # Order schema with items array and financial totals
    │   ├── payment.model.js    # Payment schema referencing Order and User
    │   ├── settings.model.js   # System settings schema for cafe configurations
    │   ├── table.model.js      # Dining table schema with compound status indexes
    │   └── user.model.js       # User schema with bcrypt hooks, methods & status sync
    ├── repositories/           # Data Access Layer (Repository Pattern)
    │   ├── auth.repository.js       # Auth database queries
    │   ├── billing.repository.js    # Billing & invoice queries
    │   ├── category.repository.js   # Category CRUD & paginated queries
    │   ├── dashboard.repository.js  # MongoDB Aggregation pipelines for metrics & charts
    │   ├── employee.repository.js   # Employee CRUD & attendance queries
    │   ├── expense.repository.js    # Expense queries, search, & range filters
    │   ├── inventory.repository.js  # Stock queries & movement audit log queries
    │   ├── menu.repository.js       # Menu CRUD, filtering & category population
    │   ├── order.repository.js      # Order queries & status workflow operations
    │   ├── payment.repository.js    # Payment queries & invoice lookup
    │   ├── settings.repository.js   # Settings document fetching & updating
    │   ├── table.repository.js      # Dining table queries & status management
    │   └── user.repository.js       # User CRUD, pagination, filter, & search queries
    ├── routes/                 # Express Route Declarations
    │   └── v1/
    │       ├── auth.routes.js       # Auth endpoints with Swagger JSDoc
    │       ├── billing.routes.js    # Customer billing & invoice endpoints
    │       ├── category.routes.js   # Category endpoints with Multer upload
    │       ├── dashboard.routes.js  # Dashboard metrics & chart endpoints
    │       ├── employee.routes.js   # Employee HR & attendance endpoints
    │       ├── expense.routes.js    # Expense tracking endpoints
    │       ├── health.routes.js     # Health check endpoint
    │       ├── index.js             # Central v1 route aggregator (/api/v1)
    │       ├── inventory.routes.js  # Inventory & stock movement endpoints
    │       ├── menu.routes.js       # Menu endpoints with Multer upload
    │       ├── order.routes.js      # Order workflow endpoints
    │       ├── owner.routes.js      # Dedicated Owner Main API endpoints
    │       ├── payment.routes.js    # Payment settlement endpoints
    │       ├── settings.routes.js   # System settings endpoints (OWNER restricted)
    │       ├── table.routes.js      # Dining table management endpoints
    │       └── user.routes.js       # Staff user management endpoints
    ├── services/               # Business Logic Layer
    │   ├── auth.service.js          # Auth service
    │   ├── billing.service.js       # Billing & split invoice service
    │   ├── category.service.js      # Category service with Cloudinary upload
    │   ├── dashboard.service.js     # Dashboard metrics compilation service
    │   ├── employee.service.js      # Employee HR & attendance service
    │   ├── expense.service.js       # Expense service with Cloudinary receipt image
    │   ├── inventory.service.js     # Inventory & stock movement audit service
    │   ├── menu.service.js          # Menu service with Cloudinary upload
    │   ├── order.service.js         # Order calculation & status workflow service
    │   ├── payment.service.js       # Payment processing & order sync service
    │   ├── settings.service.js      # Global cafe configuration service
    │   ├── table.service.js        # Dining table service
    │   └── user.service.js          # User management service
    ├── utils/                  # Utility Helpers
    │   ├── ApiError.js              # Custom API operational error class
    │   ├── ApiResponse.js           # Standardized API response format wrapper
    │   ├── asyncHandler.js          # Express async route handler wrapper
    │   └── seedOwner.js             # Initial Owner account seeding script
    └── validations/            # Request Validation Schemas (express-validator)
        ├── auth.validation.js
        ├── billing.validation.js
        ├── category.validation.js
        ├── employee.validation.js
        ├── expense.validation.js
        ├── inventory.validation.js
        ├── menu.validation.js
        ├── order.validation.js
        ├── payment.validation.js
        ├── settings.validation.js
        ├── table.validation.js
        └── user.validation.js
```

---

## API Endpoints Summary

Base Path: `/api/v1`

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| **System Health** | | | |
| `GET` | `/api/v1/health` | Public | System health check |
| **Owner Main API** | | | |
| `POST` | `/api/v1/owner/login` | Public | Dedicated Owner login (`admin@gmail.com` / `admin123`) |
| `GET` | `/api/v1/owner/profile` | Protected (Owner) | Get Owner profile details |
| `POST` | `/api/v1/owner/change-password` | Protected (Owner) | Change Owner password |
| **Authentication** | | | |
| `POST` | `/api/v1/auth/register` | Protected (Owner) | Register staff user / Initial bootstrap owner |
| `POST` | `/api/v1/auth/login` | Public | Login user & issue Access/Refresh tokens |
| `POST` | `/api/v1/auth/refresh-token` | Public | Refresh Access Token using Refresh Token |
| `POST` | `/api/v1/auth/logout` | Protected | Logout user & revoke refresh token |
| `POST` | `/api/v1/auth/change-password` | Protected | Change authenticated user password |
| `GET` | `/api/v1/auth/profile` | Protected | Get authenticated user profile |
| **User / Staff Management** | | | |
| `POST` | `/api/v1/users` | Protected (Owner) | Create Staff member (`MANAGER`, `CASHIER`) |
| `GET` | `/api/v1/users` | `users:read` | List Staff with pagination, filter, & search |
| `GET` | `/api/v1/users/:id` | `users:read` | Get single Staff profile by ID |
| `PUT` | `/api/v1/users/:id` | Protected (Owner/Manager) | Update Staff profile |
| `PATCH` | `/api/v1/users/:id/deactivate` | Protected (Owner) | Deactivate Staff account (`status: INACTIVE`) |
| `DELETE` | `/api/v1/users/:id` | Protected (Owner) | Delete Staff account |
| **Category Management** | | | |
| `POST` | `/api/v1/categories` | `categories:manage` | Create category with Cloudinary image upload |
| `GET` | `/api/v1/categories` | `categories:read` | List categories with pagination, search, & sorting |
| `GET` | `/api/v1/categories/:id` | `categories:read` | Get single category details by ID |
| `PUT` | `/api/v1/categories/:id` | `categories:manage` | Update category details and replace image |
| `DELETE` | `/api/v1/categories/:id` | `categories:manage` | Delete category and remove image from Cloudinary |
| **Menu Management** | | | |
| `POST` | `/api/v1/menu` | `menu:manage` | Create menu item with Category ref & Cloudinary image |
| `GET` | `/api/v1/menu` | `menu:read` | List menu items with populated Category, price filter, search |
| `GET` | `/api/v1/menu/:id` | `menu:read` | Get single menu item by ID |
| `PUT` | `/api/v1/menu/:id` | `menu:manage` | Update menu item details and replace image |
| `DELETE` | `/api/v1/menu/:id` | `menu:manage` | Delete menu item and clean up Cloudinary asset |
| **Order Management** | | | |
| `POST` | `/api/v1/orders` | `orders:create` | Create order with auto orderNumber & calculated totals |
| `GET` | `/api/v1/orders` | `orders:read` | List orders with pagination, status/type filters, date range |
| `GET` | `/api/v1/orders/:id` | `orders:read` | Get single order by ID or orderNumber |
| `PATCH` | `/api/v1/orders/:id/status` | `orders:manage` | Update order workflow status (`PENDING` -> `COMPLETED`) |
| `PUT` | `/api/v1/orders/:id` | `orders:manage` | Update order items or financial fields |
| `DELETE` | `/api/v1/orders/:id` | `orders:manage` | Delete / Cancel order |
| **Payment Settlement** | | | |
| `POST` | `/api/v1/payments` | `payments:create` | Process payment (`CASH`/`ONLINE`) & sync Order status |
| `GET` | `/api/v1/payments` | `payments:read` | List payments with pagination, status/method filters, date range |
| `GET` | `/api/v1/payments/:id` | `payments:read` | Get single payment by ID or invoiceNumber |
| `PATCH` | `/api/v1/payments/:id/status` | Protected (Owner/Manager) | Update payment status (`REFUNDED`, `FAILED`, etc.) |
| `DELETE` | `/api/v1/payments/:id` | Protected (Owner/Manager) | Delete payment record |
| **Customer Billing & Invoicing** | | | |
| `POST` | `/api/v1/billing` | `billing:manage` | Generate Bill from Order ID |
| `GET` | `/api/v1/billing` | `billing:read` | List Bills with pagination, status filter, date range |
| `GET` | `/api/v1/billing/:id` | `billing:read` | Get single bill by ID or receiptNumber |
| `PATCH` | `/api/v1/billing/:id/status` | `billing:manage` | Update bill status (`PAID`, `CANCELLED`) |
| `POST` | `/api/v1/billing/:id/split` | `billing:manage` | Split bill equally or customized between multiple shares |
| `GET` | `/api/v1/billing/:id/print` | `billing:read` | Generate printable receipt JSON payload |
| **Inventory Stock Management** | | | |
| `POST` | `/api/v1/inventory` | `inventory:manage` | Add new inventory stock item |
| `GET` | `/api/v1/inventory` | `inventory:read` | List inventory items with pagination, search, & sorting |
| `GET` | `/api/v1/inventory/low-stock` | `inventory:read` | List items requiring reordering (`currentStock <= minimumStock`) |
| `GET` | `/api/v1/inventory/:id` | `inventory:read` | Get single inventory item details by ID |
| `GET` | `/api/v1/inventory/:id/history` | `inventory:read` | Get stock movement transaction history logs |
| `POST` | `/api/v1/inventory/:id/stock-in` | `inventory:manage` | Record Stock In movement (add stock & log transaction) |
| `POST` | `/api/v1/inventory/:id/stock-out` | `inventory:manage` | Record Stock Out movement (reduce stock & log transaction) |
| `PUT` | `/api/v1/inventory/:id` | `inventory:manage` | Update inventory item metadata |
| `DELETE` | `/api/v1/inventory/:id` | `inventory:manage` | Delete inventory item |
| **Employee HR & Attendance** | | | |
| `POST` | `/api/v1/employees` | `employees:manage` | Create new employee record with auto-generated employeeId |
| `GET` | `/api/v1/employees` | `employees:read` | List employees with pagination, position/shift/status filters |
| `GET` | `/api/v1/employees/:id` | `employees:read` | Get single employee details by ID or employeeId |
| `POST` | `/api/v1/employees/:id/attendance` | `employees:manage` | Record or update daily attendance for an employee |
| `GET` | `/api/v1/employees/:id/attendance` | `employees:read` | Get attendance history logs for an employee |
| `PUT` | `/api/v1/employees/:id` | `employees:manage` | Update employee metadata (salary, shift, status, position) |
| `DELETE` | `/api/v1/employees/:id` | `employees:manage` | Delete employee record |
| **Dining Table Management** | | | |
| `POST` | `/api/v1/tables` | `tables:manage` | Create new dining table (`tableNumber`, `capacity`, etc.) |
| `GET` | `/api/v1/tables` | `tables:read` | List tables with pagination, search, status & capacity filters |
| `GET` | `/api/v1/tables/:id` | `tables:read` | Get single table details by ID |
| `PUT` | `/api/v1/tables/:id` | `tables:manage` | Update table details |
| `PATCH` | `/api/v1/tables/:id/status` | `tables:read` | Update table status (`AVAILABLE`, `OCCUPIED`, `CLEANING`, `RESERVED`) |
| `DELETE` | `/api/v1/tables/:id` | `tables:manage` | Soft delete table (Constraint: cannot delete occupied table) |
| **Dashboard Analytics** | | | |
| `GET` | `/api/v1/dashboard` | `dashboard:read` | Get combined frontend-ready metrics, cards, charts, & recent orders |
| `GET` | `/api/v1/dashboard/summary` | `dashboard:read` | Get Summary Cards metrics (Sales, Orders, Tables, Employees, Low Stock) |
| `GET` | `/api/v1/dashboard/weekly-sales` | `dashboard:read` | Get 7-day Weekly Sales chart data |
| `GET` | `/api/v1/dashboard/monthly-revenue` | `dashboard:read` | Get 12-month Monthly Revenue chart data |
| `GET` | `/api/v1/dashboard/top-selling` | `dashboard:read` | Get Top Selling Menu Items aggregation |
| `GET` | `/api/v1/dashboard/most-ordered-categories` | `dashboard:read` | Get Most Ordered Categories aggregation |
| `GET` | `/api/v1/dashboard/recent-orders` | `dashboard:read` | Get real-time Recent Orders feed |
| **Expense & Receipt Management** | | | |
| `POST` | `/api/v1/expenses` | `expenses:manage` | Create new expense record (supports Cloudinary receipt upload) |
| `GET` | `/api/v1/expenses` | `expenses:read` | List expenses (search, category, date range, amount range, pagination) |
| `GET` | `/api/v1/expenses/:id` | `expenses:read` | Get single expense details by ID |
| `PUT` | `/api/v1/expenses/:id` | `expenses:manage` | Update expense record & optional receipt image replacement |
| `DELETE` | `/api/v1/expenses/:id` | `expenses:manage` | Soft delete expense & clean up Cloudinary receipt image |
| **Global Cafe System Settings** | | | |
| `GET` | `/api/v1/settings` | `settings:read` | Get global Cafe store settings & branding configuration |
| `PUT` | `/api/v1/settings` | Protected (Owner Only) | Update Cafe settings & optional logo Cloudinary image upload |

---

## Environment Variables Configuration

Ensure your `.env` file contains the following keys:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/cafe_management_db

# JWT Configuration
JWT_SECRET=super_secret_jwt_key_change_in_production_12345!
JWT_ACCESS_SECRET=super_secret_access_key_change_in_production_12345!
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=super_secret_refresh_key_change_in_production_12345!
JWT_REFRESH_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

## Running & Verification

### Prerequisites
- **Node.js**: v18.0.0 or higher installed.
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017/cafe_management_db` or a MongoDB Atlas connection string.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Start Production Server
```bash
npm start
```

### 4. Access Interactive Swagger API Documentation
Navigate to `http://localhost:5000/api-docs` in your browser to test endpoints and explore OpenAPI 3.0 schemas interactively.

### 5. Run Automated Verification Tests
Verify Role-Based Access Control, Dashboard Aggregations, Expense CRUD, and Settings Authorization:
```bash
# RBAC Matrix Test
npm run test:rbac

# Dashboard Aggregations Test
node src/test-dashboard.js

# Expense Module Test
node src/test-expense.js

# Settings Module Test
node src/test-settings.js
```
