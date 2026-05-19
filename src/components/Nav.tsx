import { NavLink } from 'react-router'
import { useTheme } from '../hooks/useTheme'
import './Nav.css'

const THEME_ICON: Record<string, string> = { system: '💻', light: '☀️', dark: '🌙' }
const THEME_LABEL: Record<string, string> = { system: 'System', light: 'Light', dark: 'Dark' }

export function Nav() {
  const { theme, cycle } = useTheme()

  return (
    <nav className="nav">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Search
      </NavLink>
      <NavLink to="/favourites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Favourites
      </NavLink>
      <button className="theme-toggle" onClick={cycle} title={`Theme: ${THEME_LABEL[theme]}`}>
        {THEME_ICON[theme]}
      </button>
    </nav>
  )
}
