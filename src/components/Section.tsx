import type { ReactNode } from 'react'

import type { SectionId } from '../content/types'

export default function Section({ id, children }: { id: SectionId; children: ReactNode }) {
    return (
        <section id={id} className="agua relative py-20 lg:py-28">
            <div className="relative mx-auto max-w-[1120px] px-5 sm:px-8">{children}</div>
        </section>
    )
}
