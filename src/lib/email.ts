import emailjs from '@emailjs/browser'

export type ContactMessage = {
    name: string
    email: string
    message: string
}

const config = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
}

export function isEmailConfigured(): boolean {
    return Boolean(config.serviceId && config.templateId && config.publicKey)
}

/* Os nomes dos parâmetros precisam bater com as variáveis do template no EmailJS. */
export async function sendContactMessage(data: ContactMessage): Promise<void> {
    if (!isEmailConfigured()) {
        throw new Error('EmailJS não configurado')
    }

    await emailjs.send(
        config.serviceId!,
        config.templateId!,
        { from_name: data.name, reply_to: data.email, message: data.message },
        { publicKey: config.publicKey! },
    )
}
