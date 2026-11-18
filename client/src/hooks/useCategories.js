import { useEffect, useState } from 'react'
import { apiRequest } from '../api'

// Category names from the database (preset categories plus custom tags)
export function useCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    apiRequest('/categories')
      .then((data) => setCategories(data.map((c) => c.name)))
      .catch((err) => console.error(err))
  }, [])

  // Returns an error message, or null when the tag was added
  async function addCustomTag(name) {
    try {
      const created = await apiRequest('/categories', 'POST', { name })
      setCategories((prev) => [...prev, created.name])
      return null
    } catch (err) {
      return err.message
    }
  }

  return { categories, addCustomTag }
}
