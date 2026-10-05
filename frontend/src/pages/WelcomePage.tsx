import BrandFooter from '../components/BrandFooter'
import BrandHeader from '../components/BrandHeader'

function WelcomePage({ onStart }: { onStart: () => void }) {
  const profiles = [
    ['🎨', 'Frontend Creator', 'UI / UX'], ['⚙️', 'Backend Architect', 'Core Systems'],
    ['🤖', 'AI Explorer', 'Neural Nets'], ['🛡️', 'Cyber Guardian', 'Cyber Sec'],
    ['📊', 'Data Detective', 'Big Data'], ['🎮', 'Game Builder', 'Game Engine'],
  ]
  return <div className="cyber-page flex min-h-screen flex-col text-zinc-100">
    <BrandHeader active="INICIO" />
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-10 lg:px-10">
      <section className="mx-auto max-w-4xl text-center">
        <p className="cyber-kicker inline-flex rounded-full bg-cyber-600/70 px-4 py-2">● Reto express · Stand Ingeniería de Sistemas</p>
        <h1 className="mt-6 font-display text-5xl font-black uppercase leading-[.95] tracking-tight sm:text-7xl"><span className="bg-gradient-to-r from-neon-cyan via-white to-violet-300 bg-clip-text text-transparent">¿Tienes mente de<br />programador?</span></h1>
        <p className="mt-5 text-xl font-bold text-neon-cyan">Descúbrelo en menos de 2 minutos 🚀</p>
        <p className="mx-auto mt-2 max-w-2xl text-zinc-400">Responde 5 preguntas, supera un microdesafío de lógica y descubre tu perfil tecnológico.</p>
        <div className="cyber-panel relative mx-auto mt-8 grid min-h-64 max-w-3xl place-items-center overflow-hidden rounded-3xl p-8">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(76,215,246,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(76,215,246,.035)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="relative text-center"><div className="text-8xl drop-shadow-[0_0_30px_rgba(76,215,246,.65)]">🧠</div><p className="mt-4 font-mono text-xs tracking-[.25em] text-neon-cyan">SYSTEM READY // CALIBRACIÓN ACTIVA</p></div>
        </div>
        <button onClick={onStart} className="cyber-primary mt-8 rounded-2xl px-10 py-4 font-display text-lg font-black uppercase tracking-wide transition active:scale-[.98]">🎮 Comenzar reto →</button>
        <div className="mt-5 flex flex-wrap justify-center gap-3 font-mono text-xs text-zinc-400"><span className="rounded-full bg-cyber-800 px-4 py-2">⏱ Duración: 2 min</span><span className="rounded-full bg-cyber-800 px-4 py-2">🎮 Mini juego interactivo</span><span className="rounded-full bg-cyber-800 px-4 py-2">🏆 Ranking en vivo</span></div>
      </section>
      <section className="mt-14"><p className="cyber-kicker">Colección de especialidades</p><h2 className="mt-2 font-display text-2xl font-bold">6 perfiles tecnológicos descifrables</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">{profiles.map(([icon,title,tag], index) => <article key={title} className="cyber-panel rounded-2xl p-4"><span className="text-2xl">{icon}</span><p className="mt-4 font-mono text-[9px] uppercase tracking-wider text-neon-cyan">{tag}</p><h3 className="mt-1 font-display font-bold">{title}</h3><p className="mt-4 font-mono text-[9px] text-zinc-500">#{String(index + 1).padStart(2,'0')}</p></article>)}</div>
      </section>
    </main><BrandFooter />
  </div>
}
export default WelcomePage
