import { useEffect, useState } from 'react'
import { apiRequest } from '../api'

// All expense data goes through this hook. It loads the expenses from the
// API and keeps the list in React state in sync after each change.
export function useExpenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiRequest('/expenses')
      .then((data) => setExpenses(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Each function returns true if it worked, so the page knows whether to reset the form
  async function addExpense(expense) {
    try {
      const saved = await apiRequest('/expenses', 'POST', expense)
      setExpenses((prev) => [...prev, saved])
      setError(null)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  async function updateExpense(id, changes) {
    try {
      const saved = await apiRequest(`/expenses/${id}`, 'PUT', changes)
      setExpenses((prev) => prev.map((e) => (e.id === id ? saved : e)))
      setError(null)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  async function deleteExpense(id) {
    try {
      await apiRequest(`/expenses/${id}`, 'DELETE')
      setExpenses((prev) => prev.filter((e) => e.id !== id))
      setError(null)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  return { expenses, loading, error, addExpense, updateExpense, deleteExpense }
}
