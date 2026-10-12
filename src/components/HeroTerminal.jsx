import { useEffect, useRef, useState } from 'react'
import { usePreferences } from '../context/PreferencesContext.jsx'
import { profile } from '../data/content.js'
import { skills } from '../data/skills.js'
import { projects } from '../data/projects.js'

const PROMPT = 'manoel@datacenter:~$'

const text = {
  pt: {
    hint: 'digite "ajuda"',
    label: 'Terminal interativo. Digite um comando, como ajuda.',
    intro: [
      { cmd: 'whoami', out: 'Manoel Neto: Engenharia de Software (PUC Minas) e Infraestrutura em Datacenter' },
      { cmd: 'uptime', out: '● online desde 2024 · Belo Horizonte, MG' },
    ],
    help: [
      'sobre        quem sou eu',
      'skills       tecnologias que uso',
      'projetos     lista de projetos',
      'experiencia  estágios e formação',
      'contato      e-mail, WhatsApp e LinkedIn',
      'cv           baixar currículo',
      'tema         alternar claro/escuro',
      'idioma       mudar para inglês',
      'limpar       limpar a tela',
    ],
    unknown: (c) => `comando não encontrado: ${c}. Digite "ajuda".`,
    going: (s) => `abrindo ${s}…`,
    theme: 'tema alterado ✔',
    lang: 'language: english ✔',
    cv: 'baixando currículo…',
    sudo: 'permissão negada. Mas dá pra me contratar 😉',
    ping: 'PING manoel: resposta em 1ms. Pode chamar no contato!',
  },
  en: {
    hint: 'type "help"',
    label: 'Interactive terminal. Type a command, such as help.',
    intro: [
      { cmd: 'whoami', out: 'Manoel Neto: Software Engineering (PUC Minas) and Datacenter Infrastructure' },
      { cmd: 'uptime', out: '● online since 2024 · Belo Horizonte, Brazil' },
    ],
    help: [
      'about        who I am',
      'skills       technologies I use',
      'projects     project list',
      'experience   internships and education',
      'contact      email, WhatsApp and LinkedIn',
      'cv           download résumé',
      'theme        toggle light/dark',
      'lang         switch to Portuguese',
      'clear        clear the screen',
    ],
    unknown: (c) => `command not found: ${c}. Type "help".`,
    going: (s) => `opening ${s}…`,
    theme: 'theme switched ✔',
    lang: 'idioma: português ✔',
    cv: 'downloading résumé…',
    sudo: 'permission denied. But you can hire me 😉',
    ping: 'PING manoel: reply in 1ms. Reach out in contact!',
  },
}

const ALIASES = {
  ajuda: 'help', help: 'help', '?': 'help',
  sobre: 'about', about: 'about', whoami: 'about',
  skills: 'skills', habilidades: 'skills',
  projetos: 'projects', projects: 'projects', ls: 'projects',
  experiencia: 'experience', experiencias: 'experience', 'experiência': 'experience', experience: 'experience',
  contato: 'contact', contact: 'contact',
  cv: 'cv', curriculo: 'cv', 'currículo': 'cv', resume: 'cv',
  tema: 'theme', theme: 'theme',
  idioma: 'lang', lang: 'lang', language: 'lang',
  limpar: 'clear', clear: 'clear', cls: 'clear',
  sudo: 'sudo', ping: 'ping',
}

const SECTIONS = {
  about: 'sobre',
  skills: 'habilidades',
  projects: 'projetos',
  experience: 'experiencias',
  contact: 'contato',
}

function scrollTo(id) {
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 450)
}

export default function HeroTerminal() {
  const { lang, toggleTheme, toggleLang } = usePreferences()
  const tx = text[lang]
  const [lines, setLines] = useState([])
  const [typing, setTyping] = useState('')
  const [booted, setBooted] = useState(false)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [cursor, setCursor] = useState(-1)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  // Animação de abertura: digita os comandos iniciais uma única vez
  useEffect(() => {
    const intro = text[lang].intro
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setLines(intro.flatMap((i) => [{ type: 'cmd', text: i.cmd }, { type: 'out', text: i.out }]))
      setBooted(true)
      return undefined
    }
    let cancelled = false
    const timers = []
    const wait = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)))
    ;(async () => {
      await wait(500)
      for (const item of intro) {
        for (let i = 1; i <= item.cmd.length; i++) {
          if (cancelled) return
          setTyping(item.cmd.slice(0, i))
          await wait(70)
        }
        await wait(250)
        if (cancelled) return
        setTyping('')
        setLines((l) => [...l, { type: 'cmd', text: item.cmd }, { type: 'out', text: item.out }])
        await wait(350)
      }
      if (!cancelled) setBooted(true)
    })()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
    // A animação roda só na primeira carga
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines, typing])

  const run = (raw) => {
    const input = raw.trim()
    if (!input) return
    const cmd = ALIASES[input.toLowerCase().split(/\s+/)[0]]
    const echo = { type: 'cmd', text: input }
    let out = []

    switch (cmd) {
      case 'help':
        out = tx.help
        break
      case 'clear':
        setLines([])
        return
      case 'skills':
        out = [skills.map((s) => s.name).join(' · '), tx.going('skills')]
        scrollTo(SECTIONS.skills)
        break
      case 'projects':
        out = [...projects.map((p) => `▸ ${p.name} (${p.period})`), tx.going(lang === 'pt' ? 'projetos' : 'projects')]
        scrollTo(SECTIONS.projects)
        break
      case 'about':
      case 'experience':
        out = [tx.going(input.toLowerCase())]
        scrollTo(SECTIONS[cmd])
        break
      case 'contact':
        out = [`✉ ${profile.email}`, `☎ ${profile.phoneDisplay}`, tx.going(lang === 'pt' ? 'contato' : 'contact')]
        scrollTo(SECTIONS.contact)
        break
      case 'cv': {
        out = [tx.cv]
        const a = document.createElement('a')
        a.href = profile.cv
        a.download = ''
        a.click()
        break
      }
      case 'theme':
        toggleTheme()
        out = [tx.theme]
        break
      case 'lang':
        out = [tx.lang]
        toggleLang()
        break
      case 'sudo':
        out = [tx.sudo]
        break
      case 'ping':
        out = [tx.ping]
        break
      default:
        out = [tx.unknown(input)]
    }
    setLines((l) => [...l, echo, ...out.map((o) => ({ type: 'out', text: o }))].slice(-40))
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(value)
      if (value.trim()) setHistory((h) => [value, ...h].slice(0, 20))
      setValue('')
      setCursor(-1)
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const next = Math.min(cursor + 1, history.length - 1)
      setCursor(next)
      setValue(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = cursor - 1
      setCursor(next)
      setValue(next >= 0 ? history[next] : '')
    }
  }

  return (
    <div className="term" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="term__bar" aria-hidden="true">
        <span className="term__led" />
        <span className="term__led" />
        <span className="term__led" />
        <span className="term__title">ssh manoel@datacenter</span>
      </div>
      <div className="term__body" ref={bodyRef}>
        {lines.map((l, i) =>
          l.type === 'cmd' ? (
            <p key={i} className="term__line">
              <span className="term__prompt">{PROMPT}</span> {l.text}
            </p>
          ) : (
            <p key={i} className="term__line term__out">{l.text}</p>
          ),
        )}
        {booted ? (
          <label className="term__line term__input-row">
            <span className="term__prompt">{PROMPT}</span>
            <input
              ref={inputRef}
              className="term__input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={tx.hint}
              aria-label={tx.label}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </label>
        ) : (
          <p className="term__line">
            <span className="term__prompt">{PROMPT}</span> {typing}
            <span className="term__caret" aria-hidden="true" />
          </p>
        )}
      </div>
    </div>
  )
}
