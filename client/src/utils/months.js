// Months are strings like '2026-10' so they can be compared as text.

export function monthOf(isoDate) {
  return isoDate.slice(0, 7)
}

// Move a month forward or back, e.g. shiftMonth('2026-10', -1) gives '2026-09'
export function shiftMonth(month, delta) {
  const [year, m] = month.split('-').map(Number)
  const date = new Date(year, m - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function formatMonth(month, style = 'long') {
  const [year, m] = month.split('-').map(Number)
  return new Date(year, m - 1, 1).toLocaleString('en-US', { month: style, year: 'numeric' })
}

export function daysInMonth(month) {
  const [year, m] = month.split('-').map(Number)
  return new Date(year, m, 0).getDate()
}

// The newest month that has an expense. If there are none, use the current month.
export function latestMonth(expenses) {
  let latest = ''
  for (const e of expenses) {
    const m = monthOf(e.expense_date)
    if (m > latest) latest = m
  }
  if (latest === '') {
    const now = new Date()
    latest = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }
  return latest
}

// Adds up the amounts for each category, biggest first.
// Returns a list like [{ category: 'Rent', amount: 650 }, ...]
export function totalsByCategory(expenses) {
  const totals = []
  for (const e of expenses) {
    const found = totals.find((t) => t.category === e.category)
    if (found) {
      found.amount += e.amount
    } else {
      totals.push({ category: e.category, amount: e.amount })
    }
  }
  return totals.sort((a, b) => b.amount - a.amount)
}
