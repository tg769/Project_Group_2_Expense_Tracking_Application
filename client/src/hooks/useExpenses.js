import { useState } from 'react'
import { mockExpenses } from '../data/mockExpenses'

// All expense data goes through this hook. In Phase 2 only the bodies of
// these functions change (to fetch calls); the pages keep using the same API.
export function useExpenses() {
  const [expenses, setExpenses] = useState(mockExpenses)

  function addExpense(expense) {
    setExpenses((prev) => {
      const nextId = prev.reduce((max, e) => Math.max(max, e.id), 0) + 1
      return [...prev, { ...expense, id: nextId }]
    })
  }

  function updateExpense(id, changes) {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...changes, id } : e)))
  }

  function deleteExpense(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return { expenses, addExpense, updateExpense, deleteExpense }
}
