import { useEffect, useState } from 'react'

import type { SectionId } from '../content/types'

/* A seção ativa é a que cruza a faixa logo abaixo do cabeçalho. */
export function useActiveSection(ids: readonly SectionId[]): SectionId | null {
    const [active, setActive] = useState<SectionId | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id as SectionId)
                    }
                })
            },
            { rootMargin: '-40% 0px -55% 0px' },
        )

        ids.forEach((id) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [ids])

    return active
}
