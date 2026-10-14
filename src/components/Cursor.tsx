import { useEffect, useRef, useState } from 'react'

const INTERACTIVE = 'a, button, [role="button"], label, select, [data-cursor]'
const TEXT = 'input, textarea'

type CursorState = 'idle' | 'hover' | 'text' | 'label'

/*
 * Ponto segue o ponteiro sem atraso (é ele que aponta); o anel vem atrás com
 * lerp para dar o rastro. O anel cresce sobre o que é clicável e, quando o alvo
 * tem data-cursor, mostra o rótulo dentro dele.
 */
export default function Cursor() {
    const [enabled, setEnabled] = useState(false)
    const [state, setState] = useState<CursorState>('idle')
    const [label, setLabel] = useState('')
    const [pressed, setPressed] = useState(false)
    const [visible, setVisible] = useState(false)

    const dotRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const query = window.matchMedia('(pointer: fine)')
        const sync = () => setEnabled(query.matches)
        sync()
        query.addEventListener('change', sync)
        return () => query.removeEventListener('change', sync)
    }, [])

    useEffect(() => {
        if (!enabled) return

        document.documentElement.classList.add('cursor-proprio')

        const pos = { x: -100, y: -100 }
        const ring = { x: -100, y: -100 }
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let frame = 0

        function onMove(event: PointerEvent): void {
            pos.x = event.clientX
            pos.y = event.clientY
            setVisible(true)

            const el = event.target as HTMLElement
            const labeled = el.closest<HTMLElement>('[data-cursor]')

            if (labeled) {
                setState('label')
                setLabel(labeled.dataset.cursor ?? '')
            } else if (el.closest(TEXT)) {
                setState('text')
            } else if (el.closest(INTERACTIVE)) {
                setState('hover')
            } else {
                setState('idle')
            }
        }

        function tick(): void {
            const ease = reduced ? 1 : 0.18
            ring.x += (pos.x - ring.x) * ease
            ring.y += (pos.y - ring.y) * ease

            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
            }

            frame = requestAnimationFrame(tick)
        }

        const onDown = () => setPressed(true)
        const onUp = () => setPressed(false)
        const onLeave = () => setVisible(false)

        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('pointerdown', onDown)
        window.addEventListener('pointerup', onUp)
        document.documentElement.addEventListener('pointerleave', onLeave)
        tick()

        return () => {
            cancelAnimationFrame(frame)
            document.documentElement.classList.remove('cursor-proprio')
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerdown', onDown)
            window.removeEventListener('pointerup', onUp)
            document.documentElement.removeEventListener('pointerleave', onLeave)
        }
    }, [enabled])

    if (!enabled) return null

    const ringSize = { idle: 34, hover: 58, text: 6, label: 84 }[state]
    const scale = pressed ? '0.8' : '1'

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300"
            style={{ opacity: visible ? 1 : 0 }}
            aria-hidden="true"
        >
            <div ref={ringRef} className="absolute top-0 left-0">
                <div
                    className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-[width,height,background-color,border-color,border-radius] duration-300 ease-out ${
                        state === 'label'
                            ? 'border-verde bg-verde text-fundo'
                            : state === 'hover'
                              ? 'border-verde bg-verde/10'
                              : 'border-texto/40'
                    }`}
                    style={{
                        width: ringSize,
                        height: state === 'text' ? 28 : ringSize,
                        borderRadius: state === 'text' ? 3 : 999,
                        scale,
                    }}
                >
                    {state === 'label' ? (
                        <span className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase">
                            {label}
                        </span>
                    ) : null}
                </div>
            </div>

            <div ref={dotRef} className="absolute top-0 left-0">
                <div
                    className={`h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-verde transition-opacity duration-200 ${
                        state === 'label' || state === 'text' ? 'opacity-0' : 'opacity-100'
                    }`}
                />
            </div>
        </div>
    )
}
