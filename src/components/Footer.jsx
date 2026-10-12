import { FiArrowUp, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { usePreferences } from '../context/PreferencesContext.jsx'
import { profile } from '../data/content.js'

export default function Footer() {
  const { t } = usePreferences()
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {new Date().getFullYear()} {profile.fullName}. {t.footer.rights}
        </p>
        <div className="footer__links">
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FiGithub /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
          <a href={`mailto:${profile.email}`} aria-label="E-mail"><FiMail /></a>
          <a href="#inicio" className="footer__top"><FiArrowUp aria-hidden="true" /> {t.footer.top}</a>
        </div>
      </div>
    </footer>
  )
}
