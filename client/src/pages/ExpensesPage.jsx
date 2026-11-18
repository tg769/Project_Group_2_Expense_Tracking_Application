import { useState } from 'react'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'

export default function ExpensesPage({
  expenses,
  loading,
  error,
  addExpense,
  updateExpense,
  deleteExpense,
  categories,
}) {
  const [editingId, setEditingId] = useState(null)
  // Bumped to remount (clear) the form when adding.
  const [formKey, setFormKey] = useState(0)

  const editingExpense = expenses.find((e) => e.id === editingId) ?? null

  function resetForm() {
    setEditingId(null)
    setFormKey((k) => k + 1)
  }

  async function handleSave(data) {
    let ok
    if (editingExpense) {
      ok = await updateExpense(editingExpense.id, data)
    } else {
      ok = await addExpense(data)
    }
    // keep the form filled in if the save failed
    if (ok) resetForm()
  }

  async function handleDelete(id) {
    const ok = await deleteExpense(id)
    if (ok && id === editingId) resetForm()
  }

  return (
    <div className="expenses-layout">
      <section>
        <div className="page-header">
          <h1>My Expenses</h1>
          <button type="button" className="btn" onClick={resetForm}>
            + Add Expense
          </button>
        </div>
        {error && <p className="error-banner">{error}</p>}
        {loading ? (
          <p className="empty">Loading expenses...</p>
        ) : (
          <ExpenseList
            expenses={expenses}
            editingId={editingId}
            onEdit={setEditingId}
            onDelete={handleDelete}
          />
        )}
      </section>

      <ExpenseForm
        key={editingExpense ? `edit-${editingExpense.id}` : `new-${formKey}`}
        expense={editingExpense}
        categories={categories}
        onSave={handleSave}
        onCancel={resetForm}
      />
    </div>
  )
}
