import { useState } from 'react'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'

export default function ExpensesPage({
  expenses,
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

  function handleSave(data) {
    if (editingExpense) {
      updateExpense(editingExpense.id, data)
    } else {
      addExpense(data)
    }
    resetForm()
  }

  function handleDelete(id) {
    deleteExpense(id)
    if (id === editingId) resetForm()
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
        <ExpenseList
          expenses={expenses}
          editingId={editingId}
          onEdit={setEditingId}
          onDelete={handleDelete}
        />
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
