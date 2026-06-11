import { useEffect, useState } from 'react'
import vehiculeService from '../services/vehiculeService'
import modeleService from '../services/modeleService'
import { extractApiError } from '../utils/apiError'
import { useConfirm } from '../outils/ConfirmDialog'

const emptyForm = { noImmat: '', modeleVehicule: '', etat: true }

export default function Vehicules() {

  const [vehicules, setVehicules] = useState([])
  const [modeles, setModeles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterEtat, setFilterEtat] = useState('tous')

  const [showForm, setShowForm] = useState(false)
  const [editImmat, setEditImmat] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const confirm = useConfirm()

  async function load() {
    try {
      const listeVehicules = await vehiculeService.getAll()
      const listeModeles = await modeleService.getAll()
      setVehicules(listeVehicules)
      setModeles(listeModeles)
    } catch {
      setError('Erreur de chargement.')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = vehicules.filter(v => {
    const q = search.toLowerCase()
    const matchSearch = !q || v.noImmat?.toLowerCase().includes(q) || v.modeleVehicule?.toLowerCase().includes(q)
    const matchEtat = filterEtat === 'tous' || (filterEtat === 'dispo' ? v.etat : !v.etat)
    return matchSearch && matchEtat
  })

  const openCreate = () => { setEditImmat(null); setForm(emptyForm); setFormError(''); setShowForm(true) }
  const openEdit = (v) => {
    setEditImmat(v.noImmat)
    setForm({ noImmat: v.noImmat, modeleVehicule: v.modeleVehicule, etat: v.etat })
    setFormError('')
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      if (editImmat) await vehiculeService.update(editImmat, form)
      else await vehiculeService.create(form)
      setShowForm(false)
      load()
    } catch (err) {
      setFormError(extractApiError(err))
    }
    setSaving(false)
  }

  const toggleEtat = async (v) => {
    try {
      if (v.etat) await vehiculeService.desactiver(v.noImmat)
      else await vehiculeService.activer(v.noImmat)
      load()
    } catch { setError('Erreur lors du changement de statut.') }
  }

  const handleDelete = async (noImmat) => {
    const ok = await confirm('Supprimer ce véhicule ?', 'Supprimer un véhicule')
    if (!ok) return
    try {
      await vehiculeService.delete(noImmat)
      load()
    } catch { setError('Impossible de supprimer ce véhicule.') }
  }

  return (
    <div>
      <div className="page-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-1">
            <li className="breadcrumb-item text-muted">Accueil</li>
            <li className="breadcrumb-item active">Véhicules</li>
          </ol>
        </nav>
        <h1>Véhicules</h1>
        <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
          {vehicules.length} véhicule{vehicules.length > 1 ? 's' : ''} · {vehicules.filter(v => v.etat).length} disponibles.
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
                  placeholder="Immatriculation ou modèle..." value={search}
                  onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="d-flex gap-1">
                <button className={`btn btn-sm ${filterEtat === 'tous' ? 'btn-ael' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.78rem' }} onClick={() => setFilterEtat('tous')}>Tous</button>
                <button className={`btn btn-sm ${filterEtat === 'dispo' ? 'btn-ael' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.78rem' }} onClick={() => setFilterEtat('dispo')}>Disponible</button>
                <button className={`btn btn-sm ${filterEtat === 'indispo' ? 'btn-ael' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.78rem' }} onClick={() => setFilterEtat('indispo')}>Indisponible</button>
              </div>
              <button className="btn btn-ael btn-sm ms-auto" onClick={openCreate}>
                <i className="bi bi-plus-lg me-1"></i>Ajouter un véhicule
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5 text-muted">
                <div className="spinner-border spinner-border-sm me-2"></div>Chargement...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 text-muted">Aucun véhicule trouvé.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Immatriculation</th>
                      <th>Modèle</th>
                      <th>État</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(v => (
                      <tr key={v.noImmat}>
                        <td className="fw-semibold">{v.noImmat}</td>
                        <td style={{ fontSize: '0.875rem' }}>{v.modeleVehicule}</td>
                        <td>
                          <span className={v.etat ? 'badge-disponible' : 'badge-indisponible'}>
                            ● {v.etat ? 'Disponible' : 'Indisponible'}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-1 justify-content-end">
                            <button className="btn btn-sm btn-outline-secondary" style={{ fontSize: '0.75rem' }}
                              onClick={() => openEdit(v)}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className={`btn btn-sm ${v.etat ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => toggleEtat(v)}>
                              {v.etat ? 'Rendre indispo.' : 'Rendre dispo.'}
                            </button>
                            <button className="btn btn-sm btn-outline-danger" style={{ fontSize: '0.75rem' }}
                              onClick={() => handleDelete(v.noImmat)}>
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
                <div className="fw-bold">{editImmat ? 'Modifier un véhicule' : 'Ajouter un véhicule'}</div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowForm(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="card-body p-4">
                {formError && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.875rem' }}>{formError}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Immatriculation *</label>
                    <input className="form-control" value={form.noImmat}
                      onChange={e => setForm({ ...form, noImmat: e.target.value })}
                      disabled={!!editImmat} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Modèle *</label>
                    <select className="form-select" value={form.modeleVehicule}
                      onChange={e => setForm({ ...form, modeleVehicule: e.target.value })} required>
                      <option value="">— Sélectionner un modèle —</option>
                      {modeles.map(m => (
                        <option key={m.modeleVehicule} value={m.modeleVehicule}>{m.modeleVehicule} ({m.marque})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4 d-flex align-items-center gap-3">
                    <label className="form-label fw-semibold mb-0" style={{ fontSize: '0.875rem' }}>État</label>
                    <div className="form-check form-switch mb-0">
                      <input className="form-check-input" type="checkbox" checked={form.etat}
                        onChange={e => setForm({ ...form, etat: e.target.checked })} />
                    </div>
                    <span className={form.etat ? 'badge-disponible' : 'badge-indisponible'}>
                      {form.etat ? 'Disponible' : 'Indisponible'}
                    </span>
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
