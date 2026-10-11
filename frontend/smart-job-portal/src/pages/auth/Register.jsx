import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '', role: 'JOB_SEEKER' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) e.password = 'Must contain uppercase, lowercase, and digit'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone = 'Phone must be 10 digits'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true); setServerError('')
    try {
      const res = await authService.register(form)
      login(res.data)
      const role = res.data.role
      if (role === 'JOB_SEEKER') navigate('/jobseeker/dashboard')
      else if (role === 'RECRUITER') navigate('/recruiter/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors
        ? Object.values(err.response.data.errors || {}).join(', ')
        : 'Registration failed'
      setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally { setLoading(false) }
  }

  const set = (field) => (e) => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: '' })) }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: 480 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Create Account</h2>
        {serverError && <div className="alert alert-error">{serverError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input value={form.fullName} onChange={set('fullName')} placeholder="John Doe" />
            {errors.fullName && <p className="form-error">{errors.fullName}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="Min 8 chars, upper+lower+digit" />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repeat password" />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input value={form.phone} onChange={set('phone')} placeholder="10-digit phone number" />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Register as *</label>
            <select value={form.role} onChange={set('role')}>
              <option value="JOB_SEEKER">Job Seeker</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
