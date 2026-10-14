import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import { experiences } from '../content/data'
import { useReveal } from '../hooks/useReveal'
import { usePreferences } from '../lib/preferences'
import Section from './Section'
import SectionHeader from './SectionHeader'

export default function Experiences() {
    const { copy, locale } = usePreferences()
    const reveal = useReveal()
    const [open, setOpen] = useState<string | null>(experiences[0]?.id ?? null)

    return (
        <Section id="experiencias">
            <SectionHeader
                eyebrow={copy.experiences.eyebrow}
                titleLead={copy.experiences.titleLead}
                titleEmphasis={copy.experiences.titleEmphasis}
                accent="purple"
                lead={copy.experiences.lead}
            />

            <ul ref={reveal} className="mt-12 border-t border-borda">
                {experiences.map((item, i) => {
                    const expanded = open === item.id
                    const panelId = `exp-${item.id}`

                    return (
                        <li key={item.id} className="border-b border-borda">
                            <button
                                type="button"
                                aria-expanded={expanded}
                                aria-controls={panelId}
                                onClick={() => setOpen(expanded ? null : item.id)}
                                className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-6 text-left sm:gap-8"
                            >
                                <span
                                    className={`w-10 font-display text-2xl font-black transition-colors duration-500 sm:w-16 sm:text-4xl ${
                                        expanded ? 'text-roxo' : 'text-roxo/25 group-hover:text-roxo/60'
                                    }`}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </span>

                                <span className="min-w-0">
                                    <span className="block font-display text-[clamp(17px,2.2vw,24px)] font-black transition-transform duration-300 group-hover:translate-x-1.5">
                                        {item.organization}
                                    </span>
                                    <span className="mt-1 block font-grotesk text-sm text-suave">{item.role[locale]}</span>
                                </span>

                                <span className="flex flex-col items-end gap-2 text-right">
                                    <span className="text-[11px] tracking-[0.14em] text-texto uppercase">{item.period[locale]}</span>
                                    <span className="chip !py-0.5 !text-[10px]">{copy.experiences.kinds[item.kind]}</span>
                                </span>
                            </button>

                            <AnimatePresence initial={false}>
                                {expanded ? (
                                    <motion.div
                                        id={panelId}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <p className="max-w-[640px] pb-7 pl-[calc(2.5rem+1rem)] font-grotesk text-[15px] leading-[1.75] text-suave sm:pl-[calc(4rem+2rem)]">
                                            {item.description[locale]}
                                        </p>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </li>
                    )
                })}
            </ul>
        </Section>
    )
}
