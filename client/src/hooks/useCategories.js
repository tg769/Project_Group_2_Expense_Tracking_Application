import { useState } from 'react'
import { PRESET_CATEGORIES } from '../data/categories'

// Preset categories plus the user's custom tags. In Phase 2 this switches to
// GET/POST /api/categories while keeping the same return values.
export function useCategories() {
  const [customTags, setCustomTags] = useState([])
  const categories = [...PRESET_CATEGORIES, ...customTags]

  // Returns an error message, or null when the tag was added.
  function addCustomTag(name) {
    const tag = name.trim()
    if (!tag) return 'Enter a tag name.'
    if (categories.some((c) => c.toLowerCase() === tag.toLowerCase())) {
      return 'That category already exists.'
    }
    setCustomTags((prev) => [...prev, tag])
    return null
  }

  return { categories, addCustomTag }
}
