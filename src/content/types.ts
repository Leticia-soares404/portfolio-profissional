export type Locale = 'pt-BR' | 'en'

export type Localized<T = string> = Record<Locale, T>

export type Project = {
    id: string
    year: number
    name: string
    description: Localized
    tech: readonly string[]
    repo: string
    live?: string
    media?: string
}

export type Experience = {
    id: string
    organization: string
    role: Localized
    period: Localized
    description: Localized
    kind: 'work' | 'education' | 'event' | 'open-source'
}

export type ContactChannel = {
    id: 'email' | 'whatsapp' | 'linkedin' | 'github' | 'instagram'
    label: string
    href: string
    handle: string
}

export type SectionId = 'sobre' | 'projetos' | 'experiencias' | 'contato'

export type Copy = {
    metaTitle: string
    metaDescription: string
    nav: Record<SectionId, string>
    a11y: {
        menu: string
        close: string
        theme: Record<'light' | 'dark', string>
        language: string
    }
    hero: {
        eyebrow: string
        title: string
        lead: string
        primaryCta: string
        secondaryCta: string
        hint: string
        scrollCue: string
    }
    about: {
        eyebrow: string
        titleLead: string
        titleEmphasis: string
        bio: readonly string[]
        photoAlt: string
        facts: readonly { label: string; value: string }[]
        skillsLabel: string
    }
    projects: {
        eyebrow: string
        titleLead: string
        titleEmphasis: string
        lead: string
        filterAll: string
        repo: string
        live: string
        open: string
        empty: string
    }
    experiences: {
        eyebrow: string
        titleLead: string
        titleEmphasis: string
        lead: string
        kinds: Record<Experience['kind'], string>
    }
    contact: {
        eyebrow: string
        titleLead: string
        titleEmphasis: string
        lead: string
        form: {
            name: string
            email: string
            message: string
            submit: string
            sending: string
            sent: string
            failed: string
            notConfigured: string
            errors: {
                nameRequired: string
                emailRequired: string
                emailInvalid: string
                messageRequired: string
                messageShort: string
            }
        }
    }
    footer: {
        tagline: string
        backToTop: string
        builtWith: string
    }
    cursor: {
        open: string
    }
}
