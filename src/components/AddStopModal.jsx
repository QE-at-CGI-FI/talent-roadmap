import { useState, useEffect } from 'react'
import './Modal.css'

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316',
  '#10b981', '#0ea5e9', '#f59e0b', '#ef4444',
]

export default function AddStopModal({ existing, onSave, onClose }) {
  const [title, setTitle] = useState(existing?.title ?? '')
  const [summary, setSummary] = useState(existing?.summary ?? '')
  const [color, setColor] = useState(existing?.color ?? COLORS[0])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSave(existing
      ? { ...existing, title: title.trim(), summary: summary.trim(), color }
      : { title: title.trim(), summary: summary.trim(), color }
    )
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{existing ? 'Edit Stop' : 'Add New Stop'}</h3>
          <button className="overlay-close" onClick={onClose}>✕</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            <span>Title</span>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Test Automation Foundations"
            />
          </label>
          <label>
            <span>Summary</span>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="One-line description of this stop"
            />
          </label>
          <div className="color-picker">
            <span>Color</span>
            <div className="color-swatches">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!title.trim()}>
              {existing ? 'Save Changes' : 'Add Stop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
