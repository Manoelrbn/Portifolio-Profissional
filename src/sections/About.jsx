import { usePreferences } from '../context/PreferencesContext.jsx'

export default function About() {
  const { t } = usePreferences()
  return (
    <section id="sobre" className="section">
      <div className="container about">
        <div className="about__text">
          <h2 className="section__title">{t.about.title}</h2>
          {t.about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <aside className="about__facts" aria-label={t.about.factsTitle}>
          <h3>{t.about.factsTitle}</h3>
          <dl>
            {t.about.facts.map((f) => (
              <div key={f.label} className="fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}
