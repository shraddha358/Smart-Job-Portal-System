import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const colors = { success: '#16a34a', error: '#dc2626', info: '#0891b2' }
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
      background: colors[type] || colors.success, color: '#fff',
      padding: '0.75rem 1.25rem', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      maxWidth: 350, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
    }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
    </div>
  )
}
