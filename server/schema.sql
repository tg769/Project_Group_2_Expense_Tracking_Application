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

-- Seed expenses (24 expenses across September, October and November 2026)
INSERT INTO expenses (amount, category_id, expense_date, description) VALUES
  -- September
  (61.35, (SELECT id FROM categories WHERE name = 'Groceries'), '2026-09-05', 'Weekly shopping'),
  (68.00, (SELECT id FROM categories WHERE name = 'Transport'), '2026-09-09', 'Bus pass'),
  (650.00, (SELECT id FROM categories WHERE name = 'Rent'), '2026-09-12', 'September rent'),
  (68.90, (SELECT id FROM categories WHERE name = 'Utilities'), '2026-09-18', 'Electric bill'),
  (48.10, (SELECT id FROM categories WHERE name = 'Groceries'), '2026-09-19', 'Weekly shopping'),
  (25.50, (SELECT id FROM categories WHERE name = 'Transport'), '2026-09-21', 'Gas'),
  (35.00, (SELECT id FROM categories WHERE name = 'Entertainment'), '2026-09-26', 'Concert ticket'),
  -- October
  (40.00, (SELECT id FROM categories WHERE name = 'Groceries'), '2026-10-03', 'Farmers market'),
  (45.00, (SELECT id FROM categories WHERE name = 'Utilities'), '2026-10-05', 'Internet'),
  (68.00, (SELECT id FROM categories WHERE name = 'Transport'), '2026-10-09', 'Bus pass'),
  (650.00, (SELECT id FROM categories WHERE name = 'Rent'), '2026-10-12', 'October rent'),
  (27.80, (SELECT id FROM categories WHERE name = 'Groceries'), '2026-10-15', 'Snacks'),
  (72.45, (SELECT id FROM categories WHERE name = 'Utilities'), '2026-10-18', 'Electric bill'),
  (18.99, (SELECT id FROM categories WHERE name = 'Entertainment'), '2026-10-20', 'Movie ticket'),
  (30.00, (SELECT id FROM categories WHERE name = 'Transport'), '2026-10-22', 'Gas'),
  (54.20, (SELECT id FROM categories WHERE name = 'Groceries'), '2026-10-24', 'Weekly shopping'),
  -- November
  (58.40, (SELECT id FROM categories WHERE name = 'Groceries'), '2026-11-02', 'Weekly shopping'),
  (68.00, (SELECT id FROM categories WHERE name = 'Transport'), '2026-11-03', 'Bus pass'),
  (45.00, (SELECT id FROM categories WHERE name = 'Utilities'), '2026-11-05', 'Internet'),
  (15.99, (SELECT id FROM categories WHERE name = 'Entertainment'), '2026-11-06', 'Streaming subscription'),
  (28.00, (SELECT id FROM categories WHERE name = 'Transport'), '2026-11-07', 'Gas'),
  (70.15, (SELECT id FROM categories WHERE name = 'Utilities'), '2026-11-08', 'Electric bill'),
  (32.75, (SELECT id FROM categories WHERE name = 'Groceries'), '2026-11-09', 'Snacks'),
  (650.00, (SELECT id FROM categories WHERE name = 'Rent'), '2026-11-10', 'November rent');
