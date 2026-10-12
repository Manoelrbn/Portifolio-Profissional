import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import Skills from './sections/Skills.jsx'
import Projects from './sections/Projects.jsx'
import Experiences from './sections/Experiences.jsx'
import Contact from './sections/Contact.jsx'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experiences />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
