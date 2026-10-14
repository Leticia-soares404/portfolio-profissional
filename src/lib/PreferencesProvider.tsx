import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { getCopy } from '../content/copy'
import type { Locale } from '../content/types'
import { PreferencesContext, readStored, writeStored, type Theme } from './preferences'

const LOCALE_KEY = 'portfolio:locale'
const THEME_KEY = 'portfolio:theme'

function initialLocale(): Locale {
    const stored = readStored(LOCALE_KEY)

    if (stored === 'pt-BR' || stored === 'en') {
        return stored
    }

    return navigator.language.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en'
}

/* O index.html já carimbou o tema antes da primeira pintura; aqui só lemos. */
function initialTheme(): Theme {
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/*
 * Aplicado no próprio clique, não num effect: effects dos filhos rodam antes
 * dos do provider, e o fundo leria as cores do tema anterior.
 */
function applyTheme(theme: Theme): void {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', theme === 'dark' ? '#0b1210' : '#f3efe6')
}

export default function PreferencesProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>(initialLocale)
    const [theme, setTheme] = useState<Theme>(initialTheme)

    const copy = useMemo(() => getCopy(locale), [locale])

    useEffect(() => {
        document.documentElement.lang = locale
        document.title = copy.metaTitle
        document
            .querySelector('meta[name="description"]')
            ?.setAttribute('content', copy.metaDescription)
    }, [locale, copy])

    const toggleLocale = useCallback(() => {
        setLocale((current) => {
            const next = current === 'pt-BR' ? 'en' : 'pt-BR'
            writeStored(LOCALE_KEY, next)
            return next
        })
    }, [])

    const toggleTheme = useCallback(() => {
        const next = theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        writeStored(THEME_KEY, next)
        setTheme(next)
    }, [theme])

    const value = useMemo(
        () => ({ locale, copy, toggleLocale, theme, toggleTheme }),
        [locale, copy, toggleLocale, theme, toggleTheme],
    )

    return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}
