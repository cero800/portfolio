import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { z } from 'zod'
import type { Locale } from '../../i18n/types'

const metaEnv = import.meta.env as Record<string, unknown>
const envOf = (key: string): string | undefined => {
  const val = (process.env as Record<string, string | undefined>)[key] ?? metaEnv[key]
  return typeof val === 'string' ? val : undefined
}

const resendKey = envOf('RESEND_API_KEY')
const resend = resendKey ? new Resend(resendKey) : null
const FROM = envOf('RESEND_FROM') || 'CERO <onboarding@resend.dev>'
const TO = envOf('RESEND_EMAIL_TO') || ''

export const prerender = false

const MAX_PER_WINDOW = 3
const WINDOW_MS = 60 * 60 * 1000
const rate = new Map<string, { count: number; resetAt: number }>()

interface ContactMessages {
  requiredName: string
  longName: string
  invalidEmail: string
  requiredMessage: string
  longMessage: string
  notConfigured: string
  invalidBody: string
  invalidData: string
  rateLimited: string
  sendFailed: string
  subject: string
  emailLabel: string
  footer: string
}

const MESSAGES: Record<Locale, ContactMessages> = {
  es: {
    requiredName: 'Escribe tu nombre.',
    longName: 'Nombre demasiado largo.',
    invalidEmail: 'Email no válido.',
    requiredMessage: 'Escribe un mensaje.',
    longMessage: 'Mensaje demasiado largo.',
    notConfigured: 'Email no configurado en el servidor.',
    invalidBody: 'Body inválido.',
    invalidData: 'Datos inválidos.',
    rateLimited: 'Demasiados envíos, intenta más tarde.',
    sendFailed: 'No se pudo enviar el correo.',
    subject: '[Portfolio] Mensaje de',
    emailLabel: 'Nombre:',
    footer: 'Responde a este correo desde tu gestor habitual (reply-to).',
  },
  en: {
    requiredName: 'Please enter your name.',
    longName: 'Name is too long.',
    invalidEmail: 'Invalid email.',
    requiredMessage: 'Please enter a message.',
    longMessage: 'Message is too long.',
    notConfigured: 'Email service is not configured on the server.',
    invalidBody: 'Invalid body.',
    invalidData: 'Invalid data.',
    rateLimited: 'Too many requests, try again later.',
    sendFailed: 'Could not send the email.',
    subject: '[Portfolio] Message from',
    emailLabel: 'Name:',
    footer: 'Reply to this email from your usual mail client (reply-to).',
  },
}

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  message: z.string().trim().min(1).max(4000),
  website: z.string().optional(),
  lang: z.enum(['es', 'en']).optional().default('es'),
})

function checkRate(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = rate.get(ip)
  if (!entry || entry.resetAt < now) {
    rate.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true }
  }
  if (entry.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  entry.count += 1
  return { ok: true }
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ ok: false, error: MESSAGES.es.invalidBody }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const lang: Locale = (body as { lang?: unknown })?.lang === 'en' ? 'en' : 'es'
  const m = MESSAGES[lang]

  if (!resend || !TO) {
    return new Response(JSON.stringify({ ok: false, error: m.notConfigured }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const field = issue?.path[0]
    let error = m.invalidData
    if (field === 'name') error = issue?.code === 'too_big' ? m.longName : m.requiredName
    else if (field === 'email') error = m.invalidEmail
    else if (field === 'message') error = issue?.code === 'too_big' ? m.longMessage : m.requiredMessage
    return new Response(JSON.stringify({ ok: false, error }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { name, email, message, website } = parsed.data
  if (website) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  if (/\r|\n/.test(name) || /\r|\n/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: m.invalidData }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  const rl = checkRate(ip)
  if (!rl.ok) {
    return new Response(JSON.stringify({ ok: false, error: m.rateLimited }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rl.retryAfter),
      },
    })
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `${m.subject} ${name.slice(0, 80)}`,
      text: [
        `${m.emailLabel} ${name}`,
        `Email: ${email}`,
        '-----------------------------',
        message,
        '-----------------------------',
        m.footer,
      ].join('\n'),
    })
    if (error) {
      console.error('resend error:', error)
      return new Response(JSON.stringify({ ok: false, error: m.sendFailed }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (err) {
    console.error('resend error:', err)
    return new Response(JSON.stringify({ ok: false, error: m.sendFailed }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
