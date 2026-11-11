import { useState } from 'react'

const CATEGORIES = ['Groceries', 'Utilities', 'Transport', 'Entertainment', 'Rent']

const emptyValues = { amount: '', category: '', expense_date: '', description: '' }

function validate(values) {
  const errors = {}
  if (values.amount === '') {
    errors.amount = 'Amount is required.'
  } else if (Number.isNaN(Number(values.amount)) || Number(values.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0.'
  }
  if (!values.category) errors.category = 'Category is required.'
  if (!values.expense_date) errors.expense_date = 'Date is required.'
  return errors
}

// Used for both adding and editing. When `expense` is passed, its values are
// loaded into the form. The parent remounts the form (via `key`) to reset it.
export default function ExpenseForm({ expense, onSave, onCancel }) {
  const [values, setValues] = useState(
    expense
      ? {
          amount: String(expense.amount),
          category: expense.category,
          expense_date: expense.expense_date,
          description: expense.description ?? '',
        }
      : emptyValues,
  )
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    onSave({
      amount: Number(Number(values.amount).toFixed(2)),
      category: values.category,
      expense_date: values.expense_date,
      description: values.description.trim(),
    })
  }

  return (
    <form className="panel expense-form" onSubmit={handleSubmit} noValidate>
      <h2>{expense ? 'Edit Expense' : 'Add Expense'}</h2>

      <label htmlFor="amount">Amount ($)</label>
      <input
        id="amount"
        name="amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={values.amount}
        onChange={handleChange}
      />
      {errors.amount && <p className="error">{errors.amount}</p>}

      <label htmlFor="category">Category</label>
      <select id="category" name="category" value={values.category} onChange={handleChange}>
        <option value="">Select category</option>
        {CATEGORIES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      {errors.category && <p className="error">{errors.category}</p>}

      <label htmlFor="expense_date">Date</label>
      <input
        id="expense_date"
        name="expense_date"
        type="date"
        value={values.expense_date}
        onChange={handleChange}
      />
      {errors.expense_date && <p className="error">{errors.expense_date}</p>}

      <label htmlFor="description">Description (optional)</label>
      <textarea
        id="description"
        name="description"
        rows="3"
        value={values.description}
        onChange={handleChange}
      />

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
