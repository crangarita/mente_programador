import ProfileCard from '../components/ProfileCard'
import { profileDetails } from '../data/profileDetails'
import type { FinalResult } from '../types/result'
import BrandHeader from '../components/BrandHeader'
import brandLogo from '../assets/logo-mente-programador.png'

function storedAvatar() {
  try { return (JSON.parse(sessionStorage.getItem('participant') ?? '{}') as { avatar?: string }).avatar ?? '🧠' }
  catch { return '🧠' }
}

const technologyIcons: Record<string, string> = {
  HTML: '◇', CSS: '🎨', JavaScript: 'JS', React: '⚛', Java: '☕', 'Spring Boot': '🍃', APIs: '🔌', SQL: '▦',
  Python: '🐍', 'Machine Learning': '🧠', IA: '✨', Linux: '🐧', Redes: '◎', Ciberseguridad: '🛡️',
  'Ethical Hacking': '⌁', 'Power BI': '📊', 'Analítica de datos': '📈', Unity: '◈', Godot: '🤖', Videojuegos: '🎮',
}

function ResultPage({ result }: { result: FinalResult }) {
  const profile = profileDetails[result.profile]
  const avatar = storedAvatar()
  const scorePercent = Math.round((result.score / 1000) * 100)
  const skills = [
    ['Lógica algorítmica', Math.min(99, 70 + Math.round(result.challengeScore / 25))],
    ['Reconocimiento', Math.min(97, 65 + Math.round(result.testScore / 12))],
    ['Velocidad mental', Math.min(96, 60 + Math.round(result.challengeScore / 30))],
    ['Creatividad tech', Math.min(98, 72 + Math.round(result.testScore / 15))],
  ]

  return (
    <div className="cyber-page min-h-screen text-zinc-100"><BrandHeader active="RESULTADO" />
    <main className="px-4 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-5xl">
        <header className="mb-7 text-center">
          <p className="cyber-kicker">● Diagnóstico completado // Calibración 100%</p>
          <h1 className="mt-3 text-center font-display text-3xl font-black sm:text-5xl"><span className="block">{avatar === '🧠' ? <img src={brandLogo} alt="" className="mr-4 inline-block h-14 w-14 rounded-xl object-cover align-middle shadow-neon sm:mr-5 sm:h-16 sm:w-16" /> : <span className="mr-3 align-middle" aria-hidden="true">{avatar}</span>}<span className="align-middle">¡{result.alias}, tu perfil tecnológico es</span></span><span className="block">extraordinario!</span></h1>
        </header>

        <div className="cyber-panel relative overflow-hidden rounded-3xl p-6 sm:p-10"><div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-cyan via-violet-300 to-cyan-400" />
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3"><span className="cyber-kicker rounded-full bg-cyan-400/10 px-4 py-2">Nivel de afinidad: {scorePercent}% · Talento explorador</span><span className="font-mono text-[10px] tracking-wider text-zinc-400">TERMINAL #TK-402 · PABELLÓN STEM</span></div>
          <div className="grid gap-7 lg:grid-cols-[.75fr_1.25fr]">
            <ProfileCard profile={result.profile} />
            <section><p className="cyber-kicker">♙ Análisis de habilidad cognitiva</p><p className="mt-4 text-lg leading-8 text-zinc-300">{profile.description} Tu combinación de respuestas muestra una afinidad natural para aprender, experimentar y convertir problemas complejos en soluciones digitales.</p><p className="mt-6 font-mono text-xs uppercase tracking-widest text-zinc-300">Tecnologías recomendadas para tu mente</p><div className="mt-3 grid grid-cols-2 gap-3">{profile.technologies.map((tech) => <div key={tech} className="flex items-center gap-3 rounded-xl border border-white/[.05] bg-cyber-600 px-4 py-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-cyber-950 font-mono text-sm font-black text-neon-cyan">{technologyIcons[tech] ?? '◆'}</span><span className="font-mono text-sm">{tech}</span></div>)}</div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{skills.map(([label,value]) => <div key={label} className="rounded-xl bg-cyber-950/60 p-3"><p className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">{label}</p><p className="mt-2 text-lg font-black text-neon-cyan">{value}%</p></div>)}</div></section>
          </div>

        <section className="mt-7 grid gap-3 sm:grid-cols-3" aria-label="Resumen del resultado">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">Diagnóstico vocacional</p><p className="mt-1 text-3xl font-black text-cyan-300">{result.testScore} XP</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">Bonus de lógica</p><p className="mt-1 text-3xl font-black text-violet-300">+{result.challengeScore} XP</p>
          </div>
          <div className="rounded-2xl border border-cyan-300/40 bg-cyan-300/10 p-5 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-cyan-100">Puntaje total</p><p className="mt-1 text-3xl font-black text-cyan-300">{result.score}<span className="text-base">/1000</span></p>
          </div>
        </section>

        <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-5 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-200">Posición actual</p>
          <p className="mt-1 text-4xl font-black text-amber-300">#{result.rankingPosition}</p>
        </div>

          <div className="mt-5 rounded-2xl bg-cyber-600 p-5"><p className="cyber-kicker">🎓 Ruta universitaria conectada</p><p className="mt-2 text-zinc-300">Este talento se potencia estudiando <strong className="text-neon-cyan">Ingeniería de Sistemas</strong>: desarrolla soluciones reales, explora laboratorios y participa en proyectos del semillero.</p></div>
        </div>
        <button type="button" onClick={() => window.location.assign('/ranking')} className="cyber-primary mt-5 w-full rounded-2xl px-5 py-4 font-display font-black">
          VER RANKING
        </button>
      </section>
    </main></div>
  )
}

export default ResultPage
