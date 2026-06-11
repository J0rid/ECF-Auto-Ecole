import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f5f6fa' }}>
      <div className="d-flex align-items-center gap-2 px-4 py-3" style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <span className="ael-badge">AEL</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Auto-École du Lycée</span>
      </div>

      <div className="flex-grow-1 py-5 px-4" style={{ maxWidth: 600, margin: '0 auto', width: '100%' }}>
        <Link to="/dashboard" className="text-muted text-decoration-none d-flex align-items-center gap-1 mb-4" style={{ fontSize: '0.875rem' }}>
          <i className="bi bi-arrow-left"></i> Retour au tableau de bord
        </Link>

        <h1 className="fw-bold mb-2" style={{ fontSize: '1.5rem' }}>Contact</h1>
        <p className="text-muted mb-5" style={{ fontSize: '0.875rem' }}>Pour toute question relative à l'application ou à la gestion de l'auto-école.</p>

        <div className="card p-4 mb-3">
          <h2 className="fw-bold mb-3" style={{ fontSize: '1rem' }}>Auto-École du Lycée</h2>
          <ul className="list-unstyled mb-0" style={{ fontSize: '0.875rem' }}>
            <li className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-geo-alt text-danger"></i>
              <span className="text-muted">12 Rue du Lycée, 75010 Paris</span>
            </li>
            <li className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-telephone text-danger"></i>
              <span className="text-muted">01 23 45 67 89</span>
            </li>
            <li className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-envelope text-danger"></i>
              <span className="text-muted">contact@ael-autoecole.fr</span>
            </li>
            <li className="d-flex align-items-center gap-2">
              <i className="bi bi-clock text-danger"></i>
              <span className="text-muted">Lundi – Vendredi, 9h00 – 17h00</span>
            </li>
          </ul>
        </div>

        <div className="card p-4">
          <h2 className="fw-bold mb-3" style={{ fontSize: '1rem' }}>Support technique</h2>
          <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
            En cas de problème avec l'application (accès, données, erreurs), contactez le service informatique :
          </p>
          <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
            <i className="bi bi-envelope text-danger"></i>
            <span className="text-muted">support-info@ael-autoecole.fr</span>
          </div>
        </div>
      </div>

      <footer className="text-center py-3 text-muted" style={{ fontSize: '0.75rem', borderTop: '1px solid #e5e7eb', background: '#fff' }}>
        © 2025 Auto-École du Lycée — Tous droits réservés. &nbsp;v1.0
      </footer>
    </div>
  )
}
