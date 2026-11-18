import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import ChartCanvas from '../components/ChartCanvas'
import { formatCurrency, formatDate } from '../utils/format'
import { currentMonth, formatMonth } from '../utils/months'

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

export default function ChartsPage() {
  const [month, setMonth] = useState(currentMonth())
  const [monthOptions, setMonthOptions] = useState([currentMonth()])
  // The chart data is kept in state so the charts are only redrawn when new data loads
  const [pieData, setPieData] = useState(null)
  const [barData, setBarData] = useState(null)
  const [drillCategory, setDrillCategory] = useState(null)
  const [drillExpenses, setDrillExpenses] = useState([])
  const [error, setError] = useState(null)

  // Bar chart: total per month (also gives us the months for the dropdown)
  useEffect(() => {
    apiRequest('/charts/monthly')
      .then((rows) => {
        setBarData({
          labels: rows.map((r) => formatMonth(r.month, 'short')),
          datasets: [{ data: rows.map((r) => r.amount), backgroundColor: COLORS[0] }],
        })

        const months = rows.map((r) => r.month)
        if (!months.includes(currentMonth())) months.push(currentMonth())
        months.sort().reverse()
        setMonthOptions(months)
      })
      .catch((err) => setError(err.message))
  }, [])

  // Pie chart: total per category for the selected month
  useEffect(() => {
    apiRequest(`/charts/category?month=${month}`)
      .then((rows) => {
        setPieData({
          labels: rows.map((r) => r.category),
          datasets: [
            {
              data: rows.map((r) => r.amount),
              backgroundColor: rows.map((r, i) => COLORS[i % COLORS.length]),
            },
          ],
        })
      })
      .catch((err) => setError(err.message))
  }, [month])

  // Drill-down: load the expenses for the clicked category and month
  useEffect(() => {
    if (!drillCategory) return
    apiRequest(`/expenses?category=${encodeURIComponent(drillCategory)}&month=${month}`)
      .then((data) => setDrillExpenses(data))
      .catch((err) => setError(err.message))
  }, [drillCategory, month])

  function handleMonthChange(event) {
    setMonth(event.target.value)
    setDrillCategory(null)
  }

  return (
    <div>
      <div className="page-header spread">
        <h1>Spending Charts</h1>
        <select
          className="month-select"
          aria-label="Month"
          value={month}
          onChange={handleMonthChange}
        >
          {monthOptions.map((m) => (
            <option key={m} value={m}>
              {formatMonth(m)}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error-banner">{error}</p>}

      <div className="charts">
        <section className="panel">
          <h2>Spending by category ({formatMonth(month)})</h2>
          <div className="chart-box">
            {pieData && pieData.labels.length === 0 && (
              <p className="empty">No expenses this month.</p>
            )}
            {pieData && pieData.labels.length > 0 && (
              <ChartCanvas
                type="pie"
                data={pieData}
                options={pieOptions}
                onClick={setDrillCategory}
              />
            )}
          </div>
        </section>
        <section className="panel">
          <h2>Spending per month</h2>
          <div className="chart-box">
            {barData && barData.labels.length === 0 && <p className="empty">No expenses yet.</p>}
            {barData && barData.labels.length > 0 && (
              <ChartCanvas type="bar" data={barData} options={barOptions} />
            )}
          </div>
        </section>
      </div>

      {drillCategory && (
        <section className="panel drill">
          <h2>
            Drill-down: {drillCategory}, {formatMonth(month)}
          </h2>
          <table className="table group-table">
            <tbody>
              {drillExpenses.map((e) => (
                <tr key={e.id}>
                  <td>{formatDate(e.expense_date)}</td>
                  <td>{e.description}</td>
                  <td className="num">{formatCurrency(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
