import { useCallback } from 'react'

/*
 * Puxa o elemento na direção do ponteiro enquanto ele está por cima.
 * Só com mouse: no toque não existe "por cima" e o salto pareceria bug.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
    return useCallback(
        (el: T | null) => {
            if (!el || !window.matchMedia('(pointer: fine)').matches) return
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

            el.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'

            function onMove(event: PointerEvent): void {
                const rect = el!.getBoundingClientRect()
                const x = (event.clientX - rect.left - rect.width / 2) * strength
                const y = (event.clientY - rect.top - rect.height / 2) * strength
                el!.style.transform = `translate(${x}px, ${y}px)`
            }

            function onLeave(): void {
                el!.style.transform = ''
            }

            el.addEventListener('pointermove', onMove)
            el.addEventListener('pointerleave', onLeave)

            return () => {
                el.removeEventListener('pointermove', onMove)
                el.removeEventListener('pointerleave', onLeave)
            }
        },
        [strength],
    )
}
