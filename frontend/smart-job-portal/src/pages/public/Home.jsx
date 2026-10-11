import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Home() {
  const { isAuthenticated, isJobSeeker, isRecruiter, isAdmin } = useAuth()

  const getDashboardLink = () => {
    if (isJobSeeker) return '/jobseeker/dashboard'
    if (isRecruiter) return '/recruiter/dashboard'
    if (isAdmin) return '/admin/dashboard'
    return '/jobs'
  }

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #2563eb 100%)', color: '#fff', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Find Your Dream Job</h1>
        <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '2rem', maxWidth: 600, margin: '0 auto 2rem' }}>
          Connect with top companies and discover opportunities that match your skills and ambitions.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/jobs" className="btn btn-lg" style={{ background: '#fff', color: '#2563eb', fontWeight: 600 }}>Browse Jobs</Link>
          {isAuthenticated
            ? <Link to={getDashboardLink()} className="btn btn-lg" style={{ background: 'transparent', border: '2px solid #fff', color: '#fff' }}>Go to Dashboard</Link>
            : <Link to="/register" className="btn btn-lg" style={{ background: 'transparent', border: '2px solid #fff', color: '#fff' }}>Get Started</Link>
          }
        </div>
      </div>

      <div className="page-container" style={{ marginTop: '3rem' }}>
        <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
          {[
            { icon: '🔍', title: 'Smart Search', desc: 'Filter jobs by title, location, type, and experience level.' },
            { icon: '📋', title: 'Easy Apply', desc: 'Upload your resume once and apply to multiple jobs instantly.' },
            { icon: '📊', title: 'Track Progress', desc: 'Monitor your application status in real-time from your dashboard.' },
          ].map(f => (
            <div key={f.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '2rem', background: '#eff6ff', borderRadius: 12 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Are you a Recruiter?</h2>
          <p style={{ color: '#475569', marginBottom: '1.5rem' }}>Post jobs and find the best talent for your company.</p>
          {!isAuthenticated && <Link to="/register" className="btn btn-primary btn-lg">Post a Job</Link>}
          {isRecruiter && <Link to="/recruiter/jobs/create" className="btn btn-primary btn-lg">Post a Job</Link>}
        </div>
      </div>
    </div>
  )
}
