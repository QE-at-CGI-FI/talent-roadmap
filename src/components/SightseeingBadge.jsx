import './SightseeingBadge.css'

export default function SightseeingBadge({ ss, color, onClick, onDelete }) {
  return (
    <div className="ss-badge" style={{ '--ss-color': color }} onClick={onClick}>
      <span className="ss-dot" style={{ background: color }} />
      <div className="ss-text">
        <span className="ss-title">{ss.title}</span>
        <span className="ss-summary">{ss.summary}</span>
      </div>
      <button
        className="ss-delete"
        title="Remove"
        onClick={(e) => { e.stopPropagation(); onDelete() }}
      >
        ✕
      </button>
    </div>
  )
}
