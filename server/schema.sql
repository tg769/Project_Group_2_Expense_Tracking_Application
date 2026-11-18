-- Run with: psql -d expense_tracker -f schema.sql
-- This drops the tables first, so running it again resets the data.

DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  is_custom BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  expense_date DATE NOT NULL,
  description TEXT
);

-- Preset categories
INSERT INTO categories (name) VALUES
  ('Groceries'),
  ('Utilities'),
  ('Transport'),
  ('Entertainment'),
  ('Rent');

-- Seed expenses
INSERT INTO expenses (amount, category_id, expense_date, description) VALUES
  (54.20, (SELECT id FROM categories WHERE name = 'Groceries'), '2026-10-24', 'Weekly shopping'),
  (30.00, (SELECT id FROM categories WHERE name = 'Transport'), '2026-10-22', 'Gas'),
  (18.99, (SELECT id FROM categories WHERE name = 'Entertainment'), '2026-10-20', 'Movie ticket'),
  (72.45, (SELECT id FROM categories WHERE name = 'Utilities'), '2026-10-18', 'Electric bill'),
  (27.80, (SELECT id FROM categories WHERE name = 'Groceries'), '2026-10-15', 'Snacks'),
  (650.00, (SELECT id FROM categories WHERE name = 'Rent'), '2026-10-12', 'October rent');
