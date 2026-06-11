import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import eleveService from '../services/eleveService'
import leconService from '../services/leconService'
import epreuveService from '../services/epreuveService'
import { extractApiError } from '../utils/apiError'
import { useConfirm } from '../outils/ConfirmDialog'

const today = new Date().toISOString().split('T')[0]

function getMaxBirth() {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 16)
  return d.toISOString().split('T')[0]
}

const maxBirth = getMaxBirth()

const emptyCreate = { nomEleve: '', prenomEleve: '', dateNaissance: '' }
const emptyEdit   = { nomEleve: '', prenomEleve: '', dateNaissance: '', dateInscription: '', code: false, conduite: false }
const emptyEpreuve = { typeEpreuve: 'Code', dateEpreuve: '', resultat: false }

export default function FicheEleve() {
  const { id } = useParams()
  const isNew = id === 'nouveau'
  const navigate = useNavigate()

  const confirm = useConfirm()

  const [form, setForm] = useState(isNew ? emptyCreate : emptyEdit)
  const [lecons, setLecons] = useState([])
  const [epreuves, setEpreuves] = useState([])
  const [epreuveForm, setEpreuveForm] = useState(emptyEpreuve)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [addingEpreuve, setAddingEpreuve] = useState(false)
  const [error, setError] = useState('')
  const [epreuveError, setEpreuveError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isNew) return
    async function charger() {
      try {
        const eleve = await eleveService.getById(id)
        const listeLecons = await leconService.getByEleve(id)
        const listeEpreuves = await epreuveService.getByEleve(id)
        setForm({
          nomEleve: eleve.nomEleve,
          prenomEleve: eleve.prenomEleve,
          dateNaissance: eleve.dateNaissance,
          dateInscription: eleve.dateInscription,
          code: eleve.code,
          conduite: eleve.conduite,
        })
        setLecons(listeLecons)
        setEpreuves(listeEpreuves)
      } catch {
        setError('Élève introuvable.')
      }
      setLoading(false)
    }
    charger()
  }, [id, isNew])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isNew && form.dateNaissance > maxBirth) {
      setError("L'élève doit avoir au moins 16 ans.")
      return
    }
    setSaving(true)
    setError('')
    try {
      if (isNew) {
        await eleveService.create(form)
        navigate('/eleves')
      } else {
        await eleveService.update(id, form)
        setSuccess('Modifications enregistrées.')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(extractApiError(err, "Erreur lors de l'enregistrement."))
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    const lines = [
      `Supprimer définitivement la fiche de ${form.prenomEleve} ${form.nomEleve} ?`,
      '',
    ]

    const details = []
    if (epreuves.length > 0)
      details.push(`• ${epreuves.length} épreuve${epreuves.length > 1 ? 's' : ''} enregistrée${epreuves.length > 1 ? 's' : ''}`)
    if (lecons.length > 0)
      details.push(`• ${lecons.length} leçon${lecons.length > 1 ? 's' : ''} réservée${lecons.length > 1 ? 's' : ''}`)

    if (details.length > 0) {
      lines.push('Les données associées seront également supprimées :')
      details.forEach(d => lines.push(d))
      lines.push('')
      lines.push("Conformément au RGPD (droit à l'effacement), toutes les données personnelles de cet élève seront définitivement effacées.")
    } else {
      lines.push('Cette action est irréversible.')
    }

    const ok = await confirm(lines.join('\n'), 'Supprimer un élève')
    if (!ok) return
    try {
      await eleveService.delete(id)
      navigate('/eleves')
    } catch (err) {
      setError(extractApiError(err, 'Impossible de supprimer cet élève.'))
    }
  }

  const handleAddEpreuve = async (e) => {
    e.preventDefault()
    if (epreuveForm.dateEpreuve < form.dateInscription) {
      setEpreuveError("La date de l'épreuve ne peut pas être antérieure à la date d'inscription.")
      return
    }
    if (epreuveForm.dateEpreuve > today) {
      setEpreuveError("La date de l'épreuve ne peut pas être dans le futur.")
      return
    }
    setEpreuveError('')
    setAddingEpreuve(true)
    try {
      await epreuveService.create({
        eleveIdEpreuve: parseInt(id),
        typeEpreuve: epreuveForm.typeEpreuve,
        dateEpreuve: epreuveForm.dateEpreuve,
        resultat: epreuveForm.resultat,
      })
      const listeEpreuves = await epreuveService.getByEleve(id)
      const eleveMAJ = await eleveService.getById(id)
      setEpreuves(listeEpreuves)
      setForm({ ...form, code: eleveMAJ.code, conduite: eleveMAJ.conduite })
      setEpreuveForm(emptyEpreuve)
    } catch (err) {
      setEpreuveError(err.response?.data?.message || "Erreur lors de l'ajout.")
    }
    setAddingEpreuve(false)
  }

  function formatDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('fr-FR')
  }

  function formatDateTime(d) {
    if (!d) return '—'
    return new Date(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
  }

  if (loading) return (
    <div className="text-center py-5 text-muted">
      <div className="spinner-border spinner-border-sm me-2"></div>Chargement...
    </div>
  )

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item"><Link to="/eleves" className="text-muted text-decoration-none">Élèves</Link></li>
              <li className="breadcrumb-item active">
                {isNew ? 'Nouvel élève' : `${form.prenomEleve} ${form.nomEleve}`}
              </li>
            </ol>
          </nav>
          <h1>{isNew ? 'Inscrire un élève' : 'Fiche élève'}</h1>
          <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
            {isNew ? "Création d'une nouvelle fiche élève." : "Création, édition, leçons et épreuves de l'élève."}
          </p>
        </div>
        <div className="d-flex gap-2">
          {!isNew && (
            <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
              <i className="bi bi-trash me-1"></i>Supprimer
            </button>
          )}
          <Link to="/eleves" className="btn btn-outline-secondary">Annuler</Link>
          <button className="btn btn-ael" form="fiche-form" type="submit" disabled={saving}>
            {saving && <span className="spinner-border spinner-border-sm me-2"></span>}
            <i className="bi bi-check2 me-1"></i>Enregistrer
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card mb-4">
        <div className="card-header bg-white py-3 px-4 border-bottom">
          <div className="fw-bold"><i className="bi bi-info-circle me-2 text-muted"></i>Informations de l'élève</div>
        </div>
        <div className="card-body p-4">
          <form id="fiche-form" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Nom *</label>
                <input className="form-control" value={form.nomEleve} onChange={e => setForm({ ...form, nomEleve: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Prénom *</label>
                <input className="form-control" value={form.prenomEleve} onChange={e => setForm({ ...form, prenomEleve: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>
                  Date de naissance * <span className="text-muted fw-normal">(minimum 16 ans)</span>
                </label>
                <input type="date" className="form-control" value={form.dateNaissance}
                  max={maxBirth} onChange={e => setForm({ ...form, dateNaissance: e.target.value })} required />
              </div>

              {isNew ? (
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Date d'inscription</label>
                  <input type="date" className="form-control" value={today} disabled />
                  <div className="form-text">Automatiquement définie à aujourd'hui.</div>
                </div>
              ) : (
                <>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Date d'inscription</label>
                    <input type="date" className="form-control" value={form.dateInscription} disabled />
                    <div className="form-text">Non modifiable après inscription.</div>
                  </div>
                  <div className="col-md-3 d-flex align-items-center gap-3 pt-2">
                    <label className="form-label fw-semibold mb-0" style={{ fontSize: '0.875rem' }}>Code</label>
                    <div className="form-check form-switch mb-0">
                      <input className="form-check-input" type="checkbox" checked={form.code} onChange={e => setForm({ ...form, code: e.target.checked })} />
                    </div>
                    <span className={form.code ? 'badge-oui' : 'badge-non'}>
                      {form.code ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="col-md-3 d-flex align-items-center gap-3 pt-2">
                    <label className="form-label fw-semibold mb-0" style={{ fontSize: '0.875rem' }}>Conduite</label>
                    <div className="form-check form-switch mb-0">
                      <input className="form-check-input" type="checkbox" checked={form.conduite} onChange={e => setForm({ ...form, conduite: e.target.checked })} />
                    </div>
                    <span className={form.conduite ? 'badge-oui' : 'badge-non'}>
                      {form.conduite ? 'Oui' : 'Non'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {isNew && (
              <div className="alert alert-info mt-3 mb-0" style={{ fontSize: '0.875rem' }}>
                <i className="bi bi-info-circle me-2"></i>
                Code et Conduite sont automatiquement à <strong>Non</strong> à l'inscription. Ils passent à <strong>Oui</strong> après réussite des épreuves correspondantes.
              </div>
            )}
          </form>
        </div>
      </div>

      {!isNew && (
        <>
          <div className="card mb-4">
            <div className="card-header bg-white py-3 px-4 border-bottom">
              <div className="fw-bold">Leçons de l'élève</div>
              <div className="text-muted" style={{ fontSize: '0.78rem' }}>Historique des leçons réservées</div>
            </div>
            {lecons.length === 0 ? (
              <div className="text-center py-4 text-muted" style={{ fontSize: '0.875rem' }}>Aucune leçon réservée.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr><th>Date et heure</th><th>Modèle</th><th>Moniteur</th><th>Durée</th></tr>
                  </thead>
                  <tbody>
                    {lecons.map((l, i) => (
                      <tr key={i}>
                        <td>{formatDateTime(l.dateHLecon)}</td>
                        <td>{l.modeleLecon}</td>
                        <td>{l.prenomMoniteur} {l.nomMoniteur}</td>
                        <td>{l.duree} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header bg-white py-3 px-4 border-bottom">
              <div className="fw-bold">Épreuves</div>
            </div>

            <div className="p-4 border-bottom" style={{ background: '#fafafa' }}>
              <div className="fw-semibold mb-3" style={{ fontSize: '0.875rem' }}>
                <i className="bi bi-plus-circle me-2 text-muted"></i>Ajouter une épreuve
              </div>
              {epreuveError && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.875rem' }}>{epreuveError}</div>}
              <form onSubmit={handleAddEpreuve}>
                <div className="row g-3 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>Type</label>
                    <select className="form-select form-select-sm" value={epreuveForm.typeEpreuve}
                      onChange={e => setEpreuveForm({ ...epreuveForm, typeEpreuve: e.target.value })}>
                      <option value="Code">Code</option>
                      <option value="Conduite">Conduite</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>
                      Date <span className="text-muted fw-normal">(après inscription)</span>
                    </label>
                    <input type="date" className="form-control form-control-sm"
                      value={epreuveForm.dateEpreuve}
                      min={form.dateInscription} max={today}
                      onChange={e => setEpreuveForm({ ...epreuveForm, dateEpreuve: e.target.value })}
                      required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>Résultat</label>
                    <select className="form-select form-select-sm" value={String(epreuveForm.resultat)}
                      onChange={e => setEpreuveForm({ ...epreuveForm, resultat: e.target.value === 'true' })}>
                      <option value="false">Échoué</option>
                      <option value="true">Réussi</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <button type="submit" className="btn btn-ael btn-sm w-100" disabled={addingEpreuve}>
                      {addingEpreuve && <span className="spinner-border spinner-border-sm me-2"></span>}
                      + Ajouter
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {epreuves.length === 0 ? (
              <div className="text-center py-4 text-muted" style={{ fontSize: '0.875rem' }}>Aucune épreuve enregistrée.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr><th>Type</th><th>Date</th><th>Résultat</th></tr>
                  </thead>
                  <tbody>
                    {epreuves.map(ep => (
                      <tr key={ep.idEpreuve}>
                        <td>{ep.typeEpreuve}</td>
                        <td>{formatDate(ep.dateEpreuve)}</td>
                        <td>
                          <span className={ep.resultat ? 'badge-oui' : 'badge-non'}>
                            ● {ep.resultat ? 'Réussi' : 'Échoué'}
                          </span>
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
