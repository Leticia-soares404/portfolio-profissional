import { AnimatePresence, LayoutGroup, motion, useScroll, useSpring } from 'motion/react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { projects } from '../content/data'
import type { Project } from '../content/types'
import { usePreferences } from '../lib/preferences'
import { ExternalIcon, GithubIcon } from './Icons'
import ProjectMedia from './ProjectMedia'
import ProjectModal from './ProjectModal'
import Section from './Section'
import SectionHeader from './SectionHeader'

const ALL = '__all__'

function TimelineItem({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
    const { copy, locale } = usePreferences()
    const left = index % 2 === 0

    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid gap-4 pl-10 md:grid-cols-2 md:gap-16 md:pl-0"
        >
            <motion.span
                className="absolute top-7 left-[11px] z-10 h-[11px] w-[11px] -translate-x-1/2 rounded-full border-2 border-verde bg-fundo md:left-1/2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-20% 0px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 14 }}
                aria-hidden="true"
            />

            <div className={`md:pt-5 ${left ? 'md:text-right' : 'md:order-2'}`}>
                <span className="font-display text-[clamp(32px,4vw,48px)] font-black text-verde/25">{project.year}</span>
            </div>

            <motion.article
                layoutId={`projeto-${project.id}`}
                className={`painel group overflow-hidden rounded-[20px] border border-borda ${left ? '' : 'md:order-1'}`}
                whileHover={{ y: -6 }}
            >
                <button
                    type="button"
                    onClick={onOpen}
                    data-cursor={copy.cursor.open}
                    aria-label={`${copy.projects.open}: ${project.name}`}
                    className="block w-full overflow-hidden"
                >
                    <ProjectMedia project={project} className="transition-transform duration-700 group-hover:scale-[1.04]" />
                </button>

                <div className="p-6">
                    <h3 className="font-display text-lg font-black">{project.name}</h3>
                    <p className="mt-2.5 font-grotesk text-[14.5px] leading-[1.7] text-suave">{project.description[locale]}</p>

                    <ul className="mt-4 flex flex-wrap gap-1.5">
                        {project.tech.map((tech) => (
                            <li key={tech} className="chip !px-2.5 !py-0.5 !text-[10px]">
                                {tech}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap gap-5 text-[11px] tracking-[0.14em] uppercase">
                        <a href={project.repo} target="_blank" rel="noreferrer" className="link-sublinhado inline-flex items-center gap-1.5">
                            <GithubIcon width={14} /> {copy.projects.repo}
                        </a>
                        {project.live ? (
                            <a href={project.live} target="_blank" rel="noreferrer" className="link-sublinhado inline-flex items-center gap-1.5">
                                <ExternalIcon width={14} /> {copy.projects.live}
                            </a>
                        ) : null}
                    </div>
                </div>
            </motion.article>
        </motion.li>
    )
}

export default function Projects() {
    const { copy } = usePreferences()
    const [filter, setFilter] = useState<string>(ALL)
    const [openId, setOpenId] = useState<string | null>(null)

    const listRef = useRef<HTMLOListElement>(null)
    const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 60%'] })
    const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

    const techs = useMemo(() => [...new Set(projects.flatMap((p) => p.tech))].sort(), [])
    const visible = filter === ALL ? projects : projects.filter((p) => p.tech.includes(filter))
    const opened = projects.find((p) => p.id === openId) ?? null
    const close = useCallback(() => setOpenId(null), [])

    return (
        <Section id="projetos">
            <SectionHeader
                eyebrow={copy.projects.eyebrow}
                titleLead={copy.projects.titleLead}
                titleEmphasis={copy.projects.titleEmphasis}
                accent="green"
                lead={copy.projects.lead}
            />

            <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="filtro">
                {[ALL, ...techs].map((tech) => {
                    const active = filter === tech
                    return (
                        <button
                            key={tech}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setFilter(tech)}
                            className={`chip relative ${active ? '!border-verde !text-fundo' : 'hover:!border-verde hover:!text-verde'}`}
                        >
                            {active ? (
                                <motion.span
                                    layoutId="filtro-ativo"
                                    className="absolute inset-0 -z-10 rounded-full bg-verde"
                                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                />
                            ) : null}
                            <span className="relative">{tech === ALL ? copy.projects.filterAll : tech}</span>
                        </button>
                    )
                })}
            </div>

            <LayoutGroup>
                <div className="relative mt-14">
                    <div className="absolute top-0 bottom-0 left-[11px] w-px bg-borda md:left-1/2" aria-hidden="true">
                        <motion.div className="h-full w-full origin-top bg-verde" style={{ scaleY: lineScale }} />
                    </div>

                    <ol ref={listRef} className="relative grid gap-14">
                        <AnimatePresence mode="popLayout">
                            {visible.map((project, i) => (
                                <TimelineItem key={project.id} project={project} index={i} onOpen={() => setOpenId(project.id)} />
                            ))}
                        </AnimatePresence>
                    </ol>

                    {visible.length === 0 ? <p className="lead mt-6">{copy.projects.empty}</p> : null}
                </div>

                {/* Portal: o backdrop-filter da seção prenderia o fixed dentro dela. */}
                {createPortal(
                    <AnimatePresence>{opened ? <ProjectModal project={opened} onClose={close} /> : null}</AnimatePresence>,
                    document.body,
                )}
            </LayoutGroup>
        </Section>
    )
}
