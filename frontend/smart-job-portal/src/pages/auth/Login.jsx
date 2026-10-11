import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Email and password are required'); return }
    setLoading(true); setError('')
    try {
      const res = await authService.login(form)
      login(res.data)
      const role = res.data.role
      if (from && !from.includes('/login') && !from.includes('/register')) {
        navigate(from, { replace: true })
      } else if (role === 'JOB_SEEKER') navigate('/jobseeker/dashboard')
      else if (role === 'RECRUITER') navigate('/recruiter/dashboard')
      else if (role === 'ADMIN') navigate('/admin/dashboard')
      else navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Welcome Back</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Your password" />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f1f5f9', borderRadius: 8, fontSize: '0.8rem', color: '#475569' }}>
          <strong>Dev credentials:</strong><br />
          Admin: admin@smartjobportal.com / Admin@1234<br />
          Recruiter: rahul@techcorp.com / Recruiter@1234<br />
          Seeker: amit@gmail.com / Seeker@1234
        </div>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}
