import { useEffect, useState } from 'react'

function starPoints(cx, cy, outerR, innerR, n = 5) {
  const pts = []
  for (let i = 0; i < n * 2; i++) {
    const angle = (i * Math.PI / n) - Math.PI / 2
    const r = i % 2 === 0 ? outerR : innerR
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`)
  }
  return pts.join(' ')
}

export default function RoadPath({ nodeRefs, trackRef }) {
  const [scene, setScene] = useState(null) // { d, endX, endY }

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
        }
      })
      .filter(Boolean)

    if (points.length === 0) return

    let d = `M ${points[0].x} 0 L ${points[0].x} ${points[0].bottom}`

    for (let i = 0; i < points.length - 1; i++) {
      const cur = points[i]
      const nxt = points[i + 1]
      const midY = (cur.bottom + nxt.top) / 2
      d += ` C ${cur.x} ${midY}, ${nxt.x} ${midY}, ${nxt.x} ${nxt.top}`
      d += ` L ${nxt.x} ${nxt.bottom}`
    }

    const last = points[points.length - 1]
    const endY = last.bottom + 28 // stop just above the star centre
    d += ` L ${last.x} ${endY}`

    setScene({ d, endX: last.x, endY: endY + 16 })
  })

  if (!scene) return null

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
        <filter id="star-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <path d={scene.d} fill="none" stroke="url(#road-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      <polygon
        points={starPoints(scene.endX, scene.endY, 16, 7)}
        fill="#FFD700"
        filter="url(#star-glow)"
        opacity="0.95"
      />
    </svg>
  )
}
