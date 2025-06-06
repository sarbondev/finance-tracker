# Personal Finance Tracker API

A comprehensive REST API for tracking personal income and expenses built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**
  - User registration with email verification
  - Login with JWT tokens
  - Password hashing with bcrypt

- **Income Management**
  - Create, read, update, delete income records
  - Filter by date range and source
  - Pagination support

- **Expense Management**
  - Create, read, update, delete expense records
  - Categorize expenses
  - Filter by date range and category
  - Pagination support

- **Category Management**
  - Create and manage expense categories
  - CRUD operations for categories

- **Analytics & Reports**
  - Dashboard statistics (monthly/total)
  - Monthly and yearly reports
  - Category breakdown with percentages
  - Income vs expense analysis

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email with code

### Income
- `GET /api/incomes` - Get all incomes (with pagination & filters)
- `POST /api/incomes` - Create new income
- `GET /api/incomes/:id` - Get income by ID
- `PUT /api/incomes/:id` - Update income
- `DELETE /api/incomes/:id` - Delete income

### Expenses
- `GET /api/expenses` - Get all expenses (with pagination & filters)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/monthly/:year/:month` - Get monthly report
- `GET /api/analytics/yearly/:year` - Get yearly report
- `GET /api/analytics/categories` - Get category breakdown

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure your environment variables
4. Start the server: `npm run dev`

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_USER` - Email address for sending verification codes
- `EMAIL_PASS` - Email password/app password
- `PORT` - Server port (default: 5000)

## Usage

All protected routes require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Query Parameters

### Income/Expense Filtering
- `page` - Page number for pagination
- `limit` - Number of items per page
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)
- `category` - Filter by category (expenses only)
- `source` - Filter by source (incomes only)

Example: `GET /api/expenses?page=1&limit=10&category=Food&startDate=2024-01-01`
\`\`\`
</QuickEdit>
