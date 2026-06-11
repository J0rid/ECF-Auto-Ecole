import api from './api'

const epreuveService = {
  getByEleve: (eleveId) => api.get(`/Epreuve/eleve/${eleveId}`).then(r => r.data),
  create: (data) => api.post('/Epreuve', data).then(r => r.data),
}

export default epreuveService
