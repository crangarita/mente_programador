import { useCallback, useEffect, useState } from 'react'
import { getRanking, getStats } from '../services/api'
import type { RankingEntry } from '../types/ranking'
import type { EventStats } from '../types/stats'
import type { Profile } from '../types/quiz'

const profileLabels: Record<Profile, { label: string; icon: string; color: string }> = {
  FRONTEND_CREATOR: { label: 'Frontend Creator', icon: '🎨', color: '#f472b6' },
  BACKEND_ARCHITECT: { label: 'Backend Architect', icon: '⚙️', color: '#78a5ff' },
  AI_EXPLORER: { label: 'AI Explorer', icon: '🤖', color: '#4cd7f6' },
  CYBER_GUARDIAN: { label: 'Cyber Guardian', icon: '🔐', color: '#34d399' },
  DATA_DETECTIVE: { label: 'Data Detective', icon: '📊', color: '#d8e2ff' },
  GAME_BUILDER: { label: 'Game Builder', icon: '🎮', color: '#c4abff' },
}

function DashboardPage() {
  const [stats, setStats] = useState<EventStats | null>(null)
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refresh = useCallback(async () => {
    try {
      const [nextStats, nextRanking] = await Promise.all([getStats(), getRanking(5)])
      setStats(nextStats); setRanking(nextRanking)
      setLastUpdated(new Date()); setError('')
    } catch { setError('No se pudieron actualizar los datos. Reintentando…') }
  }, [])

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => void refresh(), 0)
    const interval = window.setInterval(() => void refresh(), 5_000)
    return () => { window.clearTimeout(initialRefresh); window.clearInterval(interval) }
  }, [refresh])

  const commonProfile = stats?.mostCommonProfile ? profileLabels[stats.mostCommonProfile] : null
  const completed = stats ? Object.values(stats.profileDistribution).reduce((sum, value) => sum + value, 0) : 0
  const distribution = (Object.keys(profileLabels) as Profile[]).map((profile) => ({
    profile, ...profileLabels[profile], count: stats?.profileDistribution[profile] ?? 0,
    percentage: completed ? Math.round(((stats?.profileDistribution[profile] ?? 0) / completed) * 100) : 0,
  })).sort((a, b) => b.count - a.count)

  return <main className="cyber-page min-h-screen px-5 py-5 text-zinc-100 lg:px-7">
    <section className="mx-auto max-w-[1800px]">
      <header className="cyber-panel grid items-center gap-6 rounded-3xl p-6 lg:grid-cols-[auto_1fr_auto] lg:p-8">
        <div className="grid h-24 w-24 place-items-center rounded-2xl bg-cyan-400/10 text-5xl shadow-neon">🧠</div>
        <div><div className="flex flex-wrap gap-3"><span className="cyber-kicker rounded-full bg-cyber-600 px-4 py-2">● SYS.BROADCAST // 2025.CORE</span><span className="rounded-full bg-red-700 px-4 py-2 font-mono text-[10px] font-bold tracking-widest text-red-100">● TRANSMISIÓN EN VIVO DEL STAND</span></div><h1 className="mt-4 font-display text-4xl font-black uppercase leading-none lg:text-6xl">¿Tienes mente de<br />programador?</h1><div className="mt-4 flex flex-wrap gap-5 font-display text-lg font-bold text-zinc-300"><span>Stand de Ingeniería de Sistemas</span><span className="text-neon-cyan">• Feria Vocacional 2025</span><span className="rounded bg-violet-700/40 px-3 py-1 font-mono text-xs uppercase tracking-wider text-violet-200">Pabellón STEM // Booth 42</span></div></div>
        <div className="flex gap-4 lg:text-right"><div><p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">Tiempo activo</p><p className="font-mono text-2xl text-neon-cyan">{lastUpdated?.toLocaleTimeString('es-CO') ?? '--:--:--'}</p></div><div className="rounded-2xl bg-cyber-600 px-5 py-3"><p className="cyber-kicker">Monitor kiosk</p><p className="font-display text-xl font-black">ONLINE 100%</p></div></div>
      </header>

      <section className="mt-6 grid gap-5 lg:grid-cols-3">
        <article className="cyber-panel rounded-3xl p-7"><p className="cyber-kicker">⌘ Registro global de retadores</p><div className="mt-4 flex items-end gap-4"><strong className="font-display text-7xl text-white">{stats?.participants ?? '—'}</strong><span className="pb-2 font-display text-2xl font-black text-neon-cyan">PARTICIPANTES</span></div><p className="mt-3 text-sm text-zinc-400">↗ Registro continuo durante la jornada</p></article>
        <article className="cyber-panel rounded-3xl p-7"><p className="cyber-kicker text-violet-300">◈ Índice de lógica computacional</p><div className="mt-4"><strong className="font-display text-7xl text-violet-300">{stats?.averageScore ?? '—'}</strong><span className="ml-3 font-display text-2xl font-black">PTS PROMEDIO</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-cyber-600"><div className="h-full bg-gradient-to-r from-violet-600 via-violet-300 to-neon-cyan" style={{width: `${Math.min(100, (stats?.averageScore ?? 0) / 10)}%`}} /></div></article>
        <article className="cyber-panel rounded-3xl p-7"><p className="cyber-kicker">♙ Arquetipo más frecuente</p><div className="mt-3 flex items-center justify-between"><div><strong className="font-display text-5xl font-black uppercase">{commonProfile?.label ?? 'Sin resultados'}</strong><p className="mt-3 text-zinc-400">Afinidad dominante en los participantes evaluados</p></div><span className="text-6xl">{commonProfile?.icon ?? '✨'}</span></div></article>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr_.95fr]">
        <article className="cyber-panel rounded-3xl p-6"><div className="flex justify-between"><div><h2 className="font-display text-2xl font-black">▌ TOP 5 EN VIVO</h2><p className="mt-1 font-mono text-[10px] tracking-widest text-zinc-400">TABLA GENERAL DE PUNTUACIÓN</p></div><span className="h-fit rounded bg-cyber-600 px-3 py-2 font-mono text-[9px] text-neon-cyan">SYNC: 5s</span></div><ol className="mt-7 space-y-3">{ranking.slice(0,5).map((entry) => <li key={`${entry.position}-${entry.alias}`} className={`grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 rounded-2xl p-4 ${entry.position === 1 ? 'border-l-4 border-neon-cyan bg-cyber-600' : 'bg-cyber-950/45'}`}><span className={`grid h-11 w-11 place-items-center rounded-xl font-display text-xl font-black ${entry.position === 1 ? 'bg-neon-cyan text-cyan-950' : 'bg-cyber-600 text-zinc-300'}`}>{entry.position}°</span><div><p className="font-display text-xl font-bold">{entry.alias}</p><p className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">{profileLabels[entry.profile].icon} {profileLabels[entry.profile].label}</p></div><strong className="font-mono text-2xl text-neon-cyan">{entry.score}<small className="block text-right text-[9px] text-zinc-400">PTS</small></strong></li>)}</ol><p className="mt-7 rounded-xl bg-cyber-600 p-4 font-mono text-[10px] tracking-wider text-zinc-300">● Actualización continua · {completed} EVALUADOS</p></article>

        <article className="cyber-panel rounded-3xl p-6"><h2 className="font-display text-2xl font-black">▌ MAPA DE AFINIDAD</h2><p className="mt-1 font-mono text-[10px] tracking-widest text-zinc-400">6 ESPECIALIDADES DE INGENIERÍA</p><div className="mt-7 space-y-4">{distribution.map((item) => <div key={item.profile} className="rounded-2xl bg-cyber-950/40 p-4"><div className="flex justify-between"><span className="font-display text-lg font-bold" style={{color:item.color}}>{item.icon} {item.label}</span><strong className="font-mono" style={{color:item.color}}>{item.percentage}%</strong></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-cyber-600"><div className="h-full rounded-full" style={{width:`${item.percentage}%`,background:item.color}} /></div></div>)}</div><p className="mt-7 text-center font-mono text-[9px] uppercase tracking-widest text-zinc-500">Basado en las pruebas completadas en el stand</p></article>

        <article className="cyber-panel flex flex-col items-center rounded-3xl p-7 text-center"><p className="cyber-kicker self-start rounded-full bg-cyan-400/10 px-4 py-2">⌘ Acceso inmediato al reto</p><h2 className="mt-7 font-display text-5xl font-black uppercase">¡Escanea y<br />participa!</h2><p className="mt-3 text-xl text-neon-cyan">Toma el reto en tu teléfono o acércate a los tótems táctiles.</p><div className="mt-7 grid aspect-square w-full max-w-72 grid-cols-7 gap-2 rounded-3xl bg-white p-8">{Array.from({length:49},(_,i)=><span key={i} className={`${(i*7+i*3)%5<2 ? 'bg-cyber-950' : 'bg-white'} rounded-sm`} />)}</div><p className="mt-3 rounded bg-cyber-600 px-4 py-2 font-mono text-xs tracking-wider">URL: LOCALHOST:15173</p></article>
      </section>

      <div className="mt-6 text-center"><a href="/ranking" className="cyber-primary inline-flex rounded-xl px-8 py-4 font-display text-lg font-black">🏆 VER RANKING COMPLETO</a></div>
      <p role="alert" className="mt-3 min-h-5 text-center text-sm text-rose-300">{error}</p>
    </section>
  </main>
}

export default DashboardPage
