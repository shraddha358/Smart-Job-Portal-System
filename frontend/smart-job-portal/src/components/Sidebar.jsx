import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const sidebarStyle = {
  width: 220, minHeight: 'calc(100vh - 60px)', background: '#fff',
  borderRight: '1px solid #e2e8f0', padding: '1rem 0', flexShrink: 0,
}
const linkStyle = { display: 'block', padding: '0.6rem 1.25rem', color: '#475569', textDecoration: 'none', fontSize: '0.875rem', borderLeft: '3px solid transparent' }
const activeStyle = { ...linkStyle, color: '#2563eb', background: '#eff6ff', borderLeftColor: '#2563eb', fontWeight: 600 }

export default function Sidebar() {
  const { isJobSeeker, isRecruiter, isAdmin } = useAuth()

  const jobSeekerLinks = [
    { to: '/jobseeker/dashboard', label: '📊 Dashboard' },
    { to: '/jobseeker/profile', label: '👤 My Profile' },
    { to: '/jobs', label: '🔍 Browse Jobs' },
    { to: '/jobseeker/applications', label: '📋 My Applications' },
    { to: '/jobseeker/saved-jobs', label: '🔖 Saved Jobs' },
  ]

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: '📊 Dashboard' },
    { to: '/recruiter/profile', label: '🏢 Company Profile' },
    { to: '/recruiter/jobs', label: '💼 My Jobs' },
    { to: '/recruiter/jobs/create', label: '➕ Post a Job' },
  ]

  const adminLinks = [
    { to: '/admin/dashboard', label: '📊 Dashboard' },
    { to: '/admin/users', label: '👥 Users' },
    { to: '/admin/jobs', label: '💼 Jobs' },
    { to: '/admin/applications', label: '📋 Applications' },
  ]

  const links = isJobSeeker ? jobSeekerLinks : isRecruiter ? recruiterLinks : isAdmin ? adminLinks : []

  return (
    <aside style={sidebarStyle}>
      {links.map(({ to, label }) => (
        <NavLink key={to} to={to} style={({ isActive }) => isActive ? activeStyle : linkStyle}>
          {label}
        </NavLink>
      ))}
    </aside>
  )
}
