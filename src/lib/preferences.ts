import { createContext, useContext } from 'react'

import type { Copy, Locale } from '../content/types'

export type Theme = 'light' | 'dark'

export type Preferences = {
    locale: Locale
    copy: Copy
    toggleLocale: () => void
    theme: Theme
    toggleTheme: () => void
}

export const PreferencesContext = createContext<Preferences | null>(null)

export function usePreferences(): Preferences {
    const value = useContext(PreferencesContext)

    if (!value) {
        throw new Error('usePreferences precisa estar dentro de PreferencesProvider')
    }

    return value
}

/* Storage pode lançar em aba anônima ou com cookies bloqueados. */
export function readStored(key: string): string | null {
    try {
        return localStorage.getItem(key)
    } catch {
        return null
    }
}

export function writeStored(key: string, value: string): void {
    try {
        localStorage.setItem(key, value)
    } catch {
        /* preferência só vale para a sessão */
    }
}
