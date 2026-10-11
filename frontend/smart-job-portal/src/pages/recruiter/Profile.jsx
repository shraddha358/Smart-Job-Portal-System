import { useState, useEffect } from 'react'
import { profileService } from '../../services/profileService'
import Toast from '../../components/Toast'

export default function RecruiterProfile() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    profileService.getRecruiterProfile()
      .then(res => setForm(res.data))
      .catch(() => setToast({ message: 'Failed to load profile', type: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const res = await profileService.updateRecruiterProfile(form)
      setForm(res.data)
      setToast({ message: 'Profile updated!', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Update failed', type: 'error' })
    } finally { setSaving(false) }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  if (loading) return <div className="loading">Loading profile...</div>

  return (
    <div style={{ maxWidth: 700 }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="page-title">Company Profile</h1>
      <div className="card">
        <form onSubmit={handleSave}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input value={form.fullName || ''} disabled style={{ background: '#f1f5f9' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input value={form.email || ''} disabled style={{ background: '#f1f5f9' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input value={form.phone || ''} onChange={set('phone')} placeholder="10-digit phone" />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input value={form.companyName || ''} onChange={set('companyName')} placeholder="Company name" />
            </div>
            <div className="form-group">
              <label className="form-label">Company Website</label>
              <input value={form.companyWebsite || ''} onChange={set('companyWebsite')} placeholder="https://company.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Company Location</label>
              <input value={form.companyLocation || ''} onChange={set('companyLocation')} placeholder="City, Country" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Company Description</label>
            <textarea rows={4} value={form.companyDescription || ''} onChange={set('companyDescription')} placeholder="Describe your company..." />
          </div>
          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <input value={form.linkedinUrl || ''} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/company/..." />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </div>
    </div>
  )
}
