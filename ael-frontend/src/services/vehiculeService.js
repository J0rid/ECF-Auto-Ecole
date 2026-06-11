import api from './api'

const vehiculeService = {
  getAll: () => api.get('/Vehicule').then(r => r.data),
  getByImmat: (noImmat) => api.get(`/Vehicule/${noImmat}`).then(r => r.data),
  create: (data) => api.post('/Vehicule', data).then(r => r.data),
  update: (noImmat, data) => api.put(`/Vehicule/${encodeURIComponent(noImmat)}`, data).then(r => r.data),
  activer: (noImmat) => api.patch(`/Vehicule/${encodeURIComponent(noImmat)}/activer`).then(r => r.data),
  desactiver: (noImmat) => api.patch(`/Vehicule/${encodeURIComponent(noImmat)}/desactiver`).then(r => r.data),
  delete: (noImmat) => api.delete(`/Vehicule/${encodeURIComponent(noImmat)}`),
}

export default vehiculeService
