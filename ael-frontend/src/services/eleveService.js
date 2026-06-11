import api from './api'

const eleveService = {
  getAll: () => api.get('/Eleve').then(r => r.data),
  getById: (id) => api.get(`/Eleve/${id}`).then(r => r.data),
  create: (data) => api.post('/Eleve', data).then(r => r.data),
  update: (id, data) => api.put(`/Eleve/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/Eleve/${id}`),
}

export default eleveService
