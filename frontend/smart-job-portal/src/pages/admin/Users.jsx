import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../services/adminService'
import Pagination from '../../components/Pagination'
import ConfirmDialog from '../../components/ConfirmDialog'
import Toast from '../../components/Toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 })
  const [filters, setFilters] = useState({ search: '', role: '', status: '' })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const fetchUsers = useCallback(async (page = 0) => {
    setLoading(true)
    try {
      const params = { page, size: 10, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) }
      const res = await adminService.getUsers(params)
      setUsers(res.data.content)
      setPagination({ page: res.data.page, totalPages: res.data.totalPages, totalElements: res.data.totalElements })
    } catch { setToast({ message: 'Failed to load users', type: 'error' }) }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchUsers(0) }, [fetchUsers])

  const handleStatusToggle = (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setConfirm({
      message: `${newStatus === 'INACTIVE' ? 'Deactivate' : 'Activate'} user "${user.fullName}"?`,
      onConfirm: async () => {
        setConfirm(null)
        try {
          await adminService.updateUserStatus(user.id, newStatus)
          setToast({ message: `User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`, type: 'success' })
          fetchUsers(pagination.page)
        } catch (err) {
          setToast({ message: err.response?.data?.message || 'Update failed', type: 'error' })
        }
      }
    })
  }

  const handleDelete = (user) => {
    setConfirm({
      message: `Permanently delete user "${user.fullName}"? This cannot be undone.`,
      onConfirm: async () => {
        setConfirm(null)
        try {
          await adminService.deleteUser(user.id)
          setToast({ message: 'User deleted', type: 'info' })
          fetchUsers(pagination.page)
        } catch (err) {
          setToast({ message: err.response?.data?.message || 'Delete failed', type: 'error' })
        }
      }
    })
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      <h1 className="page-title">User Management</h1>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input placeholder="Search name or email..." value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            style={{ flex: 1, minWidth: 200 }} />
          <select value={filters.role} onChange={e => setFilters(f => ({ ...f, role: e.target.value }))} style={{ width: 'auto' }}>
            <option value="">All Roles</option>
            <option value="JOB_SEEKER">Job Seeker</option>
            <option value="RECRUITER">Recruiter</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} style={{ width: 'auto' }}>
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <button className="btn btn-outline" onClick={() => setFilters({ search: '', role: '', status: '' })}>Clear</button>
        </div>
      </div>

      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{pagination.totalElements} users found</p>

      {loading ? <div className="loading">Loading...</div> : (
        <div className="card table-container">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500 }}>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '—'}</td>
                  <td><span className={`badge ${user.role === 'ADMIN' ? 'badge-red' : user.role === 'RECRUITER' ? 'badge-purple' : 'badge-blue'}`}>{user.role}</span></td>
                  <td><span className={`badge ${user.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>{user.status}</span></td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className={`btn btn-sm ${user.status === 'ACTIVE' ? 'btn-secondary' : 'btn-success'}`}
                        onClick={() => handleStatusToggle(user)}>
                        {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      {user.role !== 'ADMIN' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user)}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchUsers} />
    </div>
  )
}
