import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, user, logout, isJobSeeker, isRecruiter, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getDashboardLink = () => {
    if (isJobSeeker) return '/jobseeker/dashboard'
    if (isRecruiter) return '/recruiter/dashboard'
    if (isAdmin) return '/admin/dashboard'
    return '/'
  }

  return (
    <nav style={{ background: '#1e293b', color: '#fff', padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link to="/" style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none' }}>
          💼 SmartJobPortal
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/jobs" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>Browse Jobs</Link>

          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard</Link>
              {isJobSeeker && (
                <>
                  <Link to="/jobseeker/applications" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>Applications</Link>
                  <Link to="/jobseeker/saved-jobs" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>Saved</Link>
                </>
              )}
              {isRecruiter && (
                <Link to="/recruiter/jobs" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>My Jobs</Link>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin/users" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>Users</Link>
                  <Link to="/admin/jobs" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>Jobs</Link>
                </>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{user?.fullName}</span>
                <span style={{ fontSize: '0.7rem', background: '#3b82f6', padding: '0.1rem 0.4rem', borderRadius: 4 }}>{user?.role}</span>
                <button onClick={handleLogout} className="btn btn-sm" style={{ background: '#ef4444', color: '#fff', border: 'none' }}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
