import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import eleveService from '../services/eleveService'

const PAGE_SIZE = 7

export default function Eleves() {
  const [eleves, setEleves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterCode, setFilterCode] = useState('tous')
  const [filterConduite, setFilterConduite] = useState('tous')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    eleveService.getAll()
      .then(setEleves)
      .catch(() => setError('Impossible de charger les élèves.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = eleves.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = !q || e.nomEleve?.toLowerCase().includes(q) || e.prenomEleve?.toLowerCase().includes(q)
    const matchCode = filterCode === 'tous' || (filterCode === 'oui' ? e.code : !e.code)
    const matchConduite = filterConduite === 'tous' || (filterConduite === 'oui' ? e.conduite : !e.conduite)
    return matchSearch && matchCode && matchConduite
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const numerosPages = []
  for (let i = 1; i <= totalPages; i++) {
    numerosPages.push(i)
  }

  const handleSearchChange = (v) => { setSearch(v); setPage(1) }
  const handleFilterCode = (v) => { setFilterCode(v); setPage(1) }
  const handleFilterConduite = (v) => { setFilterConduite(v); setPage(1) }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item text-muted">Accueil</li>
              <li className="breadcrumb-item active">Élèves</li>
            </ol>
          </nav>
          <h1>Élèves</h1>
          <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
            {eleves.length} élève{eleves.length > 1 ? 's' : ''} inscrits.
          </p>
        </div>
        <button className="btn btn-ael" onClick={() => navigate('/eleves/nouveau')}>
          <i className="bi bi-plus-lg me-2"></i>Inscrire un élève
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="p-3 border-bottom d-flex flex-wrap gap-2 align-items-center">
          <div className="input-group" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Rechercher par nom ou prénom..."
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center gap-2 ms-auto">
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Code :</span>
            {['tous', 'oui', 'non'].map(v => (
              <button
                key={v}
                className={`btn btn-sm ${filterCode === v ? 'btn-ael' : 'btn-outline-secondary'}`}
                style={{ fontSize: '0.78rem', textTransform: 'capitalize' }}
                onClick={() => handleFilterCode(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
            <span className="text-muted ms-2" style={{ fontSize: '0.8rem' }}>Conduite :</span>
            {['tous', 'oui', 'non'].map(v => (
              <button
                key={v}
                className={`btn btn-sm ${filterConduite === v ? 'btn-ael' : 'btn-outline-secondary'}`}
                style={{ fontSize: '0.78rem', textTransform: 'capitalize' }}
                onClick={() => handleFilterConduite(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border spinner-border-sm me-2"></div>Chargement...
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-5 text-muted">Aucun élève trouvé.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Élève</th>
                  <th>Date de naissance</th>
                  <th>Date d'inscription</th>
                  <th>Code</th>
                  <th>Conduite</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(e => (
                  <tr key={e.idEleve}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="user-badge" style={{ width: 30, height: 30, fontSize: '0.65rem' }}>
                          {e.nomEleve ? e.nomEleve[0] : ''}{e.prenomEleve ? e.prenomEleve[0] : ''}
                        </div>
                        <span className="fw-semibold">{e.prenomEleve} {e.nomEleve}</span>
                      </div>
                    </td>
                    <td>{formatDate(e.dateNaissance)}</td>
                    <td>{formatDate(e.dateInscription)}</td>
                    <td>
                      <span className={e.code ? 'badge-oui' : 'badge-non'}>
                        ● {e.code ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td>
                      <span className={e.conduite ? 'badge-oui' : 'badge-non'}>
                        ● {e.conduite ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="text-end">
                      <Link to={`/eleves/${e.idEleve}`} className="btn btn-sm btn-outline-secondary" style={{ fontSize: '0.78rem' }}>
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-3 py-2 border-top d-flex align-items-center justify-content-between">
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              Affichage {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length} élève{filtered.length > 1 ? 's' : ''}
            </span>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>‹</button>
                </li>
                {numerosPages.map(p => (
                  <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      style={p === page ? { backgroundColor: '#D32F2F', borderColor: '#D32F2F' } : {}}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>›</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
