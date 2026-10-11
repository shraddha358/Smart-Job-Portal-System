import { useState, useEffect, useRef } from 'react'
import { profileService } from '../../services/profileService'
import Toast from '../../components/Toast'

export default function JobSeekerProfile() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [resumeUploading, setResumeUploading] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    profileService.getJobSeekerProfile()
      .then(res => { setProfile(res.data); setForm(res.data) })
      .catch(() => setToast({ message: 'Failed to load profile', type: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const res = await profileService.updateJobSeekerProfile(form)
      setProfile(res.data); setForm(res.data)
      setToast({ message: 'Profile updated successfully!', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update profile', type: 'error' })
    } finally { setSaving(false) }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setResumeUploading(true)
    try {
      await profileService.uploadResume(file)
      const res = await profileService.getJobSeekerProfile()
      setProfile(res.data); setForm(res.data)
      setToast({ message: 'Resume uploaded successfully!', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Upload failed', type: 'error' })
    } finally { setResumeUploading(false); e.target.value = '' }
  }

  const handleResumeDownload = async () => {
    try {
      const res = await profileService.downloadResume()
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a'); a.href = url; a.download = profile.resumeFileName || 'resume'; a.click()
      URL.revokeObjectURL(url)
    } catch { setToast({ message: 'Download failed', type: 'error' }) }
  }

  const handleResumeDelete = async () => {
    if (!window.confirm('Delete your resume?')) return
    try {
      await profileService.deleteResume()
      const res = await profileService.getJobSeekerProfile()
      setProfile(res.data); setForm(res.data)
      setToast({ message: 'Resume deleted', type: 'info' })
    } catch { setToast({ message: 'Delete failed', type: 'error' }) }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  if (loading) return <div className="loading">Loading profile...</div>

  return (
    <div style={{ maxWidth: 700 }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="page-title">My Profile</h1>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Resume</h3>
        {profile?.hasResume ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', color: '#475569' }}>📄 {profile.resumeFileName}</span>
            <button className="btn btn-outline btn-sm" onClick={handleResumeDownload}>Download</button>
            <button className="btn btn-outline btn-sm" onClick={() => fileRef.current.click()} disabled={resumeUploading}>Replace</button>
            <button className="btn btn-danger btn-sm" onClick={handleResumeDelete}>Delete</button>
          </div>
        ) : (
          <div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.75rem' }}>No resume uploaded. Upload PDF, DOC, or DOCX (max 5MB).</p>
            <button className="btn btn-primary btn-sm" onClick={() => fileRef.current.click()} disabled={resumeUploading}>
              {resumeUploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleResumeUpload} />
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Personal Information</h3>
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
              <label className="form-label">Date of Birth</label>
              <input type="date" value={form.dateOfBirth || ''} onChange={set('dateOfBirth')} />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input value={form.city || ''} onChange={set('city')} placeholder="City" />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input value={form.state || ''} onChange={set('state')} placeholder="State" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input value={form.address || ''} onChange={set('address')} placeholder="Full address" />
          </div>
          <div className="form-group">
            <label className="form-label">Skills (comma-separated)</label>
            <input value={form.skills || ''} onChange={set('skills')} placeholder="Java, React, MySQL..." />
          </div>
          <div className="form-group">
            <label className="form-label">Education</label>
            <textarea rows={3} value={form.education || ''} onChange={set('education')} placeholder="B.E. Computer Science, XYZ University, 2024" />
          </div>
          <div className="form-group">
            <label className="form-label">Experience</label>
            <textarea rows={3} value={form.experience || ''} onChange={set('experience')} placeholder="0-1 years / Fresher" />
          </div>
          <div className="grid grid-3">
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input value={form.linkedinUrl || ''} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input value={form.githubUrl || ''} onChange={set('githubUrl')} placeholder="https://github.com/..." />
            </div>
            <div className="form-group">
              <label className="form-label">Portfolio URL</label>
              <input value={form.portfolioUrl || ''} onChange={set('portfolioUrl')} placeholder="https://yourportfolio.com" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </div>
    </div>
  )
}
