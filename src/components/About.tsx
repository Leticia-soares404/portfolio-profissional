import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { PointerEvent } from 'react'

import { skills } from '../content/data'
import { useReveal } from '../hooks/useReveal'
import { usePreferences } from '../lib/preferences'
import Section from './Section'
import SectionHeader from './SectionHeader'

/* Foto inclina seguindo o ponteiro; o brilho só existe durante o hover, senão pousaria no rosto. */
function TiltPhoto({ alt }: { alt: string }) {
    const x = useMotionValue(0.5)
    const y = useMotionValue(0.5)
    const rotateX = useSpring(useTransform(y, [0, 1], [10, -10]), { stiffness: 200, damping: 18 })
    const rotateY = useSpring(useTransform(x, [0, 1], [-12, 12]), { stiffness: 200, damping: 18 })
    const glare = useTransform(
        [x, y],
        ([gx, gy]: number[]) =>
            `radial-gradient(circle at ${gx * 100}% ${gy * 100}%, rgba(255,255,255,0.28), transparent 55%)`,
    )
    const glareOpacity = useSpring(0, { stiffness: 160, damping: 24 })

    function onMove(event: PointerEvent<HTMLDivElement>): void {
        if (event.pointerType !== 'mouse') return
        const rect = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - rect.left) / rect.width)
        y.set((event.clientY - rect.top) / rect.height)
        glareOpacity.set(1)
    }

    function onLeave(): void {
        x.set(0.5)
        y.set(0.5)
        glareOpacity.set(0)
    }

    return (
        <div className="[perspective:900px]" onPointerMove={onMove} onPointerLeave={onLeave}>
            <motion.div
                className="relative overflow-hidden rounded-[22px] border border-borda shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]"
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            >
                <img
                    src="/leticia.jpg"
                    alt={alt}
                    width="1024"
                    height="1024"
                    loading="lazy"
                    decoding="async"
                    className="block aspect-square w-full object-cover"
                />
                <motion.div className="pointer-events-none absolute inset-0" style={{ background: glare, opacity: glareOpacity }} />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-verde to-roxo" />
            </motion.div>
        </div>
    )
}

export default function About() {
    const { copy, locale } = usePreferences()
    const { about } = copy
    const reveal = useReveal()

    return (
        <Section id="sobre">
            <SectionHeader
                eyebrow={about.eyebrow}
                titleLead={about.titleLead}
                titleEmphasis={about.titleEmphasis}
                accent="purple"
            />

            <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14">
                <div ref={reveal} className="mx-auto w-full max-w-[320px]">
                    <TiltPhoto alt={about.photoAlt} />
                </div>

                <div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={locale}
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.35 }}
                            className="space-y-4"
                        >
                            {about.bio.map((paragraph) => (
                                <p key={paragraph} className="font-grotesk text-[16.5px] leading-[1.75] text-suave">
                                    {paragraph}
                                </p>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    <dl ref={reveal} className="mt-10 grid gap-px overflow-hidden rounded-[18px] border border-borda bg-borda sm:grid-cols-2">
                        {about.facts.map((fact) => (
                            <div key={fact.label} className="painel px-5 py-4">
                                <dt className="text-[10px] tracking-[0.22em] text-roxo-claro uppercase">{fact.label}</dt>
                                <dd className="mt-1.5 font-grotesk text-[15px] text-texto">{fact.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <div ref={reveal} className="mt-10">
                        <p className="mb-4 text-[11px] tracking-[0.2em] text-suave uppercase">{about.skillsLabel}</p>
                        <ul className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <motion.li
                                    key={skill}
                                    className="chip cursor-default hover:border-verde hover:text-verde"
                                    whileHover={{ y: -4, rotate: i % 2 ? 3 : -3 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                >
                                    {skill}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Section>
    )
}
