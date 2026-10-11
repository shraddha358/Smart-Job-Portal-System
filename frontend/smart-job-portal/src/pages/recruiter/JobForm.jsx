import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { jobService } from '../../services/jobService'
import Toast from '../../components/Toast'

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'REMOTE']

const EMPTY = { title: '', companyName: '', location: '', jobType: 'FULL_TIME', salary: '', experienceRequired: '', skills: '', description: '', responsibilities: '', qualifications: '', applicationDeadline: '' }

export default function JobForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    jobService.getRecruiterJobById(id)
      .then(res => {
        const j = res.data
        setForm({ ...j, applicationDeadline: j.applicationDeadline || '', jobType: j.jobType || 'FULL_TIME' })
      })
      .catch(() => setToast({ message: 'Failed to load job', type: 'error' }))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.companyName.trim()) e.companyName = 'Company name is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.jobType) e.jobType = 'Job type is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const payload = { ...form, applicationDeadline: form.applicationDeadline || null }
      if (isEdit) await jobService.updateJob(id, payload)
      else await jobService.createJob(payload)
      navigate('/recruiter/jobs')
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save job', type: 'error' })
    } finally { setSaving(false) }
  }

  const set = (field) => (e) => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: '' })) }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div style={{ maxWidth: 750 }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="page-title">{isEdit ? 'Edit Job' : 'Post New Job'}</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input value={form.title} onChange={set('title')} placeholder="e.g. Java Backend Developer" />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input value={form.companyName} onChange={set('companyName')} placeholder="Company name" />
              {errors.companyName && <p className="form-error">{errors.companyName}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input value={form.location} onChange={set('location')} placeholder="City or Remote" />
            </div>
            <div className="form-group">
              <label className="form-label">Job Type *</label>
              <select value={form.jobType} onChange={set('jobType')}>
                {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
              {errors.jobType && <p className="form-error">{errors.jobType}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Salary</label>
              <input value={form.salary} onChange={set('salary')} placeholder="e.g. 4-6 LPA" />
            </div>
            <div className="form-group">
              <label className="form-label">Experience Required</label>
              <input value={form.experienceRequired} onChange={set('experienceRequired')} placeholder="e.g. Fresher, 0-2 years" />
            </div>
            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input type="date" value={form.applicationDeadline} onChange={set('applicationDeadline')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Skills (comma-separated)</label>
            <input value={form.skills} onChange={set('skills')} placeholder="Java, Spring Boot, MySQL..." />
          </div>
          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea rows={4} value={form.description} onChange={set('description')} placeholder="Describe the role..." />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Responsibilities</label>
            <textarea rows={4} value={form.responsibilities} onChange={set('responsibilities')} placeholder="Key responsibilities..." />
          </div>
          <div className="form-group">
            <label className="form-label">Qualifications</label>
            <textarea rows={3} value={form.qualifications} onChange={set('qualifications')} placeholder="Required qualifications..." />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job'}</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/recruiter/jobs')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
