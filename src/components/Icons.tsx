import type { SVGProps } from 'react'

import type { ContactChannel } from '../content/types'

type IconProps = SVGProps<SVGSVGElement>

function Base({ children, ...props }: IconProps) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {children}
        </svg>
    )
}

export function SunIcon(props: IconProps) {
    return (
        <Base {...props}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </Base>
    )
}

export function MoonIcon(props: IconProps) {
    return (
        <Base {...props}>
            <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </Base>
    )
}

export function MenuIcon(props: IconProps) {
    return (
        <Base {...props}>
            <path d="M4 7h16M4 12h16M4 17h10" />
        </Base>
    )
}

export function CloseIcon(props: IconProps) {
    return (
        <Base {...props}>
            <path d="M6 6l12 12M18 6 6 18" />
        </Base>
    )
}

export function ArrowDownIcon(props: IconProps) {
    return (
        <Base {...props}>
            <path d="M12 4v16M5 13l7 7 7-7" />
        </Base>
    )
}

export function ExternalIcon(props: IconProps) {
    return (
        <Base {...props}>
            <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </Base>
    )
}

function MailIcon(props: IconProps) {
    return (
        <Base {...props}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </Base>
    )
}

function WhatsappIcon(props: IconProps) {
    return (
        <Base {...props}>
            <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3Z" />
            <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2Z" />
        </Base>
    )
}

function LinkedinIcon(props: IconProps) {
    return (
        <Base {...props}>
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
        </Base>
    )
}

export function GithubIcon(props: IconProps) {
    return (
        <Base {...props}>
            <path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
        </Base>
    )
}

function InstagramIcon(props: IconProps) {
    return (
        <Base {...props}>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <path d="M17.5 6.5v.01" />
        </Base>
    )
}

const channelIcons = {
    email: MailIcon,
    whatsapp: WhatsappIcon,
    linkedin: LinkedinIcon,
    github: GithubIcon,
    instagram: InstagramIcon,
}

export function ChannelIcon({ id, ...props }: IconProps & { id: ContactChannel['id'] }) {
    const Icon = channelIcons[id]
    return <Icon {...props} />
}
