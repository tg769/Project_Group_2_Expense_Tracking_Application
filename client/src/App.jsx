import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { useExpenses } from './hooks/useExpenses'
import ExpensesPage from './pages/ExpensesPage'
import CategoriesPage from './pages/CategoriesPage'
import SummaryPage from './pages/SummaryPage'
import ChartsPage from './pages/ChartsPage'

export default function App() {
  const expenseApi = useExpenses()

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/expenses" replace />} />
        <Route path="expenses" element={<ExpensesPage {...expenseApi} />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="charts" element={<ChartsPage />} />
      </Route>
    </Routes>
  )
}
