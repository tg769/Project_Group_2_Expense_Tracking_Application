import express from 'express'
import pool from '../db.js'

const router = express.Router()

// GET /api/charts/category?month=YYYY-MM (data for the pie chart)
router.get('/category', async (req, res) => {
  const month = req.query.month
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({ error: 'month must be in YYYY-MM format.' })
  }

  try {
    const result = await pool.query(
      `SELECT c.name AS category, SUM(e.amount)::float AS amount
       FROM expenses e
       JOIN categories c ON c.id = e.category_id
       WHERE TO_CHAR(e.expense_date, 'YYYY-MM') = $1
       GROUP BY c.name
       ORDER BY amount DESC`,
      [month],
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load chart data.' })
  }
})

// GET /api/charts/monthly (data for the bar chart)
router.get('/monthly', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT TO_CHAR(expense_date, 'YYYY-MM') AS month, SUM(amount)::float AS amount
       FROM expenses
       GROUP BY month
       ORDER BY month`,
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load chart data.' })
  }
})

export default router
