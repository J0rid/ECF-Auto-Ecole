import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard',  icon: 'bi-speedometer2',      label: 'Tableau de bord' },
  { to: '/eleves',     icon: 'bi-people-fill',        label: 'Élèves' },
  { to: '/lecons',     icon: 'bi-calendar3',          label: 'Leçons' },
  { to: '/moniteurs',  icon: 'bi-person-badge-fill',  label: 'Moniteurs' },
  { to: '/vehicules',  icon: 'bi-car-front-fill',     label: 'Véhicules' },
  { to: '/modeles',    icon: 'bi-box-seam-fill',      label: 'Modèles' },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <nav className="sidebar">
      <div className="sidebar-brand d-flex align-items-center">
        <span className="ael-badge">AEL</span>
        <div className="sidebar-brand-text">
          <div className="brand-name">Auto-École du Lycée</div>
          <div className="brand-sub">Espace secrétariat</div>
        </div>
      </div>

      <div className="sidebar-section-label">Pilotage</div>

      <ul className="sidebar-nav">
        {navItems.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <button
          className="btn btn-outline-secondary btn-sm w-100"
          style={{ fontSize: '0.8rem' }}
          onClick={logout}
        >
          <i className="bi bi-box-arrow-left me-2"></i>
          Déconnexion
        </button>
      </div>
    </nav>
  )
}
