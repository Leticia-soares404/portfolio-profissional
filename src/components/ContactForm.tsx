import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { isEmailConfigured, sendContactMessage, type ContactMessage } from '../lib/email'
import { usePreferences } from '../lib/preferences'

type Status = 'idle' | 'sent' | 'failed' | 'not-configured'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Field({
    id,
    label,
    error,
    children,
}: {
    id: string
    label: string
    error?: string
    children: React.ReactNode
}) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-[11px] tracking-[0.2em] text-suave uppercase">
                {label}
            </label>
            {children}
            <AnimatePresence>
                {error ? (
                    <motion.p
                        id={`${id}-erro`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-2 font-grotesk text-[13px] text-alerta"
                        role="alert"
                    >
                        {error}
                    </motion.p>
                ) : null}
            </AnimatePresence>
        </div>
    )
}

const inputClass =
    'w-full rounded-[12px] border border-borda bg-fundo/60 px-4 py-3 font-grotesk text-[15px] text-texto outline-none transition-[border-color,box-shadow] placeholder:text-suave/60 focus:border-verde focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--verde)_18%,transparent)] aria-[invalid=true]:border-alerta'

export default function ContactForm() {
    const { copy } = usePreferences()
    const t = copy.contact.form
    const [status, setStatus] = useState<Status>('idle')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactMessage>({ mode: 'onTouched' })

    async function onSubmit(data: ContactMessage): Promise<void> {
        if (!isEmailConfigured()) {
            setStatus('not-configured')
            return
        }

        try {
            await sendContactMessage(data)
            setStatus('sent')
            reset()
        } catch {
            setStatus('failed')
        }
    }

    const feedback = {
        idle: null,
        sent: { text: t.sent, tone: 'text-verde' },
        failed: { text: t.failed, tone: 'text-alerta' },
        'not-configured': { text: t.notConfigured, tone: 'text-alerta' },
    }[status]

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="painel grid gap-5 rounded-[20px] border border-borda p-6 sm:p-8">
            <Field id="nome" label={t.name} error={errors.name?.message}>
                <input
                    id="nome"
                    autoComplete="name"
                    className={inputClass}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'nome-erro' : undefined}
                    {...register('name', { required: t.errors.nameRequired, validate: (v) => v.trim() !== '' || t.errors.nameRequired })}
                />
            </Field>

            <Field id="email" label={t.email} error={errors.email?.message}>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-erro' : undefined}
                    {...register('email', {
                        required: t.errors.emailRequired,
                        pattern: { value: EMAIL_PATTERN, message: t.errors.emailInvalid },
                    })}
                />
            </Field>

            <Field id="mensagem" label={t.message} error={errors.message?.message}>
                <textarea
                    id="mensagem"
                    rows={5}
                    className={`${inputClass} resize-y`}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'mensagem-erro' : undefined}
                    {...register('message', {
                        required: t.errors.messageRequired,
                        validate: (v) => v.trim().length >= 10 || t.errors.messageShort,
                    })}
                />
            </Field>

            <div className="flex flex-wrap items-center gap-4">
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 rounded-full bg-verde px-6 py-3.5 text-xs font-bold tracking-[0.16em] text-fundo uppercase transition-opacity disabled:opacity-60"
                >
                    {isSubmitting ? t.sending : t.submit}
                </motion.button>

                <AnimatePresence mode="wait">
                    {feedback ? (
                        <motion.p
                            key={status}
                            role="status"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className={`font-grotesk text-sm ${feedback.tone}`}
                        >
                            {feedback.text}
                        </motion.p>
                    ) : null}
                </AnimatePresence>
            </div>
        </form>
    )
}
