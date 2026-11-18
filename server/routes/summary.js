import express from 'express'
import pool from '../db.js'

const router = express.Router()

// GET /api/summary?month=YYYY-MM
router.get('/', async (req, res) => {
  const month = req.query.month
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({ error: 'month must be in YYYY-MM format.' })
  }
  const firstDay = `${month}-01`

  // Number of days in the month (day 0 of the next month is the last day of this one)
  const [year, monthNumber] = month.split('-').map(Number)
  const daysInMonth = new Date(year, monthNumber, 0).getDate()

  try {
    // Total, count and average per day for the month
    const totals = await pool.query(
      `SELECT COALESCE(SUM(amount), 0)::float AS total,
              COUNT(*)::int AS count,
              ROUND(COALESCE(SUM(amount), 0) / $2, 2)::float AS average_daily
       FROM expenses
       WHERE expense_date >= $1::date AND expense_date < $1::date + INTERVAL '1 month'`,
      [firstDay, daysInMonth],
    )

    // Amount spent in each category that month, biggest first
    const breakdown = await pool.query(
      `SELECT c.name AS category, SUM(e.amount)::float AS amount
       FROM expenses e
       JOIN categories c ON c.id = e.category_id
       WHERE e.expense_date >= $1::date AND e.expense_date < $1::date + INTERVAL '1 month'
       GROUP BY c.name
       ORDER BY amount DESC`,
      [firstDay],
    )

    res.json({
      month,
      total: totals.rows[0].total,
      count: totals.rows[0].count,
      average_daily: totals.rows[0].average_daily,
      breakdown: breakdown.rows,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load the summary.' })
  }
})

export default router
