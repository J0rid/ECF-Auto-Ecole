import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import statsService from '../services/statsService'

function StatCard({ type, data, color }) {
  if (!data) return (
    <div className="card p-4 text-center text-muted">Aucune donnée</div>
  )
  return (
    <div className="card p-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span className="badge rounded-pill px-3 py-2" style={{ background: color === 'red' ? '#fee2e2' : '#dbeafe', color: color === 'red' ? '#991b1b' : '#1e40af', fontSize: '0.8rem' }}>
          ● {type}
        </span>
      </div>
      <div style={{ fontSize: '0.82rem', color: '#666' }}>
        Réussite — épreuve de {type}
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111', lineHeight: 1.1 }}>
        {data.taux}%
      </div>
      <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
        {data.reussites} réussites / {data.total} passées
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [echecs, setEchecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const annee = new Date().getFullYear()

  useEffect(() => {
    async function charger() {
      try {
        const s = await statsService.getTauxReussite()
        const e = await statsService.getEchecsMultiples(2)
        setStats(s)
        setEchecs(e)
      } catch {
        setError('Impossible de charger les statistiques.')
      }
      setLoading(false)
    }
    charger()
  }, [])

  const globalTotal = stats ? (stats.code?.total ?? 0) + (stats.conduite?.total ?? 0) : 0
  const globalReussites = stats ? (stats.code?.reussites ?? 0) + (stats.conduite?.reussites ?? 0) : 0
  const globalTaux = globalTotal > 0 ? Math.round(globalReussites / globalTotal * 100 * 10) / 10 : 0

  return (
    <div>
      <div className="page-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-1">
            <li className="breadcrumb-item text-muted">Accueil</li>
            <li className="breadcrumb-item active">Tableau de bord</li>
          </ol>
        </nav>
        <h1>Tableau de bord</h1>
        <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
          Statistiques de réussite aux épreuves — année en cours.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border spinner-border-sm me-2"></div>Chargement...
        </div>
      ) : (
        <>
          <div className="card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>Toutes épreuves</div>
                <div style={{ fontSize: '0.82rem', color: '#666' }}>Taux de réussite global</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#111', lineHeight: 1 }}>
                  {globalTaux}%
                </div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {globalReussites} réussites / {globalTotal} passées
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge rounded-pill px-3 py-2" style={{ background: '#f3f4f6', color: '#374151', fontSize: '0.85rem' }}>
                  Année {annee}
                </span>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <StatCard type="Code" data={stats?.code} color="blue" />
            </div>
            <div className="col-md-6">
              <StatCard type="Conduite" data={stats?.conduite} color="red" />
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
              <div>
                <div className="fw-bold" style={{ fontSize: '0.95rem' }}>Élèves en échec multiple</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Élèves ayant échoué ≥ 2 fois à une épreuve
                </div>
              </div>
              <Link to="/eleves" className="btn btn-sm btn-outline-secondary" style={{ fontSize: '0.8rem' }}>
                Voir les élèves
              </Link>
            </div>

            {echecs.length === 0 ? (
              <div className="text-center py-4 text-muted" style={{ fontSize: '0.875rem' }}>
                Aucun élève en échec multiple.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Élève</th>
                      <th>Type d'épreuve</th>
                      <th>Échecs</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {echecs.map(e => (
                      <tr key={e.idEleve}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="user-badge" style={{ width: 30, height: 30, fontSize: '0.65rem' }}>
                              {e.nomEleve[0]}{e.prenomEleve[0]}
                            </div>
                            <span className="fw-semibold">{e.prenomEleve} {e.nomEleve}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem' }}>
                            {e.nbEchecCode > 0 && <div>Code</div>}
                            {e.nbEchecConduite > 0 && <div>Conduite</div>}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem' }}>
                            {e.nbEchecCode > 0 && (
                              <span className="badge-indisponible me-1">● {e.nbEchecCode} échec{e.nbEchecCode > 1 ? 's' : ''}</span>
                            )}
                            {e.nbEchecConduite > 0 && (
                              <span className="badge-indisponible">● {e.nbEchecConduite} échec{e.nbEchecConduite > 1 ? 's' : ''}</span>
                            )}
                          </div>
                        </td>
                        <td className="text-end">
                          <Link to={`/eleves/${e.idEleve}`} className="btn btn-sm btn-outline-secondary" style={{ fontSize: '0.75rem' }}>
                            Voir la fiche
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
