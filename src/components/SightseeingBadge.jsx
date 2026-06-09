import './SightseeingBadge.css'

const EXERCISE_COLOR = '#FFD600'

export default function SightseeingBadge({ ss, color, onClick, onEdit, onDelete }) {
  const dotColor = ss.exercise ? EXERCISE_COLOR : color
  return (
    <div className={`ss-badge${ss.exercise ? ' ss-exercise' : ''}`} style={{ '--ss-color': dotColor }} onClick={onClick}>
      <span className="ss-dot" style={{ background: dotColor }} />
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
