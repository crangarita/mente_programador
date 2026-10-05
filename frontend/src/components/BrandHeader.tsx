interface BrandHeaderProps { active?: string; compact?: boolean }

const steps = ['INICIO', 'REGISTRO', 'QUIZ', 'RETO LÓGICO', 'RESULTADO', 'RANKING']

function BrandHeader({ active, compact = false }: BrandHeaderProps) {
  return <header className="border-b border-white/[0.06] bg-cyber-950/85 backdrop-blur-xl">
    <div className={`mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 ${compact ? 'h-16' : 'h-20'} lg:px-10`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 text-xl shadow-neon">🧠</div>
        <div className="min-w-0"><p className="truncate font-display text-sm font-black uppercase leading-none text-white sm:text-lg">¿Tienes mente de programador?</p><p className="mt-1 hidden font-mono text-[9px] tracking-[.22em] text-neon-cyan sm:block">TECH FAIR STAND EDITION</p></div>
      </div>
      <nav className="hidden items-center gap-1 rounded-xl bg-cyber-800/70 p-1 xl:flex" aria-label="Progreso de la experiencia">
        {steps.map((step) => <span key={step} className={`rounded-lg px-3 py-2 font-mono text-[10px] tracking-wider ${active === step ? 'bg-cyan-400 text-cyan-950 shadow-neon' : 'text-zinc-400'}`}>{step}</span>)}
      </nav>
      <div className="flex shrink-0 items-center gap-2 rounded-full bg-cyber-800 px-3 py-2 font-mono text-[10px] tracking-wider text-zinc-300"><span className="h-2 w-2 animate-pulse rounded-full bg-neon-cyan shadow-neon" /> EN LÍNEA</div>
    </div>
  </header>
}

export default BrandHeader
