import { useState, useEffect, useRef, createRef } from 'react'
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
import defaultStops from '../talent-roadmap.json'
import condensedStops from '../condensed-talent-roadmap.json'
import RoadStop from './components/RoadStop'
import RoadPath from './components/RoadPath'
import Overlay from './components/Overlay'
import AddStopModal from './components/AddStopModal'
import AddSightseeingModal from './components/AddSightseeingModal'
import './App.css'

const COLORS = [
  '#E8001C', '#6B2FA0', '#B0003A', '#8A1AC8',
  '#C0003A', '#5A1080', '#FF2040', '#9B3DD0',
]

const STORAGE_KEY = 'talent-roadmap-stops'
const CONDENSED_STORAGE_KEY = 'talent-roadmap-condensed-stops'
const MODE_KEY = 'talent-roadmap-mode'

function loadStops(mode) {
  const key = mode === 'condensed' ? CONDENSED_STORAGE_KEY : STORAGE_KEY
  const defaults = mode === 'condensed' ? condensedStops : defaultStops
  try {
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
  } catch {}
  return defaults
}

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem(MODE_KEY) || 'full')
  const [stops, setStops] = useState(() => loadStops(localStorage.getItem(MODE_KEY) || 'full'))
  const [overlay, setOverlay] = useState(null)
  const [editingSSFromOverlay, setEditingSSFromOverlay] = useState(null)
  const [showAddStop, setShowAddStop] = useState(false)
  const [editingStop, setEditingStop] = useState(null)
  const importRef = useRef(null)
  const trackRef = useRef(null)
  const nodeRefsRef = useRef([])

  // Keep nodeRefs array in sync with stop count, preserving existing refs
  if (nodeRefsRef.current.length !== stops.length) {
    nodeRefsRef.current = stops.map((_, i) => nodeRefsRef.current[i] ?? createRef())
  }

  useEffect(() => {
    const key = mode === 'condensed' ? CONDENSED_STORAGE_KEY : STORAGE_KEY
    localStorage.setItem(key, JSON.stringify(stops))
  }, [stops, mode])

  function handleModeToggle() {
    const next = mode === 'full' ? 'condensed' : 'full'
    localStorage.setItem(MODE_KEY, next)
    setMode(next)
    setStops(loadStops(next))
  }

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
    setStops((prev) => [
      ...prev,
      { ...stop, id: `stop-${Date.now()}`, sightseeings: [] },
    ])
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

  function updateSightseeing(stopId, updated) {
    setStops((prev) =>
      prev.map((s) =>
        s.id === stopId
          ? { ...s, sightseeings: s.sightseeings.map((ss) => (ss.id === updated.id ? updated : ss)) }
          : s
      )
    )
  }

  function reorderSightseeings(stopId, newSightseeings) {
    setStops((prev) =>
      prev.map((s) => (s.id === stopId ? { ...s, sightseeings: newSightseeings } : s))
    )
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
          <div className="header-stats">
            <span className="stat-item">
              <span className="stat-number">{stops.length}</span>
              <span className="stat-label">stops</span>
            </span>
            <span className="stat-divider" />
            <span className="stat-item">
              <span className="stat-number">{stops.reduce((sum, s) => sum + (s.sightseeings?.length ?? 0), 0)}</span>
              <span className="stat-label">sightseeings</span>
            </span>
          </div>
          <div className="header-actions">
            <div className="mode-toggle" onClick={handleModeToggle} title="Switch between full and condensed roadmap">
              <span className={mode === 'full' ? 'mode-option mode-active' : 'mode-option'}>Full</span>
              <span className="mode-track">
                <span className={`mode-thumb ${mode === 'condensed' ? 'mode-thumb-right' : ''}`} />
              </span>
              <span className={mode === 'condensed' ? 'mode-option mode-active' : 'mode-option'}>Condensed</span>
            </div>
            <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
            <button className="btn-secondary" onClick={() => importRef.current.click()}>Import</button>
            <button className="btn-secondary" onClick={handleExport}>Export</button>
            <button className="btn-primary" onClick={() => setShowAddStop(true)}>+ Add Stop</button>
          </div>
        </div>
      </header>

      <main className="roadmap-container">
        <div className="road-track" ref={trackRef}>
          <RoadPath nodeRefs={nodeRefsRef.current} trackRef={trackRef} />
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {stops.map((stop, index) => (
                <RoadStop
                  key={stop.id}
                  stop={{ ...stop, color: COLORS[index % COLORS.length] }}
                  index={index}
                  nodeRef={nodeRefsRef.current[index]}
                  onSightseeingClick={(ss) => setOverlay({ stop, sightseeing: ss })}
                  onEdit={() => setEditingStop(stop)}
                  onDelete={() => deleteStop(stop.id)}
                  onAddSightseeing={(ss) => addSightseeing(stop.id, ss)}
                  onEditSightseeing={(ss) => updateSightseeing(stop.id, ss)}
                  onDeleteSightseeing={(ssId) => deleteSightseeing(stop.id, ssId)}
                  onReorderSightseeings={(ordered) => reorderSightseeings(stop.id, ordered)}
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
          onEdit={() => { setEditingSSFromOverlay({ stopId: overlay.stop.id, ss: overlay.sightseeing }); setOverlay(null) }}
        />
      )}

      {editingSSFromOverlay && (
        <AddSightseeingModal
          existing={editingSSFromOverlay.ss}
          onSave={(updated) => { updateSightseeing(editingSSFromOverlay.stopId, updated); setEditingSSFromOverlay(null) }}
          onClose={() => setEditingSSFromOverlay(null)}
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
