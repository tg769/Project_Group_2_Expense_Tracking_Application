# Expense Tracker Application

CS 312 group project (Group 2): Tanmay Ghate and Munendra Chaudhary.

An expense tracker built with the PERN stack (PostgreSQL, Express.js, React, Node.js).

- `client/` - React app (Vite)
- `server/` - Express API connected to PostgreSQL

## Expense endpoint tests

Each `/api/expenses` endpoint was tested against the seed data from `server/schema.sql`.
The requests can be run in Postman or with curl. Base URL: `http://localhost:5001/api/expenses`

| # | Request | Body | Expected | Result |
|---|---------|------|----------|--------|
| 1 | `GET /api/expenses` | none | 200, list of expenses | 200, 6 expenses returned |
| 2 | `POST /api/expenses` | `{"amount": 12.5, "category": "Groceries", "expense_date": "2026-10-28", "description": "Bread and milk"}` | 201, new expense | 201, expense with id 7 returned |
| 3 | `POST /api/expenses` | `{"amount": "", "category": "Groceries", "expense_date": "2026-10-28"}` | 400 | 400, "Amount is required." |
| 4 | `POST /api/expenses` | `{"amount": -5, "category": "Groceries", "expense_date": "2026-10-28"}` | 400 | 400, "Amount must be greater than 0." |
| 5 | `POST /api/expenses` | `{"amount": 10, "category": "Groceries"}` | 400 | 400, "Date is required." |
| 6 | `POST /api/expenses` | `{"amount": 10, "category": "Pets", "expense_date": "2026-10-28"}` | 400 | 400, "Category does not exist." |
| 7 | `PUT /api/expenses/7` | `{"amount": 15, "category": "Groceries", "expense_date": "2026-10-28", "description": "Bread, milk, eggs"}` | 200, updated expense | 200, amount changed to 15 |
| 8 | `PUT /api/expenses/7` | `{"amount": 0, "category": "Groceries", "expense_date": "2026-10-28"}` | 400 | 400, "Amount must be greater than 0." |
| 9 | `PUT /api/expenses/999` | `{"amount": 15, "category": "Groceries", "expense_date": "2026-10-28"}` | 404 | 404, "Expense not found." |
| 10 | `DELETE /api/expenses/7` | none | 204 | 204, expense removed |
| 11 | `DELETE /api/expenses/7` | none | 404 (already deleted) | 404, "Expense not found." |
| 12 | `DELETE /api/expenses/abc` | none | 400 | 400, "Invalid expense id." |
