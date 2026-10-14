import { useCallback } from 'react'

let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
    observer ??= new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('on')
                    observer?.unobserve(entry.target)
                }
            })
        },
        { threshold: 0.15 },
    )

    return observer
}

export function useReveal() {
    return useCallback((el: HTMLElement | null) => {
        if (!el) {
            return
        }

        el.classList.add('revela')
        const io = getObserver()
        io.observe(el)

        return () => io.unobserve(el)
    }, [])
}
