import About from './components/About'
import Background from './components/Background'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import Experiences from './components/Experiences'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Projects from './components/Projects'

export default function App() {
    return (
        <>
            <Background />
            <Cursor />
            <Header />

            <main>
                <Hero />
                <div className="transicao-fundo h-[24vh]" aria-hidden="true" />
                <About />
                <Projects />
                <Experiences />
                <Contact />
            </main>

            <Footer />
        </>
    )
}
