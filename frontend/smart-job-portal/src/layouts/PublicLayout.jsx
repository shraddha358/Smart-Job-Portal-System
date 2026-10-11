import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer style={{ background: '#1e293b', color: '#94a3b8', textAlign: 'center', padding: '1rem', fontSize: '0.875rem' }}>
        © 2024 SmartJobPortal — Connecting talent with opportunity
      </footer>
    </div>
  )
}
