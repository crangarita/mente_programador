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
    <article className="cyber-panel relative overflow-hidden rounded-3xl p-6 text-center sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-cyan via-violet-300 to-cyan-400" />
      <div className="text-6xl" aria-hidden="true">{content.icon}</div>
      <p className="cyber-kicker mt-4">Perfil arquetípico // Core match</p>
      <h2 className="mt-2 font-display text-4xl font-black uppercase text-white">{content.title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-zinc-300">{content.description}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Tecnologías sugeridas">
        {content.technologies.map((technology) => <span key={technology} className="rounded-full border border-violet-300/30 bg-zinc-950/50 px-3 py-1.5 text-sm font-bold text-violet-200">{technology}</span>)}
      </div>
    </article>
  )
}

export default ProfileCard
