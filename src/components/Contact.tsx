import { contactChannels } from '../content/data'
import type { ContactChannel } from '../content/types'
import { useMagnetic } from '../hooks/useMagnetic'
import { useReveal } from '../hooks/useReveal'
import { usePreferences } from '../lib/preferences'
import ContactForm from './ContactForm'
import { ChannelIcon } from './Icons'
import Section from './Section'
import SectionHeader from './SectionHeader'

function ChannelLink({ channel }: { channel: ContactChannel }) {
    const magnetic = useMagnetic<HTMLAnchorElement>(0.35)
    const external = channel.id !== 'email'

    return (
        <a
            ref={magnetic}
            href={channel.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            className="painel group flex items-center gap-4 rounded-[16px] border border-borda px-4 py-3.5"
        >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-borda text-texto transition-colors group-hover:border-verde group-hover:bg-verde group-hover:text-fundo">
                <ChannelIcon id={channel.id} />
            </span>
            <span className="min-w-0">
                <span className="block text-[10px] tracking-[0.2em] text-suave uppercase">{channel.label}</span>
                <span className="block truncate font-grotesk text-[15px] text-texto">{channel.handle}</span>
            </span>
        </a>
    )
}

export default function Contact() {
    const { copy } = usePreferences()
    const reveal = useReveal()

    return (
        <Section id="contato">
            <SectionHeader
                eyebrow={copy.contact.eyebrow}
                titleLead={copy.contact.titleLead}
                titleEmphasis={copy.contact.titleEmphasis}
                accent="green"
                lead={copy.contact.lead}
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
                <ul ref={reveal} className="grid content-start gap-3">
                    {contactChannels.map((channel) => (
                        <li key={channel.id}>
                            <ChannelLink channel={channel} />
                        </li>
                    ))}
                </ul>

                <div ref={reveal}>
                    <ContactForm />
                </div>
            </div>
        </Section>
    )
}
