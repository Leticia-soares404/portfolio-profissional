import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'

import type { Project } from '../content/types'
import { usePreferences } from '../lib/preferences'
import { CloseIcon, ExternalIcon, GithubIcon } from './Icons'
import ProjectMedia from './ProjectMedia'

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
    const { copy, locale } = usePreferences()
    const closeRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null
        closeRef.current?.focus()
        document.body.style.overflow = 'hidden'

        const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
        window.addEventListener('keydown', onKey)

        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKey)
            previous?.focus()
        }
    }, [onClose])

    return (
        <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby={`modal-${project.id}`}
                layoutId={`projeto-${project.id}`}
                className="relative max-h-[90svh] w-full max-w-[860px] overflow-y-auto rounded-[22px] border border-borda bg-superficie"
                onClick={(event) => event.stopPropagation()}
            >
                <ProjectMedia project={project} />

                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    aria-label={copy.a11y.close}
                    className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full border border-borda bg-superficie/90 transition-colors hover:border-verde hover:text-verde"
                >
                    <CloseIcon width={18} />
                </button>

                <div className="p-6 sm:p-8">
                    <p className="text-[11px] tracking-[0.2em] text-verde-claro uppercase">{project.year}</p>
                    <h3 id={`modal-${project.id}`} className="mt-2 font-display text-[clamp(22px,3vw,32px)] font-black">
                        {project.name}
                    </h3>
                    <p className="mt-4 font-grotesk text-base leading-[1.75] text-suave">{project.description[locale]}</p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                            <li key={tech} className="chip">
                                {tech}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap gap-5 text-xs tracking-[0.14em] uppercase">
                        <a href={project.repo} target="_blank" rel="noreferrer" className="link-sublinhado inline-flex items-center gap-2">
                            <GithubIcon width={16} /> {copy.projects.repo}
                        </a>
                        {project.live ? (
                            <a href={project.live} target="_blank" rel="noreferrer" className="link-sublinhado inline-flex items-center gap-2">
                                <ExternalIcon width={16} /> {copy.projects.live}
                            </a>
                        ) : null}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
