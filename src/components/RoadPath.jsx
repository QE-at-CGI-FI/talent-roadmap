import { useEffect, useState } from 'react'

export default function RoadPath({ nodeRefs, trackRef }) {
  const [pathData, setPathData] = useState('')

  useEffect(() => {
    if (!trackRef.current || nodeRefs.length === 0) return
    const trackRect = trackRef.current.getBoundingClientRect()

    const points = nodeRefs
      .map((ref) => {
        if (!ref?.current) return null
        const r = ref.current.getBoundingClientRect()
        return {
          x: r.left - trackRect.left + r.width / 2,
          top: r.top - trackRect.top,
          bottom: r.top - trackRect.top + r.height,
          cy: r.top - trackRect.top + r.height / 2,
        }
      })
      .filter(Boolean)

    if (points.length === 0) return

    let d = `M ${points[0].x} 0 L ${points[0].x} ${points[0].bottom}`

    for (let i = 0; i < points.length - 1; i++) {
      const cur = points[i]
      const nxt = points[i + 1]
      const midY = (cur.bottom + nxt.top) / 2
      // S-curve: both control points at the midpoint y, pulling toward each side
      d += ` C ${cur.x} ${midY}, ${nxt.x} ${midY}, ${nxt.x} ${nxt.top}`
      d += ` L ${nxt.x} ${nxt.bottom}`
    }

    const last = points[points.length - 1]
    d += ` L ${last.x} ${trackRect.height}`

    setPathData(d)
  })

  if (!pathData) return null

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="road-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8001C" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6B2FA0" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path d={pathData} fill="none" stroke="url(#road-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
