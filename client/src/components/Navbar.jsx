import { NavLink } from 'react-router-dom'

const links = [
  { to: '/expenses', label: 'Expenses' },
  { to: '/categories', label: 'Categories' },
  { to: '/summary', label: 'Summary' },
  { to: '/charts', label: 'Charts' },
]

export default function Navbar() {
  return (
    <header className="navbar">
      <span className="brand">ExpenseTracker</span>
      <nav>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="nav-link">
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
