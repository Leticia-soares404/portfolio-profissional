import { motion, useScroll, useTransform } from 'motion/react'

import { usePreferences } from '../lib/preferences'
import { useMagnetic } from '../hooks/useMagnetic'
import { ArrowDownIcon } from './Icons'

/* Cada letra pula sozinha no hover: agacha, sobe e amassa ao cair, como o sapo do Rana. */
function JumpingWord({ text, className, delay }: { text: string; className?: string; delay: number }) {
    return (
        <span className={`inline-flex ${className ?? ''}`} aria-hidden="true">
            {[...text].map((char, i) => (
                <motion.span
                    key={`${char}-${i}`}
                    className="inline-block origin-bottom"
                    initial={{ opacity: 0, y: -60, rotate: -8 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: delay + i * 0.045, type: 'spring', stiffness: 420, damping: 18 }}
                    whileHover={{
                        y: [0, 4, -26, 0, 0],
                        scaleX: [1, 1.14, 0.92, 1.1, 1],
                        scaleY: [1, 0.84, 1.12, 0.9, 1],
                        transition: { duration: 0.6, ease: 'easeInOut' },
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    )
}

export default function Hero() {
    const { copy, locale } = usePreferences()
    const { hero } = copy
    const magnetic = useMagnetic<HTMLAnchorElement>(0.25)

    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 520], [1, 0])
    const y = useTransform(scrollY, [0, 520], [0, -80])

    return (
        <section id="topo" className="relative grid min-h-svh grid-rows-[1fr_auto] px-5 pt-[68px] sm:px-8">
            <motion.div style={{ opacity, y }} className="mx-auto flex w-full max-w-[1120px] flex-col justify-center py-16">
                <p className="eyebrow text-verde-claro">{hero.eyebrow}</p>

                <h1 className="font-display leading-[0.92] font-black tracking-[-0.04em]">
                    <span className="sr-only">Letícia Soares</span>
                    <JumpingWord text="letícia" className="block text-[clamp(52px,13vw,148px)]" delay={0.1} />
                    <span className="flex items-baseline text-[clamp(52px,13vw,148px)]">
                        <JumpingWord text="soares" className="text-verde" delay={0.45} />
                        <motion.span
                            className="ml-1 inline-block h-[0.16em] w-[0.16em] rounded-full bg-roxo"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.9, type: 'spring', stiffness: 500, damping: 12 }}
                            aria-hidden="true"
                        />
                    </span>
                </h1>

                <motion.div
                    key={locale}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                >
                    <p className="mt-8 max-w-[22ch] font-display text-[clamp(20px,2.6vw,30px)] leading-[1.25] font-bold">
                        {hero.title}
                    </p>
                    <p className="mt-4 max-w-[46ch] font-grotesk text-[clamp(15px,1.6vw,18px)] leading-[1.6] text-suave">
                        {hero.lead}
                    </p>

                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <a
                            ref={magnetic}
                            href="#projetos"
                            className="inline-flex items-center gap-2 rounded-full bg-verde px-6 py-3.5 text-xs font-bold tracking-[0.16em] text-fundo uppercase transition-shadow hover:shadow-[0_0_0_6px_color-mix(in_srgb,var(--verde)_25%,transparent)]"
                        >
                            {hero.primaryCta}
                        </a>
                        <a href="#contato" className="link-sublinhado text-xs tracking-[0.16em] uppercase">
                            {hero.secondaryCta}
                        </a>
                    </div>

                    <p className="mt-10 hidden text-[11px] tracking-[0.18em] text-suave uppercase [@media(pointer:fine)]:block">
                        ✦ {hero.hint}
                    </p>
                </motion.div>
            </motion.div>

            <motion.a
                href="#sobre"
                style={{ opacity }}
                className="mx-auto mb-8 flex flex-col items-center gap-2 text-[11px] tracking-[0.2em] text-suave uppercase transition-colors hover:text-verde"
            >
                {hero.scrollCue}
                <ArrowDownIcon width={16} className="animate-cue" />
            </motion.a>
        </section>
    )
}
