import { useAuth } from '../context/AuthContext'

function getInitials(login) {
  if (!login) return 'U'
  return login.substring(0, 2).toUpperCase()
}

export default function Header() {
  const { user } = useAuth()
  const login = user ? user.login : 'Utilisateur'
  const role  = user ? user.role  : ''

  return (
    <header className="main-header">
      <a
        href="#aide"
        className="text-muted text-decoration-none d-flex align-items-center gap-1"
        style={{ fontSize: '0.82rem' }}
      >
        <i className="bi bi-question-circle"></i>
        Besoin d'aide ?
      </a>

      <div className="d-flex align-items-center">
        <div className="user-badge">{getInitials(login)}</div>
        <div>
          <div className="user-name">{login}</div>
          <div className="user-role">{role}</div>
        </div>
      </div>
    </header>
  )
}
