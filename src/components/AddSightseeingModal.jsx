import { useState, useEffect } from 'react'
import './Modal.css'

export default function AddSightseeingModal({ onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [details, setDetails] = useState('')

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), summary: summary.trim(), details: details.trim() })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Sightseeing</h3>
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
              placeholder="e.g. Writing Test Plans"
            />
          </label>
          <label>
            <span>Summary</span>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short description shown on the card"
            />
          </label>
          <label>
            <span>Details <small style={{color:'#64748b'}}>(shown in overlay — use • for bullets)</small></span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="• Key point one&#10;• Key point two&#10;&#10;Paragraph text here"
              rows={6}
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!title.trim()}>
              Add Sightseeing
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
