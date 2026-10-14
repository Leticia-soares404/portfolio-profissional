import type { Project } from '../content/types'

/* Sem imagem ainda: capa gerada com as iniciais, para a timeline não ficar com buraco. */
export default function ProjectMedia({ project, className = '' }: { project: Project; className?: string }) {
    if (project.media) {
        return (
            <img
                src={project.media}
                alt={project.name}
                loading="lazy"
                decoding="async"
                className={`block aspect-[1200/630] w-full object-cover ${className}`}
            />
        )
    }

    const initials = project.name
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')

    return (
        <div
            className={`grid aspect-[1200/630] w-full place-items-center bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--verde)_30%,transparent),transparent_60%),radial-gradient(circle_at_80%_80%,color-mix(in_srgb,var(--roxo)_30%,transparent),transparent_55%)] ${className}`}
            role="img"
            aria-label={project.name}
        >
            <span className="font-display text-5xl font-black text-texto/70 uppercase">{initials}</span>
        </div>
    )
}
