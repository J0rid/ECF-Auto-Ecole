import { Link } from 'react-router-dom'

export default function MentionsLegales() {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f5f6fa' }}>
      <div className="d-flex align-items-center gap-2 px-4 py-3" style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <span className="ael-badge">AEL</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Auto-École du Lycée</span>
      </div>

      <div className="flex-grow-1 py-5 px-4" style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <Link to="/dashboard" className="text-muted text-decoration-none d-flex align-items-center gap-1 mb-4" style={{ fontSize: '0.875rem' }}>
          <i className="bi bi-arrow-left"></i> Retour au tableau de bord
        </Link>

        <h1 className="fw-bold mb-4" style={{ fontSize: '1.5rem' }}>Mentions légales</h1>

        <div className="card p-4 mb-4">
          <h2 className="fw-bold mb-3" style={{ fontSize: '1rem' }}>Éditeur du site</h2>
          <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Auto-École du Lycée (AEL)</p>
          <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Application de gestion interne — Espace secrétariat</p>
          <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Projet ECF — Formation CDA 2025/2026</p>
        </div>

        <div className="card p-4 mb-4">
          <h2 className="fw-bold mb-3" style={{ fontSize: '1rem' }}>Données personnelles</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
            Les données collectées dans cette application (élèves, moniteurs, véhicules) sont utilisées
            exclusivement dans le cadre de la gestion interne de l'auto-école. Elles ne sont pas transmises
            à des tiers et sont conservées selon la réglementation en vigueur (RGPD).
          </p>
        </div>

        <div className="card p-4">
          <h2 className="fw-bold mb-3" style={{ fontSize: '1rem' }}>Propriété intellectuelle</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
            © 2025 Auto-École du Lycée — Tous droits réservés. Toute reproduction ou utilisation non
            autorisée des contenus de cette application est interdite.
          </p>
        </div>
      </div>

      <footer className="text-center py-3 text-muted" style={{ fontSize: '0.75rem', borderTop: '1px solid #e5e7eb', background: '#fff' }}>
        © 2025 Auto-École du Lycée — Tous droits réservés. &nbsp;v1.0
      </footer>
    </div>
  )
}
