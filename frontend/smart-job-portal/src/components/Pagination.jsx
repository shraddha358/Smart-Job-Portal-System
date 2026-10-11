export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="pagination">
      <button onClick={() => onPageChange(0)} disabled={page === 0}>«</button>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 0}>‹</button>
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const p = Math.max(0, Math.min(page - 2, totalPages - 5)) + i
        return (
          <button key={p} onClick={() => onPageChange(p)} className={p === page ? 'active' : ''}>
            {p + 1}
          </button>
        )
      })}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}>›</button>
      <button onClick={() => onPageChange(totalPages - 1)} disabled={page >= totalPages - 1}>»</button>
    </div>
  )
}
