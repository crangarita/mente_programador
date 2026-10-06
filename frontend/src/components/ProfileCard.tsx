import type { Profile } from '../types/quiz'
import { profileDetails } from '../data/profileDetails'

function ProfileCard({ profile }: { profile: Profile }) {
  const content = profileDetails[profile]
  return (
    <article className="cyber-panel relative overflow-hidden rounded-3xl p-6 text-center sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-cyan via-violet-300 to-cyan-400" />
      <div className="relative mx-auto h-52 w-full max-w-sm overflow-hidden rounded-2xl border border-neon-cyan/25 bg-cyber-950 shadow-neon"><img src={content.image} alt={`Representación del perfil ${content.title}`} className="h-full w-full object-cover" /><span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-cyber-950/85 px-3 py-1 font-mono text-[9px] tracking-widest text-neon-cyan backdrop-blur">{content.icon} CORE MATCH</span></div>
      <p className="cyber-kicker mt-5">Perfil arquetípico // Core match</p>
      <h2 className="mt-2 font-display text-4xl font-black uppercase text-white">{content.title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-zinc-300">{content.description}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Tecnologías sugeridas">
        {content.technologies.map((technology) => <span key={technology} className="rounded-full border border-violet-300/30 bg-zinc-950/50 px-3 py-1.5 text-sm font-bold text-violet-200">{technology}</span>)}
      </div>
    </article>
  )
}

export default ProfileCard
