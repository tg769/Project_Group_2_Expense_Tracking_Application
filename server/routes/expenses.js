import express from 'express'
import pool from '../db.js'

const router = express.Router()

// Columns sent back to the client. amount is turned into a number and the
// date into a 'YYYY-MM-DD' string so the frontend gets the same shape as before.
const SELECT_EXPENSE = `
  SELECT e.id, e.amount::float AS amount, c.name AS category,
         TO_CHAR(e.expense_date, 'YYYY-MM-DD') AS expense_date, e.description
  FROM expenses e
  JOIN categories c ON c.id = e.category_id
`

// Returns an error message, or null if the expense is valid
function validateExpense(body) {
  const { amount, category, expense_date } = body
  if (amount === undefined || amount === null || amount === '') {
    return 'Amount is required.'
  }
  if (isNaN(Number(amount)) || Number(amount) <= 0) {
    return 'Amount must be greater than 0.'
  }
  if (!category) {
    return 'Category is required.'
  }
  if (!expense_date) {
    return 'Date is required.'
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expense_date) || isNaN(new Date(expense_date).getTime())) {
    return 'Date must be a valid date in YYYY-MM-DD format.'
  }
  return null
}

async function findCategoryId(name) {
  const result = await pool.query('SELECT id FROM categories WHERE name = $1', [name])
  if (result.rows.length === 0) return null
  return result.rows[0].id
}

async function findExpense(id) {
  const result = await pool.query(`${SELECT_EXPENSE} WHERE e.id = $1`, [id])
  return result.rows[0]
}

// GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`${SELECT_EXPENSE} ORDER BY e.expense_date DESC, e.id DESC`)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load expenses.' })
  }
})

// POST /api/expenses
router.post('/', async (req, res) => {
  const body = req.body || {}
  const error = validateExpense(body)
  if (error) {
    return res.status(400).json({ error })
  }

  try {
    const categoryId = await findCategoryId(body.category)
    if (!categoryId) {
      return res.status(400).json({ error: 'Category does not exist.' })
    }

    const result = await pool.query(
      `INSERT INTO expenses (amount, category_id, expense_date, description)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [body.amount, categoryId, body.expense_date, body.description || null],
    )
    const expense = await findExpense(result.rows[0].id)
    res.status(201).json(expense)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not save the expense.' })
  }
})

// PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid expense id.' })
  }

  const body = req.body || {}
  const error = validateExpense(body)
  if (error) {
    return res.status(400).json({ error })
  }

  try {
    const categoryId = await findCategoryId(body.category)
    if (!categoryId) {
      return res.status(400).json({ error: 'Category does not exist.' })
    }

    const result = await pool.query(
      `UPDATE expenses
       SET amount = $1, category_id = $2, expense_date = $3, description = $4
       WHERE id = $5`,
      [body.amount, categoryId, body.expense_date, body.description || null, id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Expense not found.' })
    }
    const expense = await findExpense(id)
    res.json(expense)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not update the expense.' })
  }
})

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid expense id.' })
  }

  try {
    const result = await pool.query('DELETE FROM expenses WHERE id = $1', [id])
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Expense not found.' })
    }
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not delete the expense.' })
  }
})

export default router
