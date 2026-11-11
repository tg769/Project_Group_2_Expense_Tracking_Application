import { formatCurrency, formatDate } from '../utils/format'

export default function ExpenseList({ expenses, editingId, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <p className="empty">No expenses yet.</p>
  }

  // Newest first
  const sorted = [...expenses].sort(
    (a, b) => b.expense_date.localeCompare(a.expense_date) || b.id - a.id,
  )

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((expense) => (
          <tr key={expense.id} className={expense.id === editingId ? 'row-editing' : undefined}>
            <td>{formatDate(expense.expense_date)}</td>
            <td>
              <span className="badge">{expense.category}</span>
            </td>
            <td>{formatCurrency(expense.amount)}</td>
            <td>{expense.description}</td>
            <td className="actions">
              <button type="button" className="btn btn-small" onClick={() => onEdit(expense.id)}>
                Edit
              </button>
              <button
                type="button"
                className="btn btn-small btn-danger"
                onClick={() => onDelete(expense.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
