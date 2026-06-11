import api from './api'

const authService = {
  login: async (login, motDePasse) => {
    const res = await api.post('/Auth/login', { login, motDePasse })
    return res.data
  },
}

export default authService
