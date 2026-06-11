import api from './api'

const modeleService = {
  getAll: () => api.get('/Modele').then(r => r.data),
  getById: (id) => api.get(`/Modele/${id}`).then(r => r.data),
  create: (data) => api.post('/Modele', data).then(r => r.data),
  update: (id, data) => api.put(`/Modele/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/Modele/${id}`),
}

export default modeleService
