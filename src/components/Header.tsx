import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'

import { sections as SECTIONS } from '../content/data'
import { useActiveSection } from '../hooks/useActiveSection'
import { usePreferences } from '../lib/preferences'
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons'

function Controls() {
    const { copy, locale, toggleLocale, theme, toggleTheme } = usePreferences()
    const nextTheme = theme === 'dark' ? 'light' : 'dark'

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={toggleLocale}
                aria-label={copy.a11y.language}
                className="relative grid h-9 w-14 grid-cols-2 place-items-center overflow-hidden rounded-full border border-borda text-[10px] font-bold tracking-[0.12em]"
            >
                <motion.span
                    className="absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-verde"
                    animate={{ x: locale === 'pt-BR' ? 0 : '100%' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                />
                <span className={`relative ${locale === 'pt-BR' ? 'text-fundo' : 'text-suave'}`}>PT</span>
                <span className={`relative ${locale === 'en' ? 'text-fundo' : 'text-suave'}`}>EN</span>
            </button>

            <button
                type="button"
                onClick={toggleTheme}
                aria-label={copy.a11y.theme[nextTheme]}
                className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-borda text-texto transition-colors hover:border-verde hover:text-verde"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={theme}
                        initial={{ y: 18, rotate: -90, opacity: 0 }}
                        animate={{ y: 0, rotate: 0, opacity: 1 }}
                        exit={{ y: -18, rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {theme === 'dark' ? <SunIcon width={17} /> : <MoonIcon width={17} />}
                    </motion.span>
                </AnimatePresence>
            </button>
        </div>
    )
}

export default function Header() {
    const { copy } = usePreferences()
    const active = useActiveSection(SECTIONS)
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const { scrollYProgress } = useScroll()
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (!open) return
        const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
                scrolled || open ? 'agua border-b border-borda' : 'border-b border-transparent'
            }`}
        >
            <div className="mx-auto flex h-[68px] max-w-[1120px] items-center justify-between gap-4 px-5 sm:px-8">
                <a href="#topo" className="font-display text-lg font-black tracking-tight" onClick={() => setOpen(false)}>
                    ls<span className="text-verde">.</span>
                </a>

                <nav className="hidden md:block" aria-label="principal">
                    <ul className="flex items-center gap-1">
                        {SECTIONS.map((id) => (
                            <li key={id}>
                                <a
                                    href={`#${id}`}
                                    className={`relative rounded-full px-3.5 py-2 text-[11px] tracking-[0.16em] uppercase transition-colors ${
                                        active === id ? 'text-texto' : 'text-suave hover:text-texto'
                                    }`}
                                >
                                    {active === id ? (
                                        <motion.span
                                            layoutId="nav-ativo"
                                            className="absolute inset-0 -z-10 rounded-full border border-verde/50 bg-verde/10"
                                            transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                                        />
                                    ) : null}
                                    {copy.nav[id]}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-2">
                    <Controls />
                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-full border border-borda md:hidden"
                        aria-label={open ? copy.a11y.close : copy.a11y.menu}
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <CloseIcon width={18} /> : <MenuIcon width={18} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open ? (
                    <motion.nav
                        className="overflow-hidden border-t border-borda md:hidden"
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        aria-label="principal"
                    >
                        <ul className="grid gap-1 px-5 py-5">
                            {SECTIONS.map((id, i) => (
                                <motion.li
                                    key={id}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                >
                                    <a
                                        href={`#${id}`}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-baseline gap-3 py-2 font-display text-2xl font-black ${
                                            active === id ? 'text-verde' : 'text-texto'
                                        }`}
                                    >
                                        <span className="font-mono text-[11px] font-normal text-suave">0{i + 1}</span>
                                        {copy.nav[id]}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.nav>
                ) : null}
            </AnimatePresence>

            <motion.div
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-verde"
                style={{ scaleX: progress }}
                aria-hidden="true"
            />
        </header>
    )
}
