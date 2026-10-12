import { useMemo, useState } from 'react'
import { FiExternalLink, FiGithub, FiUsers } from 'react-icons/fi'
import { usePreferences } from '../context/PreferencesContext.jsx'
import { projects } from '../data/projects.js'

export default function Projects() {
  const { t, lang } = usePreferences()
  const [filter, setFilter] = useState('all')

  // Timeline dinâmica: ordena por data (mais antigo → mais recente) e gera filtros a partir dos dados
  const ordered = useMemo(() => [...projects].sort((a, b) => a.date.localeCompare(b.date)), [])
  const techs = useMemo(() => {
    const count = {}
    ordered.forEach((p) => p.techs.forEach((tech) => (count[tech] = (count[tech] || 0) + 1)))
    return Object.keys(count).sort((a, b) => count[b] - count[a] || a.localeCompare(b))
  }, [ordered])
  const visible = filter === 'all' ? ordered : ordered.filter((p) => p.techs.includes(filter))

  return (
    <section id="projetos" className="section">
      <div className="container">
        <h2 className="section__title">{t.projects.title}</h2>
        <p className="section__intro">{t.projects.intro}</p>

        <div className="filters" role="group" aria-label={t.projects.title}>
          {['all', ...techs].map((tech) => (
            <button
              key={tech}
              type="button"
              className={`filter ${filter === tech ? 'is-active' : ''}`}
              aria-pressed={filter === tech}
              onClick={() => setFilter(tech)}
            >
              {tech === 'all' ? t.projects.all : tech}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="empty">{t.projects.empty}</p>
        ) : (
          <ol className="timeline">
            {visible.map((p) => (
              <li key={p.id} className="timeline__item">
                <span className="timeline__dot" aria-hidden="true" />
                <article className="project">
                  <figure className="project__media">
                    <img src={p.image} alt={`${t.projects.imageAlt}: ${p.name}`} loading="lazy" width="640" height="400" />
                  </figure>
                  <div className="project__body">
                    <p className="project__period">
                      <time dateTime={p.date}>{p.period}</time>
                      {p.team && (
                        <span className="project__team">
                          <FiUsers aria-hidden="true" /> {t.projects.team}
                        </span>
                      )}
                    </p>
                    <h3>{p.name}</h3>
                    <p>{p.description[lang]}</p>
                    <ul className="tags" aria-label="Tecnologias">
                      {p.techs.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                    <div className="project__links">
                      <a href={p.repo} target="_blank" rel="noreferrer" className="link-btn">
                        <FiGithub aria-hidden="true" /> {t.projects.repo}
                      </a>
                      {p.demo && (
                        <a href={p.demo} target="_blank" rel="noreferrer" className="link-btn">
                          <FiExternalLink aria-hidden="true" /> {t.projects.demo}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
