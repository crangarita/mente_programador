import type { Profile } from '../types/quiz'

const profiles: Record<Profile, { title: string; icon: string; description: string; technologies: string[] }> = {
  FRONTEND_CREATOR: { title: 'Creador Frontend', icon: '🎨', description: 'Transformas ideas en experiencias visuales claras, atractivas y fáciles de usar.', technologies: ['HTML', 'CSS', 'JavaScript', 'React'] },
  BACKEND_ARCHITECT: { title: 'Arquitecto Backend', icon: '⚙️', description: 'Disfrutas organizar la lógica y construir los motores que hacen funcionar cada aplicación.', technologies: ['Java', 'Spring Boot', 'APIs', 'SQL'] },
  AI_EXPLORER: { title: 'Explorador de IA', icon: '🤖', description: 'Tu curiosidad te impulsa a experimentar, automatizar y crear soluciones inteligentes.', technologies: ['Python', 'Machine Learning', 'IA', 'APIs'] },
  CYBER_GUARDIAN: { title: 'Guardián Cibernético', icon: '🛡️', description: 'Observas con atención, anticipas riesgos y buscas proteger sistemas y personas.', technologies: ['Linux', 'Redes', 'Ciberseguridad', 'Ethical Hacking'] },
  DATA_DETECTIVE: { title: 'Detective de Datos', icon: '📊', description: 'Encuentras historias y patrones ocultos para convertir información en decisiones.', technologies: ['SQL', 'Python', 'Power BI', 'Analítica de datos'] },
  GAME_BUILDER: { title: 'Constructor de Juegos', icon: '🎮', description: 'Combinas creatividad, lógica e interacción para convertir ideas en experiencias divertidas.', technologies: ['JavaScript', 'Unity', 'Godot', 'Videojuegos'] },
}

function ProfileCard({ profile }: { profile: Profile }) {
  const content = profiles[profile]
  return (
    <article className="rounded-3xl border border-violet-400/30 bg-violet-400/10 p-6 text-center sm:p-8">
      <div className="text-6xl" aria-hidden="true">{content.icon}</div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.28em] text-violet-300">Tu perfil tecnológico</p>
      <h2 className="mt-2 text-3xl font-black text-white">{content.title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-zinc-300">{content.description}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Tecnologías sugeridas">
        {content.technologies.map((technology) => <span key={technology} className="rounded-full border border-violet-300/30 bg-zinc-950/50 px-3 py-1.5 text-sm font-bold text-violet-200">{technology}</span>)}
      </div>
    </article>
  )
}

export default ProfileCard
