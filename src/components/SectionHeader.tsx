import { useReveal } from '../hooks/useReveal'

type SectionHeaderProps = {
    eyebrow: string
    titleLead: string
    titleEmphasis: string
    accent: 'green' | 'purple'
    lead?: string
}

export default function SectionHeader({ eyebrow, titleLead, titleEmphasis, accent, lead }: SectionHeaderProps) {
    const reveal = useReveal()

    const destaque = accent === 'purple' ? 'text-roxo' : 'text-verde'
    const suave = accent === 'purple' ? 'text-roxo-claro' : 'text-verde-claro'

    return (
        <>
            <div ref={reveal} className={`eyebrow ${suave}`}>
                {eyebrow}
            </div>

            <h2 ref={reveal} className="titulo">
                {titleLead} <em className={destaque}>{titleEmphasis}</em>
            </h2>

            {lead ? (
                <p ref={reveal} className="lead">
                    {lead}
                </p>
            ) : null}
        </>
    )
}
