export function formatCurrency(amount) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// 'YYYY-MM-DD' -> 'MM/DD/YYYY' (string based, so no timezone shifts)
export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-')
  return `${month}/${day}/${year}`
}
