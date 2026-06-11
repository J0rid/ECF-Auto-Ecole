import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

export default function Login() {
  const [form, setForm] = useState({ login: '', motDePasse: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authService.login(form.login, form.motDePasse)
      login(data.token)
      navigate('/dashboard')
    } catch {
      setError('Identifiant ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="d-flex justify-content-between align-items-center px-4 py-3">
        <div className="d-flex align-items-center gap-2">
          <span className="ael-badge">AEL</span>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.2 }}>Auto-École du Lycée</div>
            <div style={{ fontSize: '0.7rem', color: '#888' }}>Espace secrétariat</div>
          </div>
        </div>
        <a href="#aide" className="text-muted text-decoration-none d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
          <i className="bi bi-question-circle"></i>
          Besoin d'aide ?
        </a>
      </div>

      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="card p-4 login-card">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
              style={{ width: 56, height: 56, backgroundColor: '#D32F2F' }}
            >
              <i className="bi bi-person-lock text-white" style={{ fontSize: '1.6rem' }}></i>
            </div>
            <h4 className="fw-bold mb-1">Connexion</h4>
            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
              Accédez à votre espace secrétariat.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.875rem' }}>
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>
                Identifiant
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Votre identifiant"
                value={form.login}
                onChange={e => setForm({ ...form, login: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>
                Mot de passe
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••••"
                  value={form.motDePasse}
                  onChange={e => setForm({ ...form, motDePasse: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-ael w-100 fw-semibold"
              disabled={loading}
            >
              {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
              Se connecter
            </button>
          </form>
        </div>
      </div>

      <footer className="text-center py-3 text-muted" style={{ fontSize: '0.75rem', borderTop: '1px solid #e5e7eb', background: '#fff' }}>
        © 2025 Auto-École du Lycée — Tous droits réservés.&nbsp;&nbsp;
        <a href="#" className="text-muted text-decoration-none">Mentions légales</a>
        &nbsp;·&nbsp;
        <a href="#" className="text-muted text-decoration-none">Contact</a>
        &nbsp;·&nbsp;v1.0
      </footer>
    </div>
  )
}
