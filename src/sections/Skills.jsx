import SkillsGlobe from '../components/SkillsGlobe.jsx'
import { usePreferences } from '../context/PreferencesContext.jsx'
import { skills } from '../data/skills.js'

export default function Skills() {
  const { t } = usePreferences()
  return (
    <section id="habilidades" className="section section--tinted">
      <div className="container skills">
        <div className="skills__text">
          <h2 className="section__title">{t.skills.title}</h2>
          <p className="section__intro">{t.skills.intro}</p>
          <ul className="skill-list" aria-label={t.skills.listLabel}>
            {skills.map(({ name, Icon }) => (
              <li key={name}>
                <Icon aria-hidden="true" /> {name}
              </li>
            ))}
          </ul>
        </div>
        <SkillsGlobe skills={skills} />
      </div>
    </section>
  )
}
