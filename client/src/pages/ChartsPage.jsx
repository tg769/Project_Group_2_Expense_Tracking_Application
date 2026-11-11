import { useState } from 'react'
import ChartCanvas from '../components/ChartCanvas'
import { formatMonth, latestMonth, monthOf, shiftMonth, totalsByCategory } from '../utils/months'

const COLORS = ['#4f46e5', '#f08a3c', '#2fa37a', '#d9486b', '#9b6bdf', '#e0b030', '#2fa8c4', '#7a8194']

const pieOptions = {
  maintainAspectRatio: false,
  plugins: { legend: { position: 'right' } },
}

const barOptions = {
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
}

export default function ChartsPage({ expenses }) {
  const [month, setMonth] = useState(latestMonth(expenses))

  // list of months that have expenses, newest first
  const monthOptions = []
  for (const e of expenses) {
    const m = monthOf(e.expense_date)
    if (!monthOptions.includes(m)) monthOptions.push(m)
  }
  if (!monthOptions.includes(month)) monthOptions.push(month)
  monthOptions.sort().reverse()

  // pie chart: total per category for the selected month
  const monthExpenses = expenses.filter((e) => monthOf(e.expense_date) === month)
  const categoryTotals = totalsByCategory(monthExpenses)
  const pieData = {
    labels: categoryTotals.map((t) => t.category),
    datasets: [
      {
        data: categoryTotals.map((t) => t.amount),
        backgroundColor: categoryTotals.map((t, i) => COLORS[i % COLORS.length]),
      },
    ],
  }

  // bar chart: total per month, from the first month with an expense to the last
  const monthLabels = []
  const monthTotals = []
  if (expenses.length > 0) {
    const first = monthOptions[monthOptions.length - 1]
    const last = latestMonth(expenses)
    let m = first
    while (m <= last) {
      const total = expenses
        .filter((e) => monthOf(e.expense_date) === m)
        .reduce((sum, e) => sum + e.amount, 0)
      monthLabels.push(formatMonth(m, 'short'))
      monthTotals.push(total)
      m = shiftMonth(m, 1)
    }
  }
  const barData = {
    labels: monthLabels,
    datasets: [{ data: monthTotals, backgroundColor: COLORS[0] }],
  }

  return (
    <div>
      <div className="page-header spread">
        <h1>Spending Charts</h1>
        <select
          className="month-select"
          aria-label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {monthOptions.map((m) => (
            <option key={m} value={m}>
              {formatMonth(m)}
            </option>
          ))}
        </select>
      </div>

      <div className="charts">
        <section className="panel">
          <h2>Spending by category ({formatMonth(month)})</h2>
          <div className="chart-box">
            {pieData.labels.length === 0 ? (
              <p className="empty">No expenses this month.</p>
            ) : (
              <ChartCanvas type="pie" data={pieData} options={pieOptions} />
            )}
          </div>
        </section>
        <section className="panel">
          <h2>Spending per month</h2>
          <div className="chart-box">
            {barData.labels.length === 0 ? (
              <p className="empty">No expenses yet.</p>
            ) : (
              <ChartCanvas type="bar" data={barData} options={barOptions} />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
