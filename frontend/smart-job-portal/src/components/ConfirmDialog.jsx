export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-title">Confirm Action</h3>
        <p style={{ color: '#475569' }}>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
