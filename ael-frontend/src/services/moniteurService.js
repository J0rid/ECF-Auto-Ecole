import api from './api'

const moniteurService = {
  getAll: () => api.get('/Moniteur').then(r => r.data),
  getById: (id) => api.get(`/Moniteur/${id}`).then(r => r.data),
  create: (data) => api.post('/Moniteur', data).then(r => r.data),
  update: (id, data) => api.put(`/Moniteur/${id}`, data).then(r => r.data),
  activer: (id) => api.patch(`/Moniteur/${id}/activer`).then(r => r.data),
  desactiver: (id) => api.patch(`/Moniteur/${id}/desactiver`).then(r => r.data),
  delete: (id) => api.delete(`/Moniteur/${id}`),
}

export default moniteurService
