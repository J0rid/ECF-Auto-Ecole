import api from './api'

const leconService = {
  getAll: () => api.get('/Lecon').then(r => r.data),
  getByEleve: (eleveId) => api.get(`/Lecon/eleve/${eleveId}`).then(r => r.data),
  reserver: (lecon) => api.post('/Lecon', lecon).then(r => r.data),
  annuler: (lecon) => api.delete('/Lecon', { data: lecon }),
  getCalendrier: () => api.get('/Calendrier').then(r => r.data),
}

export default leconService
