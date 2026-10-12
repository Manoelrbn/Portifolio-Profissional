import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { FiDownload, FiMail, FiSend } from 'react-icons/fi'
import { usePreferences } from '../context/PreferencesContext.jsx'
import { profile } from '../data/content.js'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const initial = { name: '', email: '', message: '' }

// Retorna apenas os campos com erro; o texto vem do idioma ativo na hora de exibir
function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = true
  if (!EMAIL_RE.test(values.email.trim())) errors.email = true
  if (values.message.trim().length < 10) errors.message = true
  return errors
}

export default function Contact() {
  const { t } = usePreferences()
  const c = t.contact
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error | fallback

  const channels = [
    { label: 'E-mail', value: profile.email, href: `mailto:${profile.email}`, Icon: FiMail },
    { label: 'WhatsApp', value: profile.phoneDisplay, href: profile.whatsapp, Icon: FaWhatsapp },
    { label: 'LinkedIn', value: 'Manoel Rodrigues', href: profile.linkedin, Icon: FaLinkedinIn },
    { label: 'GitHub', value: 'Manoelrbn', href: profile.github, Icon: FaGithub },
  ]

  const onChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value }
    setValues(next)
    if (touched[e.target.name]) setErrors(validate(next))
  }

  const onBlur = (e) => {
    setTouched((v) => ({ ...v, [e.target.name]: true }))
    setErrors(validate(values))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched({ name: true, email: true, message: true })
    if (Object.keys(found).length) {
      document.getElementById(`f-${Object.keys(found)[0]}`)?.focus()
      return
    }

    // Sem credenciais do EmailJS: abre o app de e-mail com a mensagem preenchida
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      const subject = encodeURIComponent(`Contato pelo portfólio — ${values.name}`)
      const body = encodeURIComponent(`${values.message}\n\n${values.name} <${values.email}>`)
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      setStatus('fallback')
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: values.name.trim(),
          from_email: values.email.trim(),
          reply_to: values.email.trim(),
          message: values.message.trim(),
        },
        { publicKey: PUBLIC_KEY },
      )
      setStatus('success')
      setValues(initial)
      setTouched({})
    } catch (err) {
      console.error('EmailJS:', err)
      setStatus('error')
    }
  }

  const fieldProps = (name) => ({
    id: `f-${name}`,
    name,
    value: values[name],
    onChange,
    onBlur,
    'aria-invalid': Boolean(touched[name] && errors[name]),
    'aria-describedby': touched[name] && errors[name] ? `e-${name}` : undefined,
  })

  return (
    <section id="contato" className="section">
      <div className="container contact">
        <div className="contact__info">
          <h2 className="section__title">{c.title}</h2>
          <p className="section__intro">{c.intro}</p>
          <ul className="channels">
            {channels.map(({ label, value, href, Icon }) => (
              <li key={label}>
                <a href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" className="channel">
                  <span className="channel__icon"><Icon aria-hidden="true" /></span>
                  <span>
                    <strong>{label}</strong>
                    <span className="muted">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a href={profile.cv} download className="btn btn--ghost">
            <FiDownload aria-hidden="true" /> {t.hero.ctaCv}
          </a>
        </div>

        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="f-name">{c.name}</label>
            <input type="text" autoComplete="name" placeholder={c.namePh} {...fieldProps('name')} />
            {touched.name && errors.name && <p id="e-name" className="field__error">{c.errors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="f-email">{c.email}</label>
            <input type="email" autoComplete="email" placeholder={c.emailPh} {...fieldProps('email')} />
            {touched.email && errors.email && <p id="e-email" className="field__error">{c.errors.email}</p>}
          </div>
          <div className="field">
            <label htmlFor="f-message">{c.message}</label>
            <textarea rows="6" placeholder={c.messagePh} {...fieldProps('message')} />
            {touched.message && errors.message && <p id="e-message" className="field__error">{c.errors.message}</p>}
          </div>
          <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
            <FiSend aria-hidden="true" /> {status === 'sending' ? c.sending : c.send}
          </button>
          <p className={`form__status form__status--${status}`} role="status" aria-live="polite">
            {status === 'success' && c.success}
            {status === 'error' && c.error}
            {status === 'fallback' && c.notConfigured}
          </p>
        </form>
      </div>
    </section>
  )
}
