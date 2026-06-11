import api from './api'

const statsService = {
  getTauxReussite: () => api.get('/Stats/taux-reussite').then(r => r.data),
  getEchecsMultiples: (seuil = 2) => api.get(`/Stats/echecs-multiples?seuil=${seuil}`).then(r => r.data),
}

export default statsService
