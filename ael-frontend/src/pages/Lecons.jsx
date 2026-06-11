import { useEffect, useState } from 'react'
import api from '../services/api'
import leconService from '../services/leconService'
import eleveService from '../services/eleveService'
import moniteurService from '../services/moniteurService'
import modeleService from '../services/modeleService'

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MOIS  = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

function getDateCle(dateStr) {
  return dateStr.substring(0, 10)
}

function getHeure(dateStr) {
  return dateStr.substring(11, 16)
}

function deuxChiffres(n) {
  if (n < 10) return '0' + n
  return '' + n
}

function premierJourDuMois(annee, mois) {
  const jour = new Date(annee, mois, 1).getDay()
  if (jour === 0) return 6
  return jour - 1
}

function nbJoursDansMois(annee, mois) {
  return new Date(annee, mois + 1, 0).getDate()
}

export default function Lecons() {
  const maintenant = new Date()

  const [annee, setAnnee]   = useState(maintenant.getFullYear())
  const [mois, setMois]     = useState(maintenant.getMonth())

  const [creneaux, setCreneaux]   = useState([])
  const [eleves, setEleves]       = useState([])
  const [moniteurs, setMoniteurs] = useState([])
  const [modeles, setModeles]     = useState([])

  const [jourSelectionne, setJourSelectionne] = useState(null)
  const [creneauSelectionne, setCreneauSelectionne] = useState(null)

  const [eleveId, setEleveId]         = useState('')
  const [moniteurId, setMoniteurId]   = useState('')
  const [modeleLecon, setModeleLecon] = useState('')
  const [duree, setDuree]             = useState(60)

  const [enregistrement, setEnregistrement] = useState(false)
  const [erreur, setErreur]     = useState('')
  const [succes, setSucces]     = useState('')
  const [erreurCharg, setErreurCharg] = useState('')

  const [afficherAjout, setAfficherAjout] = useState(false)
  const [dateAjout, setDateAjout]         = useState('')
  const [heureAjout, setHeureAjout]       = useState('')
  const [ajoutEnCours, setAjoutEnCours]   = useState(false)
  const [erreurAjout, setErreurAjout]     = useState('')
  const [succesAjout, setSuccesAjout]     = useState('')

  useEffect(() => {
    chargerCreneaux()
    eleveService.getAll().then(setEleves).catch(() => setErreurCharg('Erreur chargement élèves.'))
    moniteurService.getAll().then(liste => {
      const actifsSeuls = liste.filter(m => m.activite === true)
      setMoniteurs(actifsSeuls)
    }).catch(() => setErreurCharg('Erreur chargement moniteurs.'))
    modeleService.getAll().then(setModeles).catch(() => setErreurCharg('Erreur chargement modèles.'))
  }, [])

  function chargerCreneaux() {
    leconService.getCalendrier()
      .then(liste => setCreneaux(liste))
      .catch(() => {})
  }

  function getCreneauxParJour() {
    const resultat = {}
    for (let c of creneaux) {
      const cle = getDateCle(c.dateHeure)
      if (!resultat[cle]) {
        resultat[cle] = []
      }
      resultat[cle].push(c.dateHeure)
    }
    return resultat
  }

  const creneauxParJour = getCreneauxParJour()

  function cleDuJour(jour) {
    return annee + '-' + deuxChiffres(mois + 1) + '-' + deuxChiffres(jour)
  }

  function moisPrecedent() {
    if (mois === 0) { setAnnee(annee - 1); setMois(11) }
    else setMois(mois - 1)
    reinitialiserSelection()
  }

  function moisSuivant() {
    if (mois === 11) { setAnnee(annee + 1); setMois(0) }
    else setMois(mois + 1)
    reinitialiserSelection()
  }

  function reinitialiserSelection() {
    setJourSelectionne(null)
    setCreneauSelectionne(null)
    setErreur('')
  }

  function handleClicJour(jour) {
    const cle = cleDuJour(jour)
    if (!creneauxParJour[cle] || creneauxParJour[cle].length === 0) return
    setJourSelectionne(jour)
    setCreneauSelectionne(null)
    setEleveId(''); setMoniteurId(''); setModeleLecon(''); setDuree(60)
    setErreur(''); setSucces('')
  }

  function handleClicCreneau(creneauStr) {
    setCreneauSelectionne(creneauStr)
    setErreur('')
  }

  const creneauxDuJour = jourSelectionne ? (creneauxParJour[cleDuJour(jourSelectionne)] || []) : []

  async function handleReserver(e) {
    e.preventDefault()
    setEnregistrement(true)
    setErreur('')
    try {
      await leconService.reserver({
        modeleLecon: modeleLecon,
        dateHLecon:  creneauSelectionne,
        eleveId:     parseInt(eleveId),
        moniteurId:  parseInt(moniteurId),
        duree:       parseInt(duree),
      })
      setSucces('Leçon réservée avec succès !')
      setEleveId(''); setMoniteurId(''); setModeleLecon(''); setDuree(60)
      setCreneauSelectionne(null)
      setJourSelectionne(null)
      chargerCreneaux()
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErreur(err.response.data.message)
      } else {
        setErreur('Erreur lors de la réservation.')
      }
    }
    setEnregistrement(false)
  }

  async function handleAjouterCreneau(e) {
    e.preventDefault()
    setAjoutEnCours(true)
    setErreurAjout('')
    setSuccesAjout('')
    const dateHeure = dateAjout + 'T' + heureAjout + ':00'
    try {
      await api.post('/Calendrier', { dateHeure: dateHeure })
      setSuccesAjout('Créneau ajouté : ' + dateAjout + ' à ' + heureAjout)
      setDateAjout('')
      setHeureAjout('')
      chargerCreneaux()
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErreurAjout(err.response.data.message)
      } else {
        setErreurAjout('Impossible d\'ajouter ce créneau.')
      }
    }
    setAjoutEnCours(false)
  }

  const nbJours      = nbJoursDansMois(annee, mois)
  const decalageDebut = premierJourDuMois(annee, mois)
  const cleCeJour    = annee + '-' + deuxChiffres(maintenant.getMonth() + 1) + '-' + deuxChiffres(maintenant.getDate())

  const cellulesVides = []
  for (let i = 0; i < decalageDebut; i++) {
    cellulesVides.push(i)
  }

  const jours = []
  for (let d = 1; d <= nbJours; d++) {
    jours.push(d)
  }

  const totalCellules = decalageDebut + nbJours
  const cellulesFinales = []
  const nbCellulesFinales = (7 - (totalCellules % 7)) % 7
  for (let i = 0; i < nbCellulesFinales; i++) {
    cellulesFinales.push(i)
  }

  return (
    <div>
      <div className="page-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-1">
            <li className="breadcrumb-item text-muted">Accueil</li>
            <li className="breadcrumb-item active">Leçons</li>
          </ol>
        </nav>
        <h1>Calendrier &amp; réservation</h1>
        <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
          Sélectionnez un jour disponible, puis un créneau horaire pour réserver une leçon.
        </p>
      </div>

      {erreurCharg && <div className="alert alert-danger">{erreurCharg}</div>}
      {succes && (
        <div className="alert alert-success alert-dismissible">
          {succes}
          <button type="button" className="btn-close" onClick={() => setSucces('')}></button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-7">

          <div className="card mb-3">
            <div className="card-header bg-white py-3 px-4 border-bottom d-flex align-items-center justify-content-between">
              <button className="btn btn-sm btn-outline-secondary" onClick={moisPrecedent}>‹</button>
              <span className="fw-bold">{MOIS[mois]} {annee}</span>
              <button className="btn btn-sm btn-outline-secondary" onClick={moisSuivant}>›</button>
            </div>

            <div className="p-3">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
                {JOURS.map(j => (
                  <div key={j} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#aaa', padding: '4px 0' }}>
                    {j}
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>

                {cellulesVides.map(i => (
                  <div key={'debut-' + i} />
                ))}

                {jours.map(jour => {
                  const cle      = cleDuJour(jour)
                  const slots    = creneauxParJour[cle] || []
                  const aDesSlots = slots.length > 0
                  const estSelectionne = jourSelectionne === jour
                  const estAujourdHui  = cle === cleCeJour

                  let fond    = 'transparent'
                  let bordure = 'none'
                  let couleur = '#bbb'

                  if (estSelectionne) {
                    fond = '#D32F2F'; bordure = '2px solid #D32F2F'; couleur = '#fff'
                  } else if (estAujourdHui) {
                    fond = '#fff3f3'; bordure = '1.5px solid #D32F2F'; couleur = '#333'
                  } else if (aDesSlots) {
                    fond = '#f0fdf4'; bordure = '1px solid #bbf7d0'; couleur = '#333'
                  }

                  return (
                    <div
                      key={jour}
                      onClick={() => handleClicJour(jour)}
                      style={{
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 8,
                        cursor: aDesSlots ? 'pointer' : 'default',
                        background: fond,
                        border: bordure,
                        fontSize: '0.85rem',
                        fontWeight: estAujourdHui ? 700 : 400,
                        color: couleur,
                        userSelect: 'none',
                      }}
                    >
                      <span>{jour}</span>
                      {aDesSlots && (
                        <span style={{ fontSize: '0.58rem', lineHeight: 1, color: estSelectionne ? 'rgba(255,255,255,0.85)' : '#16a34a' }}>
                          {slots.length} crén.
                        </span>
                      )}
                    </div>
                  )
                })}

                {cellulesFinales.map(i => (
                  <div key={'fin-' + i} />
                ))}
              </div>
            </div>

            <div className="px-4 pb-3 d-flex gap-3" style={{ fontSize: '0.72rem', color: '#888' }}>
              <span>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#f0fdf4', border: '1px solid #bbf7d0', marginRight: 4 }}></span>
                Créneaux disponibles
              </span>
              <span>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#D32F2F', marginRight: 4 }}></span>
                Sélectionné
              </span>
            </div>
          </div>

          <div className="card">
            <div
              className="card-header bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => { setAfficherAjout(!afficherAjout); setErreurAjout(''); setSuccesAjout('') }}
            >
              <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>
                <i className="bi bi-calendar-plus me-2 text-muted"></i>Ajouter des créneaux au calendrier
              </div>
              <i className={`bi bi-chevron-${afficherAjout ? 'up' : 'down'} text-muted`}></i>
            </div>

            {afficherAjout && (
              <div className="card-body p-4">
                {erreurAjout  && <div className="alert alert-danger py-2 mb-3"  style={{ fontSize: '0.875rem' }}>{erreurAjout}</div>}
                {succesAjout  && <div className="alert alert-success py-2 mb-3" style={{ fontSize: '0.875rem' }}>{succesAjout}</div>}
                <form onSubmit={handleAjouterCreneau}>
                  <div className="row g-3 align-items-end">
                    <div className="col-md-5">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dateAjout}
                        onChange={e => setDateAjout(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Heure *</label>
                      <input
                        type="time"
                        className="form-control"
                        value={heureAjout}
                        onChange={e => setHeureAjout(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <button type="submit" className="btn btn-ael w-100" disabled={ajoutEnCours}>
                        {ajoutEnCours
                          ? <span className="spinner-border spinner-border-sm me-1"></span>
                          : <i className="bi bi-plus-lg me-1"></i>
                        }
                        Ajouter
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card">
            <div className="card-header bg-white py-3 px-4 border-bottom">
              <div className="fw-bold">
                <i className="bi bi-plus-circle me-2 text-muted"></i>Réserver une leçon
              </div>
              {jourSelectionne && (
                <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                  {jourSelectionne} {MOIS[mois]} {annee}
                </div>
              )}
            </div>

            <div className="card-body p-4">

              {!jourSelectionne && (
                <div className="text-center text-muted py-5" style={{ fontSize: '0.875rem' }}>
                  <i className="bi bi-calendar3 d-block mb-3" style={{ fontSize: '2.5rem', opacity: 0.2 }}></i>
                  Cliquez sur un jour disponible dans le calendrier.
                </div>
              )}

              {jourSelectionne && !creneauSelectionne && (
                <div>
                  <p className="fw-semibold mb-3" style={{ fontSize: '0.875rem' }}>
                    Choisissez un créneau horaire :
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {creneauxDuJour.map((str, index) => (
                      <button
                        key={index}
                        type="button"
                        className="btn btn-outline-secondary"
                        style={{ fontSize: '0.875rem', minWidth: 72 }}
                        onClick={() => handleClicCreneau(str)}
                      >
                        {getHeure(str)}
                      </button>
                    ))}
                  </div>
                  <button
                    className="btn btn-link text-muted p-0 mt-3"
                    style={{ fontSize: '0.78rem' }}
                    onClick={reinitialiserSelection}
                  >
                    ← Changer de jour
                  </button>
                </div>
              )}

              {jourSelectionne && creneauSelectionne && (
                <div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge rounded-pill" style={{ background: '#D32F2F', fontSize: '0.8rem', padding: '6px 12px' }}>
                      {jourSelectionne} {MOIS[mois]} à {getHeure(creneauSelectionne)}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setCreneauSelectionne(null)}
                    >
                      Changer
                    </button>
                  </div>

                  {erreur && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.875rem' }}>{erreur}</div>}

                  <form onSubmit={handleReserver}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Élève *</label>
                      <select
                        className="form-select"
                        value={eleveId}
                        onChange={e => setEleveId(e.target.value)}
                        required
                      >
                        <option value="">— Sélectionner —</option>
                        {eleves.map(e => (
                          <option key={e.idEleve} value={e.idEleve}>
                            {e.prenomEleve} {e.nomEleve}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>
                        Moniteur * <span className="text-muted fw-normal" style={{ fontSize: '0.78rem' }}>(actifs uniquement)</span>
                      </label>
                      <select
                        className="form-select"
                        value={moniteurId}
                        onChange={e => setMoniteurId(e.target.value)}
                        required
                      >
                        <option value="">— Sélectionner —</option>
                        {moniteurs.map(m => (
                          <option key={m.idMoniteur} value={m.idMoniteur}>
                            {m.prenomMoniteur} {m.nomMoniteur}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>
                        Modèle de véhicule *
                      </label>
                      <select
                        className="form-select"
                        value={modeleLecon}
                        onChange={e => setModeleLecon(e.target.value)}
                        required
                      >
                        <option value="">— Sélectionner —</option>
                        {modeles.map(m => (
                          <option key={m.modeleVehicule} value={m.modeleVehicule}>
                            {m.modeleVehicule} — {m.marque}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>Durée *</label>
                      <select
                        className="form-select"
                        value={duree}
                        onChange={e => setDuree(e.target.value)}
                      >
                        <option value={30}>30 min</option>
                        <option value={60}>1h</option>
                        <option value={90}>1h30</option>
                        <option value={120}>2h</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-ael w-100" disabled={enregistrement}>
                      {enregistrement
                        ? <span className="spinner-border spinner-border-sm me-2"></span>
                        : <i className="bi bi-check2 me-2"></i>
                      }
                      Réserver la leçon
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
