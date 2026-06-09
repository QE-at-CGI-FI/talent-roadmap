import { useState, useEffect, useRef } from 'react'
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
} from '@dnd-kit/sortable'
import { initialStops } from './data'
import RoadStop from './components/RoadStop'
import Overlay from './components/Overlay'
import AddStopModal from './components/AddStopModal'
import './App.css'

const STORAGE_KEY = 'talent-roadmap-stops'

function loadStops() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return initialStops
}

export default function App() {
  const [stops, setStops] = useState(loadStops)
  const [overlay, setOverlay] = useState(null) // { stop, sightseeing }
  const [showAddStop, setShowAddStop] = useState(false)
  const [editingStop, setEditingStop] = useState(null)
  const importRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stops))
  }, [stops])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setStops((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id)
        const newIndex = prev.findIndex((s) => s.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  function addStop(stop) {
    setStops((prev) => [...prev, { ...stop, id: `stop-${Date.now()}`, sightseeings: [] }])
    setShowAddStop(false)
  }

  function updateStop(updated) {
    setStops((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setEditingStop(null)
  }

  function deleteStop(stopId) {
    setStops((prev) => prev.filter((s) => s.id !== stopId))
  }

  function addSightseeing(stopId, ss) {
    setStops((prev) =>
      prev.map((s) =>
        s.id === stopId
          ? { ...s, sightseeings: [...s.sightseeings, { ...ss, id: `ss-${Date.now()}` }] }
          : s
      )
    )
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(stops, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'talent-roadmap.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (Array.isArray(data)) setStops(data)
      } catch {}
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function deleteSightseeing(stopId, ssId) {
    setStops((prev) =>
      prev.map((s) =>
        s.id === stopId
          ? { ...s, sightseeings: s.sightseeings.filter((ss) => ss.id !== ssId) }
          : s
      )
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <img src={`${import.meta.env.BASE_URL}cgi-logo.png`} alt="CGI" className="cgi-logo" />
            <div className="header-divider" />
            <div>
              <h1 className="app-title">Modern Testing Talent Roadmap</h1>
              <p className="app-subtitle">A visual guide to the skills and stops on the journey</p>
            </div>
          </div>
          <div className="header-actions">
            <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
            <button className="btn-secondary" onClick={() => importRef.current.click()}>Import</button>
            <button className="btn-secondary" onClick={handleExport}>Export</button>
            <button className="btn-primary" onClick={() => setShowAddStop(true)}>+ Add Stop</button>
          </div>
        </div>
      </header>

      <main className="roadmap-container">
        <div className="road-track">
          <div className="road-line" />
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {stops.map((stop, index) => (
                <RoadStop
                  key={stop.id}
                  stop={stop}
                  index={index}
                  total={stops.length}
                  onSightseeingClick={(ss) => setOverlay({ stop, sightseeing: ss })}
                  onEdit={() => setEditingStop(stop)}
                  onDelete={() => deleteStop(stop.id)}
                  onAddSightseeing={(ss) => addSightseeing(stop.id, ss)}
                  onDeleteSightseeing={(ssId) => deleteSightseeing(stop.id, ssId)}
                />
              ))}
            </SortableContext>
          </DndContext>

          {stops.length === 0 && (
            <div className="empty-road">
              <p>No stops yet. Add your first stop to begin the journey.</p>
              <button className="btn-primary" onClick={() => setShowAddStop(true)}>
                + Add First Stop
              </button>
            </div>
          )}
        </div>
      </main>

      {overlay && (
        <Overlay
          stop={overlay.stop}
          sightseeing={overlay.sightseeing}
          onClose={() => setOverlay(null)}
        />
      )}

      {(showAddStop || editingStop) && (
        <AddStopModal
          existing={editingStop}
          onSave={editingStop ? updateStop : addStop}
          onClose={() => { setShowAddStop(false); setEditingStop(null) }}
        />
      )}
    </div>
  )
}
