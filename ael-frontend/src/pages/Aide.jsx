import { Link } from 'react-router-dom'

const sections = [
  {
    icon: 'bi-person-plus',
    titre: 'Inscrire un élève',
    texte: 'Rendez-vous dans la section Élèves et cliquez sur « Inscrire un élève ». Renseignez le nom, prénom et date de naissance (minimum 16 ans). La date d\'inscription et les statuts Code/Conduite sont gérés automatiquement.',
  },
  {
    icon: 'bi-calendar3',
    titre: 'Réserver une leçon',
    texte: 'Dans la section Leçons, cliquez sur un jour du calendrier ayant des créneaux disponibles. Sélectionnez l\'élève, le moniteur, le modèle de véhicule, le créneau horaire et la durée, puis confirmez.',
  },
  {
    icon: 'bi-clipboard2-check',
    titre: 'Enregistrer une épreuve',
    texte: 'Ouvrez la fiche d\'un élève (section Élèves > Ouvrir). Dans la section Épreuves, sélectionnez le type (Code ou Conduite), la date (postérieure à l\'inscription) et le résultat. En cas de réussite, le statut Code ou Conduite de l\'élève est mis à jour automatiquement.',
  },
  {
    icon: 'bi-speedometer2',
    titre: 'Tableau de bord',
    texte: 'Le tableau de bord affiche le taux de réussite global et par type d\'épreuve pour l\'année en cours, ainsi que la liste des élèves ayant échoué 2 fois ou plus.',
  },
  {
    icon: 'bi-person-badge',
    titre: 'Gérer les moniteurs',
    texte: 'Dans la section Moniteurs, vous pouvez ajouter, modifier, activer ou désactiver un moniteur. Seuls les moniteurs actifs apparaissent dans le formulaire de réservation de leçon.',
  },
  {
    icon: 'bi-car-front',
    titre: 'Gérer les véhicules et modèles',
    texte: 'Dans Véhicules, gérez le parc avec immatriculation, modèle et état (Disponible/Indisponible). Dans Modèles, référencez les modèles de véhicules. Un modèle ne peut pas être supprimé s\'il possède des véhicules rattachés.',
  },
]

export default function Aide() {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f5f6fa' }}>
      <div className="d-flex align-items-center gap-2 px-4 py-3" style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <span className="ael-badge">AEL</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Auto-École du Lycée</span>
      </div>

      <div className="flex-grow-1 py-5 px-4" style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <Link to="/dashboard" className="text-muted text-decoration-none d-flex align-items-center gap-1 mb-4" style={{ fontSize: '0.875rem' }}>
          <i className="bi bi-arrow-left"></i> Retour au tableau de bord
        </Link>

        <h1 className="fw-bold mb-2" style={{ fontSize: '1.5rem' }}>Aide</h1>
        <p className="text-muted mb-5" style={{ fontSize: '0.875rem' }}>Guide d'utilisation de l'espace secrétariat AEL.</p>

        <div className="row g-3">
          {sections.map((s, i) => (
            <div key={i} className="col-md-6">
              <div className="card p-4 h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className={`bi ${s.icon}`} style={{ fontSize: '1.2rem', color: '#D32F2F' }}></i>
                  <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{s.titre}</div>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>{s.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center py-3 text-muted" style={{ fontSize: '0.75rem', borderTop: '1px solid #e5e7eb', background: '#fff' }}>
        © 2025 Auto-École du Lycée — Tous droits réservés. &nbsp;v1.0
      </footer>
    </div>
  )
}
