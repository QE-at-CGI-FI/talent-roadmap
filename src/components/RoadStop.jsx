import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable'
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

function SortableSightseeingBadge({ ss, color, onClick, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: ss.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style}>
      <SightseeingBadge
        ss={ss}
        color={color}
        onClick={onClick}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

function SightseeingsPanel({
  stop,
  onSightseeingClick,
  onEditSightseeing,
  onDeleteSightseeing,
  onAddSightseeing,
  onReorderSightseeings,
}) {
  const [showAddSS, setShowAddSS] = useState(false)
  const [editingSS, setEditingSS] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = stop.sightseeings.findIndex((ss) => ss.id === active.id)
      const newIndex = stop.sightseeings.findIndex((ss) => ss.id === over.id)
      onReorderSightseeings(arrayMove(stop.sightseeings, oldIndex, newIndex))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={stop.sightseeings.map((ss) => ss.id)} strategy={verticalListSortingStrategy}>
        <div className="sightseeings-list">
          {stop.sightseeings.map((ss) => (
            <SortableSightseeingBadge
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
        </div>
      </SortableContext>

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
    </DndContext>
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
  onReorderSightseeings,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stop.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : 1,
  }

  const isEven = index % 2 === 0

  const ssPanel = (
    <SightseeingsPanel
      stop={stop}
      onSightseeingClick={onSightseeingClick}
      onEditSightseeing={onEditSightseeing}
      onDeleteSightseeing={onDeleteSightseeing}
      onAddSightseeing={onAddSightseeing}
      onReorderSightseeings={onReorderSightseeings}
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
