import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { formatCurrency } from '../utils/format'
import { currentMonth, formatMonth, shiftMonth } from '../utils/months'

export default function SummaryPage() {
  const [month, setMonth] = useState(currentMonth())
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  // Load the summary from the API whenever the month changes
  useEffect(() => {
    apiRequest(`/summary?month=${month}`)
      .then((data) => {
        setSummary(data)
        setError(null)
      })
      .catch((err) => setError(err.message))
  }, [month])

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

      {error && <p className="error-banner">{error}</p>}
      {!summary && !error && <p className="empty">Loading summary...</p>}

      {summary && (
        <>
          <div className="cards">
            <div className="panel card">
              <span>Total Spending</span>
              <strong>{formatCurrency(summary.total)}</strong>
            </div>
            <div className="panel card">
              <span>Average Daily Spend</span>
              <strong>{formatCurrency(summary.average_daily)}</strong>
            </div>
            <div className="panel card">
              <span>Number of Expenses</span>
              <strong>{summary.count}</strong>
            </div>
          </div>

          <h2>Breakdown by category</h2>
          {summary.breakdown.length === 0 ? (
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
                {summary.breakdown.map((row) => {
                  const share = (row.amount / summary.total) * 100
                  return (
                    <tr key={row.category}>
                      <td>{row.category}</td>
                      <td>{formatCurrency(row.amount)}</td>
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
        </>
      )}
    </div>
  )
}
