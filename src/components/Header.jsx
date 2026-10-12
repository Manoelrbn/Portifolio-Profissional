import { useEffect, useState } from 'react'
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi'
import { usePreferences } from '../context/PreferencesContext.jsx'
import { useActiveSection } from '../hooks/useActiveSection.js'

const OBSERVED_IDS = ['inicio', 'sobre', 'habilidades', 'projetos', 'experiencias', 'contato']
const SECTION_IDS = ['sobre', 'habilidades', 'projetos', 'experiencias', 'contato']
const NAV_KEYS = { sobre: 'about', habilidades: 'skills', projetos: 'projects', experiencias: 'experience', contato: 'contact' }

export default function Header() {
  const { t, theme, lang, toggleTheme, toggleLang } = usePreferences()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(OBSERVED_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">

        <nav id="menu-principal" className={`nav ${open ? 'nav--open' : ''}`} aria-label="Menu principal">
          <ul>
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={active === id ? 'is-active' : undefined}
                  aria-current={active === id ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {t.nav[NAV_KEYS[id]]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <button type="button" className="chip-btn" onClick={toggleLang} aria-label={t.langSwitch}>
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.themeToLight : t.themeToDark}
            title={theme === 'dark' ? t.themeToLight : t.themeToDark}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-principal"
            aria-label={open ? t.closeMenu : t.menu}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  )
}
