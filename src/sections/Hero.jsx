import { FiArrowDown, FiDownload, FiMapPin } from 'react-icons/fi'
import { usePreferences } from '../context/PreferencesContext.jsx'
import { profile } from '../data/content.js'
import photo from '../assets/manoel.webp'
import HeroTerminal from '../components/HeroTerminal.jsx'

export default function Hero() {
  const { t } = usePreferences()
  return (
    <section id="inicio" className="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <p className="hero__greeting">{t.hero.greeting}</p>
          <h1 className="hero__name">
            Manoel
            <br />
            Neto
          </h1>
          <p className="hero__role">{t.hero.role}</p>
          <p className="hero__place"><FiMapPin aria-hidden="true" /> Belo Horizonte, MG</p>
          <div className="hero__actions">
            <a href="#projetos" className="btn btn--primary">
              {t.hero.ctaProjects} <FiArrowDown aria-hidden="true" />
            </a>
            <a href={profile.cv} className="btn btn--ghost" download>
              <FiDownload aria-hidden="true" /> {t.hero.ctaCv}
            </a>
          </div>
          <HeroTerminal />
        </div>
        <div className="hero__visual">
          <div className="hero__disc" aria-hidden="true" />
          <img src={photo} alt={t.hero.photoAlt} className="hero__photo" width="713" height="1070" />
        </div>
      </div>
    </section>
  )
}
