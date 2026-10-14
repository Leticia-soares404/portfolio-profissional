import { useEffect, useRef, useState } from 'react'

import { usePreferences, type Theme } from '../lib/preferences'
import type { BackgroundHandle, BackgroundPalette } from './background-scene'

function readPalette(theme: Theme): BackgroundPalette {
    const css = getComputedStyle(document.documentElement)
    const token = (name: string) => css.getPropertyValue(name).trim()

    return {
        base: token('--fundo'),
        primary: token('--verde'),
        secondary: token('--roxo'),
        intensity: theme === 'dark' ? 0.5 : 0.28,
    }
}

export default function Background() {
    const { theme } = usePreferences()
    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<BackgroundHandle | null>(null)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let cancelled = false
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        import('./background-scene')
            .then(({ createBackgroundScene }) => {
                if (cancelled) return
                sceneRef.current = createBackgroundScene(
                    container,
                    readPalette(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'),
                    reducedMotion,
                )
            })
            .catch(() => setFailed(true))

        return () => {
            cancelled = true
            sceneRef.current?.destroy()
            sceneRef.current = null
        }
    }, [])

    useEffect(() => {
        sceneRef.current?.setPalette(readPalette(theme))
    }, [theme])

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 -z-10 h-lvh ${failed ? 'fundo-estatico' : 'bg-fundo'}`}
            aria-hidden="true"
        />
    )
}
