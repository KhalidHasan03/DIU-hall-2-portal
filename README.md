# DIU Hall 2 Portal (HMEMS)

A full-stack hall (hostel) management system for DIU Hall 2. It handles student registration and approval, daily meal booking and attendance, wallet-based automatic meal billing, expenses, monthly bills, payments, due tracking, reports, notices, and administrative controls.

The project is organized as a monorepo:

- `backend/` — Laravel 12 REST API
- `frontend/` — React 19 + TypeScript single-page application
- `diu_hall_2.sql` — MySQL database dump

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [User Roles](#user-roles)
- [Meal Billing Engine](#meal-billing-engine)
- [Data Model](#data-model)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Accounts](#demo-accounts)
- [Testing](#testing)
- [Security](#security)
- [Deployment Notes](#deployment-notes)
- [Contributing](#contributing)

---

## Overview

HMEMS (Hall Meal & Expense Management System) is designed for university hall administration. Students register and wait for hall tutor approval, then book or cancel daily meals, track their wallet balance, view bills and dues, and receive notices. Managers maintain menus, record attendance and expenses, generate bills, and accept payments. Hall tutors approve students and monitor finances. Super admins manage users, roles, permissions, settings, and backups.

Key capabilities:

- Role-based access control for four user types
- Lunch/dinner menu management
- Meal booking with configurable cutoff times
- Automatic attendance processing and wallet deductions
- Dynamic meal rate calculation
- Wallet and transaction ledger
- Monthly billing cycles and bill generation
- Expense tracking with category summaries
- Due-list ranking and reports with CSV export
- Notice board, activity logging, and database backups

---

## Features

### Authentication and Accounts

- Student self-registration with pending approval status
- Login and logout using Laravel Sanctum tokens
- Profile updates, avatar upload, and password change
- Blocked login for deactivated or rejected accounts
- Rate limiting on login, registration, and API requests
- Activity logging with IP address and old/new values

### Student

- Dashboard with today's meals, current bill, wallet balance, meal debt, meal rate, due rank, and notices
- Daily, weekly, and date-range menu viewing
- Toggle or book lunch and dinner before cutoff times
- Cancel booked meals and view meal history
- Monthly meal preferences for lunch and dinner
- Wallet balance and complete transaction history
- Current bill, bill history, due list, and payment history
- Targeted notices and profile management

### Manager

- Dashboard with student count, collections, expenses, net balance, dues, and today's meal counts
- Daily menu CRUD for lunch and dinner
- Attendance marking for past, present, and future dates
- Daily attendance report and today's all-student status
- Per-student and bulk meal preference updates
- Student CRUD with search, status filtering, and meal summaries
- Expense CRUD with categories and summaries
- Monthly bill generation and pending bill listing
- Bill payment recording and advance wallet payments
- Monthly and detailed reports with CSV export
- Meal cutoff settings and notice management

### Hall Tutor

- Dashboard with totals, pending approvals, pending bills, top due students, and recent activity
- Student approval and rejection workflow
- Monthly and detailed reports with CSV export
- Income versus expense data
- Ranked due-student list
- Notice publishing and management

### Super Admin

- Dashboard with user, student, room, finance, and meal statistics
- Role and student status distribution charts
- Six-month collection and expense trend
- Recent activities and recent users
- User CRUD, role assignment, and account activation toggle
- Grouped system settings management
- Role and permission editor
- Database backup creation, listing, and deletion
- Notice management

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| PHP 8.2+ | Runtime |
| Laravel 12 | Application framework |
| Laravel Sanctum | API token authentication |
| Spatie Laravel Permission | Roles and permissions |
| MySQL / MariaDB | Database |
| PHPUnit 11 | Testing |
| Laravel Pint | Code style |

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| TypeScript | Type safety |
| Vite 8 | Build tool and dev server |
| Tailwind CSS 4 | Styling |
| React Router 7 | Routing |
| Zustand | State management |
| Axios | HTTP client |
| Chart.js / react-chartjs-2 | Dashboard charts |
| react-hot-toast | Notifications |

---

## Architecture

```text
+----------------------+        REST API         +----------------------+
|  React SPA (Vite)    |  <------------------>   |  Laravel 12 API      |
|  localhost:5173      |      /api/v1            |  localhost:8000      |
+----------------------+                         +----------+-----------+
                                                            |
                                                            |
                                                   +--------v-----------+
                                                   |  MySQL / MariaDB   |
                                                   |  diu_hall_2        |
                                                   +--------------------+
```

- The frontend communicates with the backend through `/api/v1`.
- Authentication uses Sanctum Bearer tokens stored in local storage.
- The Vite dev server proxies `/api` and `/storage` to `http://localhost:8000`.
- Route guards enforce authentication and role-based access in the frontend.
- API route groups enforce roles and permissions on the backend.

---

## User Roles

| Role | Description |
|---|---|
| `student` | Hall resident. Books meals, views bills, manages wallet and profile. Requires approval. |
| `manager` | Handles daily operations such as menus, attendance, expenses, students, payments, and reports. |
| `hall_tutor` | Oversees the hall. Approves students, reviews reports and dues, publishes notices. |
| `super_admin` | Full system access including users, roles, permissions, settings, and backups. |

Seeded permissions include:

```text
manage_users, manage_settings, approve_reports, view_analytics,
manage_menus, mark_meals, manage_expenses, generate_bills,
record_payments, view_due_list, book_meals, view_bill,
make_payment, view_notices, create_notices, export_reports
```

---

## Meal Billing Engine

The billing engine is the core of the system.

### Meal Rate

The meal rate is calculated dynamically for each month:

```text
meal rate = total expenses for the month / total attended meals for the month
```

Implemented in `MealRateService`.

### Wallet Charges and Refunds

- When a meal is marked attended, the meal rate is deducted from the student's wallet.
- When an attended meal is cancelled, the amount is refunded.
- Negative wallet balance is tracked as `meal_debt`.
- Every change is recorded in the `transactions` ledger with balance before and after.

Implemented in `MealBillingService`.

### Automatic Attendance

- Booked meals are automatically marked attended after the configured cutoff time.
- Students without a meal record default to attended unless their monthly preference is off.
- The scheduled command `meals:process-day` runs daily at 23:59.
- It can also be run manually:

```bash
php artisan meals:process-day
php artisan meals:process-day --date=2026-08-15
```

### Monthly Cycles

- A monthly cycle tracks the active billing month.
- Starting a new cycle archives the previous month and generates its bills.
- Bill status is derived as `pending`, `partial`, `paid`, or `overdue`.

### Due Calculation

```text
funds available = wallet balance + bill total
paid amount     = min(bill total, max(0, funds available))
due amount      = max(0, bill total - paid amount)
```

---

## Data Model

Main tables:

| Table | Description |
|---|---|
| `users` | Authentication accounts with role and active status |
| `students` | Student profiles linked to users |
| `daily_menus` | Lunch and dinner menus per date |
| `meal_attendance` | Booked, attended, or cancelled meals |
| `student_meal_preferences` | Monthly lunch/dinner preferences per student |
| `monthly_cycles` | Active and archived billing months |
| `monthly_bills` | Bills per student per month |
| `payments` | Recorded payments against bills |
| `expenses` | Hall expenses by category |
| `transactions` | Wallet credit/debit ledger |
| `meal_rates` | Fixed meal rates per date |
| `settings` | Key/value system configuration |
| `notices` | Role-targeted notices |
| `activity_logs` | Audit trail of user actions |
| `notifications_log` | In-app or email notification records |
| `backups` | Database backup metadata |

Additional framework tables include Spatie roles and permissions, Sanctum personal access tokens, cache, jobs, and sessions.

---

## API Overview

Base URL: `/api/v1`

Public routes:

```text
POST /login
POST /register
```

Authenticated routes:

```text
POST /logout
GET  /me
PUT  /profile
POST /profile/avatar
PUT  /password
GET  /notices
```

Student routes:

```text
GET    /student/dashboard
GET    /student/menu/today
GET    /student/menu/weekly
GET    /student/menu/range
POST   /student/meals/book
DELETE /student/meals/{mealAttendance}
POST   /student/meals/toggle
GET    /student/meals/today-status
GET    /student/meals/history
PUT    /student/meals/preference
GET    /student/bills/current
GET    /student/bills/history
GET    /student/bills/due-list
GET    /student/bills/{monthlyBill}
GET    /student/payments/history
GET    /student/wallet
GET    /student/wallet/history
```

Manager routes (`manager` or `super_admin`):

```text
GET    /manager/dashboard
GET    /manager/menus
POST   /manager/menus
PUT    /manager/menus/{menu}
DELETE /manager/menus/{menu}
POST   /manager/meals/mark
POST   /manager/meals/toggle
GET    /manager/meals/today-status-all
GET    /manager/meals/daily-report
GET    /manager/meals/preferences
PUT    /manager/meals/preferences/{student}
POST   /manager/meals/preferences/bulk
GET    /manager/expenses
POST   /manager/expenses
PUT    /manager/expenses/{expense}
DELETE /manager/expenses/{expense}
GET    /manager/expenses/summary
POST   /manager/bills/generate
GET    /manager/bills/pending
GET    /manager/monthly-cycles
GET    /manager/monthly-cycles/active
POST   /manager/monthly-cycles/start
POST   /manager/payments/record
POST   /manager/payments/advance
GET    /manager/payments
GET    /manager/payments/summary
GET    /manager/students
POST   /manager/students
PUT    /manager/students/{student}
DELETE /manager/students/{student}
GET    /manager/students/meal-summary
GET    /manager/settings/meal
PUT    /manager/settings/meal
GET    /manager/reports/monthly
GET    /manager/reports/detailed
GET    /manager/reports/export
POST   /manager/notices
PUT    /manager/notices/{notice}
DELETE /manager/notices/{notice}
```

Hall tutor routes (`hall_tutor` or `super_admin`):

```text
GET  /hall-tutor/dashboard
GET  /hall-tutor/reports/monthly
GET  /hall-tutor/reports/detailed
GET  /hall-tutor/reports/export
GET  /hall-tutor/income-expenses
GET  /hall-tutor/due-students
GET  /hall-tutor/students/pending
POST /hall-tutor/students/{student}/approve
POST /hall-tutor/students/{student}/reject
POST /hall-tutor/notices
PUT  /hall-tutor/notices/{notice}
DELETE /hall-tutor/notices/{notice}
```

Super admin routes:

```text
GET    /admin/dashboard
GET    /admin/users
POST   /admin/users
PUT    /admin/users/{user}
DELETE /admin/users/{user}
PUT    /admin/users/{user}/toggle-active
GET    /admin/settings
PUT    /admin/settings
GET    /admin/backups
POST   /admin/backups/create
DELETE /admin/backups/{backup}
GET    /admin/roles
PUT    /admin/roles/{role}
GET    /admin/permissions
```

---

## Project Structure

```text
DIU-hall-2-portal/
├── backend/
│   ├── app/
│   │   ├── Console/Commands/ProcessDailyMeals.php
│   │   ├── Http/
│   │   │   ├── Controllers/Api/V1/
│   │   │   └── Middleware/SecurityHeaders.php
│   │   ├── Models/
│   │   ├── Providers/
│   │   └── Services/
│   │       ├── ActivityLogger.php
│   │       ├── MealBillingService.php
│   │       ├── MealRateService.php
│   │       └── MonthlyCycleService.php
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   ├── api.php
│   │   ├── console.php
│   │   └── web.php
│   ├── tests/
│   ├── .env.example
│   ├── .env.production.example
│   └── composer.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── lib/axios.ts
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── hall-tutor/
│   │   │   ├── manager/
│   │   │   ├── shared/
│   │   │   ├── student/
│   │   │   └── super-admin/
│   │   ├── routes/AppRoutes.tsx
│   │   ├── store/authStore.ts
│   │   ├── utils/dateUtils.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── diu_hall_2.sql
└── README.md
```

---

## Getting Started

### Prerequisites

- PHP 8.2 or newer
- Composer
- Node.js 20 or newer
- npm
- MySQL or MariaDB

### Backend Setup

```bash
cd backend

composer install
cp .env.example .env
php artisan key:generate
```

Configure the database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=diu_hall_2
DB_USERNAME=root
DB_PASSWORD=
```

Create the database and run migrations:

```bash
php artisan migrate --seed
```

Alternatively, import the provided SQL dump:

```bash
mysql -u root -p diu_hall_2 < ../diu_hall_2.sql
```

Create the storage link and start the server:

```bash
php artisan storage:link
php artisan serve
```

The API runs at `http://localhost:8000`.

Optional processes:

```bash
php artisan schedule:work
php artisan queue:work
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

During development, the Vite server proxies `/api` and `/storage` to `http://localhost:8000`, so `VITE_API_URL` can remain empty.

### Production Build

```bash
cd frontend
npm run build
```

Set the production API URL in `frontend/.env.production`:

```env
VITE_API_URL=https://your-domain.com/api/v1
VITE_APP_NAME="HMEMS"
```

---

## Environment Variables

### Backend (`.env`)

| Variable | Description |
|---|---|
| `APP_NAME` | Application name |
| `APP_ENV` | Environment (`local`, `production`) |
| `APP_KEY` | Application encryption key |
| `APP_DEBUG` | Debug mode |
| `APP_URL` | Backend URL |
| `FRONTEND_URL` | Allowed frontend origin for CORS and Sanctum |
| `SANCTUM_STATEFUL_DOMAINS` | Stateful domains for Sanctum |
| `TRUSTED_PROXIES` | Comma-separated trusted proxy IPs |
| `DB_CONNECTION` | Database driver |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `DB_DATABASE` | Database name |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `SESSION_DRIVER` | Session driver |
| `QUEUE_CONNECTION` | Queue driver |
| `CACHE_STORE` | Cache driver |

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL including `/api/v1` |
| `VITE_APP_NAME` | Application display name |

### Seeded Settings

| Key | Default |
|---|---|
| `hostel_name` | DIU Hall Management |
| `meal_rate` | 0 |
| `monthly_fee` | 2000 |
| `meal_deadline_hours` | 2 |
| `currency` | BDT |
| `max_meals_per_day` | 2 |
| `lunch_cutoff_time` | 12:00 |
| `dinner_cutoff_time` | 14:00 |

---

## Demo Accounts

The seeder creates the following accounts. The password for all accounts is `password`.

| Role | Email |
|---|---|
| Super Admin | `admin@hmems.local` |
| Hall Tutor | `tutor@hmems.local` |
| Manager | `manager@hmems.local` |
| Student | `student@hmems.local` |

The test data seeder also creates 20 sample students with emails `student1@diu.edu.bd` through `student20@diu.edu.bd`, along with menus, attendance, expenses, and bills.

> Change or remove all demo accounts before deploying to production.

---

## Testing

The backend uses PHPUnit with an in-memory SQLite database.

```bash
cd backend
php artisan test
```

Run a specific test file:

```bash
php artisan test tests/Feature/MealBillingTest.php
```

Code style:

```bash
cd backend
./vendor/bin/pint
```

Frontend lint:

```bash
cd frontend
npm run lint
```

---

## Security

- Sanctum Bearer token authentication
- Role and permission middleware on protected routes
- Rate limiting on login, registration, and API requests
- CORS restricted through `FRONTEND_URL`
- Security headers middleware including:
  - `Content-Security-Policy`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
- Configurable trusted proxies
- Request validation on all write endpoints
- Soft deletes on key models
- Activity logging for auditability

Never commit `.env` files, tokens, or production credentials.

---

## Deployment Notes

1. Set `APP_ENV=production` and `APP_DEBUG=false`.
2. Generate a production `APP_KEY`.
3. Configure `APP_URL`, `FRONTEND_URL`, and `SANCTUM_STATEFUL_DOMAINS`.
4. Use strong database credentials.
5. Run `php artisan migrate --force`.
6. Run `php artisan config:cache`, `php artisan route:cache`, and `php artisan view:cache`.
7. Build the frontend with the correct `VITE_API_URL`.
8. Configure the scheduler or cron for `meals:process-day`.
9. Serve the backend through a secure web server and HTTPS.
10. Back up the database regularly using the admin backup feature or external tooling.

Example cron entry:

```cron
* * * * * cd /path-to-project/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run backend tests and frontend lint.
5. Commit with a clear message.
6. Open a pull request.

---

## Acknowledgements

Built with Laravel, React, and the open-source community. Designed for DIU Hall 2 administration.
