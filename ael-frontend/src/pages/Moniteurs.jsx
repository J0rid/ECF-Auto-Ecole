import { useEffect, useState } from 'react'
import moniteurService from '../services/moniteurService'
import { extractApiError } from '../utils/apiError'
import { useConfirm } from '../outils/ConfirmDialog'

const emptyForm = {
  nomMoniteur: '', prenomMoniteur: '',
  dateNaissance: '', dateEmbauche: '',
  activite: true,
}

export default function Moniteurs() {
  const [moniteurs, setMoniteurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterActivite, setFilterActivite] = useState('toutes')

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const confirm = useConfirm()

  const load = () => moniteurService.getAll().then(setMoniteurs).catch(() => setError('Erreur de chargement.')).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const filtered = moniteurs.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = !q || m.nomMoniteur?.toLowerCase().includes(q) || m.prenomMoniteur?.toLowerCase().includes(q)
    const matchActiv = filterActivite === 'toutes' || (filterActivite === 'actif' ? m.activite : !m.activite)
    return matchSearch && matchActiv
  })

  const openCreate = () => { setEditId(null); setForm(emptyForm); setFormError(''); setShowForm(true) }
  const openEdit = (m) => {
    setEditId(m.idMoniteur)
    setForm({
      nomMoniteur: m.nomMoniteur,
      prenomMoniteur: m.prenomMoniteur,
      dateNaissance: m.dateNaissance,
      dateEmbauche: m.dateEmbauche,
      activite: m.activite,
    })
    setFormError('')
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      if (editId) await moniteurService.update(editId, form)
      else await moniteurService.create(form)
      setShowForm(false)
      load()
    } catch (err) {
      setFormError(extractApiError(err))
    }
    setSaving(false)
  }

  const toggleActivite = async (m) => {
    try {
      if (m.activite) await moniteurService.desactiver(m.idMoniteur)
      else await moniteurService.activer(m.idMoniteur)
      load()
    } catch { setError('Erreur lors du changement de statut.') }
  }

  const handleDelete = async (id) => {
    const ok = await confirm('Supprimer ce moniteur ?', 'Supprimer un moniteur')
    if (!ok) return
    try {
      await moniteurService.delete(id)
      load()
    } catch { setError('Impossible de supprimer ce moniteur.') }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'

  return (
    <div>
      <div className="page-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-1">
            <li className="breadcrumb-item text-muted">Accueil</li>
            <li className="breadcrumb-item active">Moniteurs</li>
          </ol>
        </nav>
        <h1>Moniteurs</h1>
        <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
          {moniteurs.length} moniteur{moniteurs.length > 1 ? 's' : ''} · {moniteurs.filter(m => m.activite).length} actifs.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className={showForm ? 'col-lg-7' : 'col-12'}>
          <div className="card">
            <div className="p-3 border-bottom d-flex flex-wrap gap-2 align-items-center">
              <div className="input-group" style={{ maxWidth: 260 }}>
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input type="text" className="form-control border-start-0 ps-0"
                  placeholder="Rechercher..." value={search}
                  onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="d-flex gap-1">
                {['toutes', 'actif', 'inactif'].map(v => (
                  <button key={v} className={`btn btn-sm ${filterActivite === v ? 'btn-ael' : 'btn-outline-secondary'}`}
                    style={{ fontSize: '0.78rem', textTransform: 'capitalize' }}
                    onClick={() => setFilterActivite(v)}>
                    {v === 'toutes' ? 'Toutes' : v === 'actif' ? 'Actif' : 'Inactif'}
                  </button>
                ))}
              </div>
              <button className="btn btn-ael btn-sm ms-auto" onClick={openCreate}>
                <i className="bi bi-plus-lg me-1"></i>Ajouter un moniteur
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5 text-muted">
                <div className="spinner-border spinner-border-sm me-2"></div>Chargement...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 text-muted">Aucun moniteur trouvé.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Moniteur</th>
                      <th>Naissance</th>
                      <th>Embauche</th>
                      <th>Activité</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(m => (
                      <tr key={m.idMoniteur}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="user-badge" style={{ width: 30, height: 30, fontSize: '0.65rem' }}>
                              {m.nomMoniteur?.[0]}{m.prenomMoniteur?.[0]}
                            </div>
                            <span className="fw-semibold">{m.prenomMoniteur} {m.nomMoniteur}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.875rem' }}>{formatDate(m.dateNaissance)}</td>
                        <td style={{ fontSize: '0.875rem' }}>{formatDate(m.dateEmbauche)}</td>
                        <td>
                          <span className={m.activite ? 'badge-actif' : 'badge-inactif'}>
                            ● {m.activite ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-1 justify-content-end">
                            <button className="btn btn-sm btn-outline-secondary" style={{ fontSize: '0.75rem' }}
                              onClick={() => openEdit(m)}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className={`btn btn-sm ${m.activite ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => toggleActivite(m)}>
                              {m.activite ? 'Désactiver' : 'Activer'}
                            </button>
                            <button className="btn btn-sm btn-outline-danger" style={{ fontSize: '0.75rem' }}
                              onClick={() => handleDelete(m.idMoniteur)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <div className="col-lg-5">
            <div className="card">
              <div className="card-header bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
                <div className="fw-bold">{editId ? 'Modifier un moniteur' : 'Ajouter un moniteur'}</div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="card-body p-4">
                {formError && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.875rem' }}>{formError}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Nom *</label>
                    <input className="form-control" value={form.nomMoniteur}
                      onChange={e => setForm({ ...form, nomMoniteur: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Prénom *</label>
                    <input className="form-control" value={form.prenomMoniteur}
                      onChange={e => setForm({ ...form, prenomMoniteur: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Date de naissance *</label>
                    <input type="date" className="form-control" value={form.dateNaissance}
                      onChange={e => setForm({ ...form, dateNaissance: e.target.value })} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Date d'embauche *</label>
                    <input type="date" className="form-control" value={form.dateEmbauche}
                      onChange={e => setForm({ ...form, dateEmbauche: e.target.value })} required />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-ael flex-grow-1" disabled={saving}>
                      {saving && <span className="spinner-border spinner-border-sm me-2"></span>}
                      Enregistrer
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
