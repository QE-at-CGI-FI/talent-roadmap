import './SightseeingBadge.css'

const EXERCISE_COLOR = '#FFD600'
const STAR_COLOR = '#FF69B4'

export default function SightseeingBadge({ ss, color, onClick, onEdit, onDelete, dragHandleProps }) {
  const isStarred = ss.starred
  const isExercise = ss.exercise
  const dotColor = isExercise ? EXERCISE_COLOR : color

  let badgeClass = 'ss-badge'
  if (isStarred) badgeClass += ' ss-starred'
  else if (isExercise) badgeClass += ' ss-exercise'

  return (
    <div className={badgeClass} style={{ '--ss-color': isStarred ? STAR_COLOR : dotColor }} onClick={onClick}>
      <span className="ss-grip" {...dragHandleProps} onClick={(e) => e.stopPropagation()} title="Drag to reorder">⠿</span>
      {isStarred
        ? <span className="ss-star">★</span>
        : <span className="ss-dot" style={{ background: dotColor }} />
      }
      <div className="ss-text">
        <span className="ss-title">{ss.title}</span>
        <span className="ss-summary">{ss.summary}</span>
      </div>
      <div className="ss-actions">
        <button className="ss-action-btn" title="Edit" onClick={(e) => { e.stopPropagation(); onEdit() }}>✎</button>
        <button className="ss-action-btn ss-action-danger" title="Remove" onClick={(e) => { e.stopPropagation(); onDelete() }}>✕</button>
      </div>
    </div>
  )
}
