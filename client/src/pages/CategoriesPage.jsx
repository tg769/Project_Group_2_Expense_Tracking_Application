import { useState } from 'react'
import AddCustomTag from '../components/AddCustomTag'
import CategoryDropdown from '../components/CategoryDropdown'
import { formatCurrency, formatDate } from '../utils/format'

export default function CategoriesPage({ expenses, categories, addCustomTag }) {
  const [filter, setFilter] = useState('')
  const [collapsed, setCollapsed] = useState([])

  const shown = filter ? [filter] : categories
  const groups = shown.map((category) => {
    const items = expenses
      .filter((e) => e.category === category)
      .sort((a, b) => b.expense_date.localeCompare(a.expense_date) || b.id - a.id)
    const subtotal = items.reduce((sum, e) => sum + e.amount, 0)
    return { category, items, subtotal }
  })

  function toggle(category) {
    setCollapsed((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>Expenses by Category</h1>
      </div>

      <div className="panel toolbar">
        <AddCustomTag onAdd={addCustomTag} />
        <div>
          <label htmlFor="category-filter">Filter by category</label>
          <CategoryDropdown
            id="category-filter"
            categories={categories}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="All categories"
          />
        </div>
      </div>

      {groups.map(({ category, items, subtotal }) => {
        const isOpen = !collapsed.includes(category)
        return (
          <section key={category} className="group">
            <button
              type="button"
              className="group-header"
              onClick={() => toggle(category)}
              aria-expanded={isOpen}
            >
              <span>
                {isOpen ? '▾' : '▸'} {category}
              </span>
              <span>Subtotal {formatCurrency(subtotal)}</span>
            </button>
            {isOpen &&
              (items.length === 0 ? (
                <p className="group-empty">No expenses in this category.</p>
              ) : (
                <table className="table group-table">
                  <tbody>
                    {items.map((e) => (
                      <tr key={e.id}>
                        <td>{formatDate(e.expense_date)}</td>
                        <td>{e.description}</td>
                        <td className="num">{formatCurrency(e.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
          </section>
        )
      })}
    </div>
  )
}
