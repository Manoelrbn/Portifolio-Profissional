import { FiBookOpen, FiBriefcase } from 'react-icons/fi'
import { usePreferences } from '../context/PreferencesContext.jsx'
import { experiences } from '../data/experiences.js'

function Entry({ item, lang, currentLabel }) {
  return (
    <article className="exp">
      <header className="exp__head">
        <div>
          <h4>{item.role[lang]}</h4>
          <p className="exp__org">{item.org}</p>
        </div>
        <p className="exp__period">
          {item.period[lang]}
          {item.current && <span className="badge">{currentLabel}</span>}
        </p>
      </header>
      <p>{item.summary[lang]}</p>
      {item.highlight && (
        <div className="exp__highlight">
          <h5>{item.highlight.title[lang]}</h5>
          <p>{item.highlight.text[lang]}</p>
        </div>
      )}
      {item.items && (
        <ul className="exp__list">
          {item.items[lang].map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default function Experiences() {
  const { t, lang } = usePreferences()
  const work = experiences.filter((e) => e.kind === 'work')
  const education = experiences.filter((e) => e.kind === 'education')

  return (
    <section id="experiencias" className="section section--tinted">
      <div className="container">
        <h2 className="section__title">{t.experience.title}</h2>
        <p className="section__intro">{t.experience.intro}</p>
        <div className="exp-grid">
          <div>
            <h3 className="exp-group"><FiBriefcase aria-hidden="true" /> {t.experience.work}</h3>
            {work.map((item) => (
              <Entry key={item.id} item={item} lang={lang} currentLabel={t.experience.current} />
            ))}
          </div>
          <div>
            <h3 className="exp-group"><FiBookOpen aria-hidden="true" /> {t.experience.education}</h3>
            {education.map((item) => (
              <Entry key={item.id} item={item} lang={lang} currentLabel={t.experience.current} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
