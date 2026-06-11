import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('ael_token'))

  const claims = token ? parseJwt(token) : null

  const user = claims ? {
    login: claims['unique_name'] || 'Utilisateur',
    role: claims['role'] || '',
  } : null

  const login = (newToken) => {
    localStorage.setItem('ael_token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('ael_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
