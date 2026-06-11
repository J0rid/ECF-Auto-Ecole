import { useEffect, useState } from 'react'
import modeleService from '../services/modeleService'
import { extractApiError } from '../utils/apiError'
import { useConfirm } from '../outils/ConfirmDialog'

const emptyForm = { modeleVehicule: '', marque: '', annee: '', dateAchat: '' }

export default function Modeles() {

  const [modeles, setModeles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const confirm = useConfirm()

  const load = () => modeleService.getAll().then(setModeles)
    .catch(() => setError('Erreur de chargement.'))
    .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const filtered = modeles.filter(m => {
    const q = search.toLowerCase()
    return !q || m.modeleVehicule?.toLowerCase().includes(q) || m.marque?.toLowerCase().includes(q)
  })

  const openCreate = () => { setForm(emptyForm); setFormError(''); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      await modeleService.create(form)
      setShowForm(false)
      load()
    } catch (err) {
      setFormError(extractApiError(err))
    }
    setSaving(false)
  }

  const handleDelete = async (modeleVehicule) => {
    const ok = await confirm(`Supprimer le modèle "${modeleVehicule}" ?\n\nAttention : si des véhicules sont rattachés à ce modèle, la suppression sera refusée.`, 'Supprimer un modèle')
    if (!ok) return
    try {
      await modeleService.delete(modeleVehicule)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de supprimer ce modèle (véhicules rattachés ?).')
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'

  return (
    <div>
      <div className="page-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-1">
            <li className="breadcrumb-item text-muted">Accueil</li>
            <li className="breadcrumb-item active">Modèles</li>
          </ol>
        </nav>
        <h1>Modèles de véhicules</h1>
        <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
          {modeles.length} modèle{modeles.length > 1 ? 's' : ''} référencés.
        </p>
      </div>

      {error && <div className="alert alert-danger alert-dismissible">
        {error}
        <button type="button" className="btn-close" onClick={() => setError('')}></button>
      </div>}

      <div className="row g-4">
        <div className={showForm ? 'col-lg-7' : 'col-12'}>
          <div className="card">
            <div className="p-3 border-bottom d-flex flex-wrap gap-2 align-items-center">
              <div className="input-group" style={{ maxWidth: 260 }}>
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input type="text" className="form-control border-start-0 ps-0"
                  placeholder="Modèle ou marque..." value={search}
                  onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-ael btn-sm ms-auto" onClick={openCreate}>
                <i className="bi bi-plus-lg me-1"></i>Ajouter un modèle
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5 text-muted">
                <div className="spinner-border spinner-border-sm me-2"></div>Chargement...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 text-muted">Aucun modèle trouvé.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Modèle</th>
                      <th>Marque</th>
                      <th>Année</th>
                      <th>Date d'achat</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(m => (
                      <tr key={m.modeleVehicule}>
                        <td className="fw-semibold">{m.modeleVehicule}</td>
                        <td style={{ fontSize: '0.875rem' }}>{m.marque}</td>
                        <td style={{ fontSize: '0.875rem' }}>{m.annee}</td>
                        <td style={{ fontSize: '0.875rem' }}>{formatDate(m.dateAchat)}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-danger" style={{ fontSize: '0.75rem' }}
                            onClick={() => handleDelete(m.modeleVehicule)}>
                            <i className="bi bi-trash"></i>
                          </button>
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
                <div className="fw-bold">Ajouter un modèle</div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="card-body p-4">
                {formError && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.875rem' }}>{formError}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Modèle *</label>
                    <input className="form-control" placeholder="ex : Clio V"
                      value={form.modeleVehicule}
                      onChange={e => setForm({ ...form, modeleVehicule: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Marque *</label>
                    <input className="form-control" placeholder="ex : Renault"
                      value={form.marque}
                      onChange={e => setForm({ ...form, marque: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Année *</label>
                    <input className="form-control" placeholder="ex : 2021" maxLength={4}
                      value={form.annee}
                      onChange={e => setForm({ ...form, annee: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Date d'achat *</label>
                    <input type="date" className="form-control" value={form.dateAchat}
                      onChange={e => setForm({ ...form, dateAchat: e.target.value })} required />
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
