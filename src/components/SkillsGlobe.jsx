import { useEffect, useMemo, useRef, useState } from 'react'

// Distribui N pontos uniformemente na superfície de uma esfera (espiral de Fibonacci)
function fibonacciSphere(count) {
  const points = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r })
  }
  return points
}

/**
 * Globo 3D de habilidades: os ícones giram sozinhos e podem ser arrastados
 * com mouse ou dedo (com inércia). Respeita "prefers-reduced-motion".
 */
export default function SkillsGlobe({ skills }) {
  const stageRef = useRef(null)
  const itemRefs = useRef([])
  const [hovered, setHovered] = useState(null)
  const points = useMemo(() => fibonacciSphere(skills.length), [skills.length])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const BASE = reduceMotion ? 0 : 0.0035
    const state = {
      rotX: -0.3,
      rotY: 0,
      velX: 0,
      velY: BASE,
      dragging: false,
      lastX: 0,
      lastY: 0,
      paused: false,
    }
    let frame

    const render = () => {
      const radius = stage.clientWidth * 0.4
      const cx = Math.cos(state.rotX)
      const sx = Math.sin(state.rotX)
      const cy = Math.cos(state.rotY)
      const sy = Math.sin(state.rotY)

      points.forEach((p, i) => {
        const el = itemRefs.current[i]
        if (!el) return
        // Rotação em Y e depois em X
        const x1 = p.x * cy + p.z * sy
        const z1 = -p.x * sy + p.z * cy
        const y2 = p.y * cx - z1 * sx
        const z2 = p.y * sx + z1 * cx
        const depth = (z2 + 1) / 2 // 0 = fundo, 1 = frente
        const scale = 0.55 + depth * 0.65
        el.style.transform = `translate(-50%, -50%) translate3d(${x1 * radius}px, ${y2 * radius}px, 0) scale(${scale})`
        el.style.opacity = String(0.2 + depth * 0.8)
        el.style.zIndex = String(Math.round(depth * 100))
        el.style.filter = depth < 0.35 ? 'blur(1px)' : 'none'
      })
    }

    const tick = () => {
      if (!state.dragging) {
        const target = state.paused ? 0 : BASE
        state.velY += (target - state.velY) * 0.03
        state.velX *= 0.95
        state.rotY += state.velY
        state.rotX += state.velX
      }
      render()
      frame = requestAnimationFrame(tick)
    }

    const onDown = (e) => {
      state.dragging = true
      state.lastX = e.clientX
      state.lastY = e.clientY
      stage.setPointerCapture?.(e.pointerId)
    }
    const onMove = (e) => {
      if (!state.dragging) return
      const dx = e.clientX - state.lastX
      const dy = e.clientY - state.lastY
      state.lastX = e.clientX
      state.lastY = e.clientY
      state.velY = dx * 0.006
      state.velX = -dy * 0.006
      state.rotY += state.velY
      state.rotX += state.velX
    }
    const onUp = () => {
      state.dragging = false
    }
    const onEnter = () => {
      state.paused = true
    }
    const onLeave = () => {
      state.paused = false
    }

    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onUp)
    stage.addEventListener('mouseenter', onEnter)
    stage.addEventListener('mouseleave', onLeave)
    tick()

    return () => {
      cancelAnimationFrame(frame)
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
      stage.removeEventListener('mouseenter', onEnter)
      stage.removeEventListener('mouseleave', onLeave)
    }
  }, [points])

  return (
    <div className="globe">
      <div ref={stageRef} className="globe__stage" aria-hidden="true">
        <div className="globe__halo" />
        {skills.map(({ name, Icon }, i) => (
          <span
            key={name}
            ref={(el) => (itemRefs.current[i] = el)}
            className={`globe__item ${hovered === name ? 'is-hovered' : ''}`}
            onPointerEnter={() => setHovered(name)}
            onPointerLeave={() => setHovered(null)}
            title={name}
          >
            <Icon />
          </span>
        ))}
      </div>
      <p className="globe__label" aria-live="polite">{hovered || '\u00A0'}</p>
    </div>
  )
}
