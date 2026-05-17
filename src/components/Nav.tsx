import { NavLink } from 'react-router'
import './Nav.css'

export function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Search
      </NavLink>
      <NavLink to="/favourites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Favourites
      </NavLink>
    </nav>
  )
}
