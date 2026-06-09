import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Overlay.css'

export default function Overlay({ stop, sightseeing, onClose, onEdit }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-panel" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-header" style={{ borderColor: stop.color }}>
          <div>
            <div className="overlay-breadcrumb" style={{ color: stop.color }}>
              {stop.title}
            </div>
            <h2 className="overlay-title">{sightseeing.title}</h2>
          </div>
          <div className="overlay-header-actions">
            <button className="overlay-edit-btn" onClick={onEdit} title="Edit">✎ Edit</button>
            <button className="overlay-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="overlay-body">
          <p className="overlay-summary">{sightseeing.summary}</p>
          <div className="overlay-details">
            {sightseeing.details.split('\n').map((line, i) =>
              line.startsWith('•') ? (
                <div key={i} className="overlay-bullet">
                  <span className="bullet-dot" style={{ background: stop.color }} />
                  <span>{line.slice(1).trim()}</span>
                </div>
              ) : line.trim() ? (
                <p key={i} className="overlay-para">{line}</p>
              ) : (
                <div key={i} className="overlay-spacer" />
              )
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
