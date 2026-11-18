# Expense Tracker Application

CS 312 group project (Group 2): Tanmay Ghate and Munendra Chaudhary.

An expense tracker built with the PERN stack (PostgreSQL, Express.js, React, Node.js).

- `client/` - React app (Vite)
- `server/` - Express API connected to PostgreSQL

## How to run

You need Node.js and PostgreSQL installed.

### 1. Set up the database

Create the database and load the tables and sample data (24 expenses across September, October and November 2026):

```bash
createdb expense_tracker
psql -d expense_tracker -f server/schema.sql
```

Running `schema.sql` again resets the data.

### 2. Start the server

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` so `DATABASE_URL` has your PostgreSQL username and password, then start the server:

```bash
npm run dev
```

The API runs on `http://localhost:5001`.

### 3. Start the client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). On the Charts page, click a slice of the pie chart to see that category's expenses for the month.

## Expense endpoint tests

Each `/api/expenses` endpoint was tested against the seed data from `server/schema.sql`, using the Postman collection in `server/postman/expense_endpoints.postman_collection.json`. All 12 requests passed (23 checks). Base URL: `http://localhost:5001/api/expenses`

To run it, import the file into Postman and click Run on the collection, or use Newman:

```bash
npx newman run server/postman/expense_endpoints.postman_collection.json
```

Run `schema.sql` first so the database has the 24 seed expenses.

| # | Request | Body | Expected | Result |
|---|---------|------|----------|--------|
| 1 | `GET /api/expenses` | none | 200, list of expenses | 200, 24 expenses returned |
| 2 | `POST /api/expenses` | `{"amount": 12.5, "category": "Groceries", "expense_date": "2026-10-28", "description": "Bread and milk"}` | 201, new expense | 201, expense with id 25 returned |
| 3 | `POST /api/expenses` | `{"amount": "", "category": "Groceries", "expense_date": "2026-10-28"}` | 400 | 400, "Amount is required." |
| 4 | `POST /api/expenses` | `{"amount": -5, "category": "Groceries", "expense_date": "2026-10-28"}` | 400 | 400, "Amount must be greater than 0." |
| 5 | `POST /api/expenses` | `{"amount": 10, "category": "Groceries"}` | 400 | 400, "Date is required." |
| 6 | `POST /api/expenses` | `{"amount": 10, "category": "Pets", "expense_date": "2026-10-28"}` | 400 | 400, "Category does not exist." |
| 7 | `PUT /api/expenses/25` | `{"amount": 15, "category": "Groceries", "expense_date": "2026-10-28", "description": "Bread, milk, eggs"}` | 200, updated expense | 200, amount changed to 15 |
| 8 | `PUT /api/expenses/25` | `{"amount": 0, "category": "Groceries", "expense_date": "2026-10-28"}` | 400 | 400, "Amount must be greater than 0." |
| 9 | `PUT /api/expenses/999` | `{"amount": 15, "category": "Groceries", "expense_date": "2026-10-28"}` | 404 | 404, "Expense not found." |
| 10 | `DELETE /api/expenses/25` | none | 204 | 204, expense removed |
| 11 | `DELETE /api/expenses/25` | none | 404 (already deleted) | 404, "Expense not found." |
| 12 | `DELETE /api/expenses/abc` | none | 400 | 400, "Invalid expense id." |
