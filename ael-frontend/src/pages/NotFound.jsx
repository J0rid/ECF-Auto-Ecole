import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f5f6fa' }}>
      <div className="d-flex align-items-center px-4 py-3" style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <span className="ael-badge">AEL</span>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, marginLeft: 10 }}>Auto-École du Lycée</div>
      </div>

      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="text-center px-4">
          <div style={{ fontSize: '7rem', fontWeight: 900, color: '#D32F2F', lineHeight: 1 }}>
            404
          </div>
          <h2 className="fw-bold mt-2 mb-3">Page introuvable</h2>
          <p className="text-muted mb-4">
            La page que vous cherchez n'existe pas ou vous n'y avez pas accès.<br />
            Vérifiez l'adresse ou revenez à votre tableau de bord.
          </p>
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="btn btn-ael px-4"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      <footer className="text-center py-3 text-muted" style={{ fontSize: '0.75rem', borderTop: '1px solid #e5e7eb', background: '#fff' }}>
        © 2025 Auto-École du Lycée — Tous droits réservés.&nbsp;&nbsp;
        <a href="#" className="text-muted text-decoration-none">Mentions légales</a>
        &nbsp;·&nbsp;
        <a href="#" className="text-muted text-decoration-none">Contact</a>
        &nbsp;·&nbsp;v1.0
      </footer>
    </div>
  )
}
