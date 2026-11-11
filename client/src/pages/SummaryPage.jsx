import { useState } from 'react'
import { formatCurrency } from '../utils/format'
import { daysInMonth, formatMonth, latestMonth, monthOf, shiftMonth, totalsByCategory } from '../utils/months'

export default function SummaryPage({ expenses }) {
  const [month, setMonth] = useState(() => latestMonth(expenses))

  const monthExpenses = expenses.filter((e) => monthOf(e.expense_date) === month)
  const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const averageDaily = total / daysInMonth(month)
  const breakdown = totalsByCategory(monthExpenses)

  return (
    <div>
      <div className="page-header">
        <h1>Monthly Summary</h1>
        <div className="month-nav">
          <button
            type="button"
            className="btn"
            onClick={() => setMonth((m) => shiftMonth(m, -1))}
            aria-label="Previous month"
          >
            &lt;
          </button>
          <span className="month-label">{formatMonth(month)}</span>
          <button
            type="button"
            className="btn"
            onClick={() => setMonth((m) => shiftMonth(m, 1))}
            aria-label="Next month"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="cards">
        <div className="panel card">
          <span>Total Spending</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
        <div className="panel card">
          <span>Average Daily Spend</span>
          <strong>{formatCurrency(averageDaily)}</strong>
        </div>
        <div className="panel card">
          <span>Number of Expenses</span>
          <strong>{monthExpenses.length}</strong>
        </div>
      </div>

      <h2>Breakdown by category</h2>
      {breakdown.length === 0 ? (
        <p className="empty">No expenses this month.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Share of total</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map(({ category, amount }) => {
              const share = (amount / total) * 100
              return (
                <tr key={category}>
                  <td>{category}</td>
                  <td>{formatCurrency(amount)}</td>
                  <td>
                    <div className="share">
                      <div className="share-bar">
                        <div className="share-fill" style={{ width: `${share}%` }} />
                      </div>
                      <span>{Math.round(share)}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
