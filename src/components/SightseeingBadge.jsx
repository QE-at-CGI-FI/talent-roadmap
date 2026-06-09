import './SightseeingBadge.css'

export default function SightseeingBadge({ ss, color, onClick, onEdit, onDelete }) {
  return (
    <div className="ss-badge" style={{ '--ss-color': color }} onClick={onClick}>
      <span className="ss-dot" style={{ background: color }} />
      <div className="ss-text">
        <span className="ss-title">{ss.title}</span>
        <span className="ss-summary">{ss.summary}</span>
      </div>
      <div className="ss-actions">
        <button
          className="ss-action-btn"
          title="Edit"
          onClick={(e) => { e.stopPropagation(); onEdit() }}
        >✎</button>
        <button
          className="ss-action-btn ss-action-danger"
          title="Remove"
          onClick={(e) => { e.stopPropagation(); onDelete() }}
        >✕</button>
      </div>
    </div>
  )
}
