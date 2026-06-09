import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import SightseeingBadge from './SightseeingBadge'
import AddSightseeingModal from './AddSightseeingModal'
import './RoadStop.css'

function StopCard({ stop, onEdit, onDelete }) {
  return (
    <div className="stop-card" style={{ borderLeftColor: stop.color }}>
      <div className="stop-card-header">
        <h2 className="stop-title">{stop.title}</h2>
        <div className="stop-actions">
          <button className="icon-btn" onClick={onEdit} title="Edit">✎</button>
          <button className="icon-btn danger" onClick={onDelete} title="Delete">✕</button>
        </div>
      </div>
      <p className="stop-summary">{stop.summary}</p>
    </div>
  )
}

function SightseeingsPanel({ stop, onSightseeingClick, onEditSightseeing, onDeleteSightseeing, onAddSightseeing }) {
  const [showAddSS, setShowAddSS] = useState(false)
  const [editingSS, setEditingSS] = useState(null)

  return (
    <div className="sightseeings-list">
      {stop.sightseeings.map((ss) => (
        <SightseeingBadge
          key={ss.id}
          ss={ss}
          color={stop.color}
          onClick={() => onSightseeingClick(ss)}
          onEdit={() => setEditingSS(ss)}
          onDelete={() => onDeleteSightseeing(ss.id)}
        />
      ))}
      <button className="add-ss-btn" onClick={() => setShowAddSS(true)}>
        + Sightseeing
      </button>

      {showAddSS && (
        <AddSightseeingModal
          onSave={(ss) => { onAddSightseeing(ss); setShowAddSS(false) }}
          onClose={() => setShowAddSS(false)}
        />
      )}
      {editingSS && (
        <AddSightseeingModal
          existing={editingSS}
          onSave={(updated) => { onEditSightseeing(updated); setEditingSS(null) }}
          onClose={() => setEditingSS(null)}
        />
      )}
    </div>
  )
}

export default function RoadStop({
  stop,
  index,
  nodeRef,
  onSightseeingClick,
  onEdit,
  onDelete,
  onAddSightseeing,
  onEditSightseeing,
  onDeleteSightseeing,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stop.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : 1,
  }

  // Even: node left-of-center (2fr | node | 3fr), card left, sightseeings right
  // Odd:  node right-of-center (3fr | node | 2fr), sightseeings left, card right
  const isEven = index % 2 === 0

  const ssPanel = (
    <SightseeingsPanel
      stop={stop}
      onSightseeingClick={onSightseeingClick}
      onEditSightseeing={onEditSightseeing}
      onDeleteSightseeing={onDeleteSightseeing}
      onAddSightseeing={onAddSightseeing}
    />
  )

  const stopCard = <StopCard stop={stop} onEdit={onEdit} onDelete={onDelete} />

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`road-stop-row ${isEven ? 'is-even' : 'is-odd'}`}
    >
      <div className="stop-panel">{isEven ? stopCard : ssPanel}</div>

      <div className="stop-center">
        <div
          ref={nodeRef}
          className="stop-node"
          style={{ background: stop.color, boxShadow: `0 0 20px ${stop.color}55` }}
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          <span className="stop-number">{index + 1}</span>
        </div>
      </div>

      <div className="stop-panel">{isEven ? ssPanel : stopCard}</div>
    </div>
  )
}
