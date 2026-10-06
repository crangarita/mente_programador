import { useCallback, useEffect, useState } from 'react'
import BrandFooter from '../components/BrandFooter'
import BrandHeader from '../components/BrandHeader'
import { getRanking } from '../services/api'
import type { Participant } from '../types/participant'
import type { Profile } from '../types/quiz'
import type { RankingEntry } from '../types/ranking'

const profileLabels: Record<Profile, { label: string; icon: string; color: string }> = {
  FRONTEND_CREATOR: { label: 'Frontend Creator', icon: '🎨', color: '#f472b6' },
  BACKEND_ARCHITECT: { label: 'Backend Architect', icon: '⚙️', color: '#78a5ff' },
  AI_EXPLORER: { label: 'AI Explorer', icon: '🤖', color: '#4cd7f6' },
  CYBER_GUARDIAN: { label: 'Cyber Guardian', icon: '🔐', color: '#34d399' },
  DATA_DETECTIVE: { label: 'Data Detective', icon: '📊', color: '#d8e2ff' },
  GAME_BUILDER: { label: 'Game Builder', icon: '🎮', color: '#c4abff' },
}

const podiumStyles = {
  1: { medal: '🥇', label: 'CAMPEÓN STAND 42', glow: 'border-amber-300/30 shadow-[0_0_45px_rgba(250,204,21,.18)]', order: 'lg:order-2 lg:-translate-y-8' },
  2: { medal: '🥈', label: 'RANK II', glow: 'border-zinc-400/20', order: 'lg:order-1' },
  3: { medal: '🥉', label: 'RANK III', glow: 'border-orange-500/20', order: 'lg:order-3' },
} as const

function storedParticipant(): Participant | null {
  try { return JSON.parse(sessionStorage.getItem('participant') ?? 'null') as Participant | null }
  catch { return null }
}

function DashboardPage() {
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [participant] = useState(() => storedParticipant())

  const refresh = useCallback(async () => {
    try {
      setRanking(await getRanking(100))
      setLastUpdated(new Date())
      setError('')
    } catch { setError('No se pudo actualizar el ranking. Reintentando…') }
  }, [])

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => void refresh(), 0)
    const interval = window.setInterval(() => void refresh(), 5_000)
    return () => { window.clearTimeout(initialRefresh); window.clearInterval(interval) }
  }, [refresh])

  const current = participant ? ranking.find((entry) => entry.alias === participant.alias) : undefined
  const cutoff = ranking.length >= 10 ? ranking[9].score : ranking.at(-1)?.score

  return <div className="cyber-page flex min-h-screen flex-col text-zinc-100">
    <BrandHeader active="RANKING" compact />
    <main className="mx-auto w-full max-w-[1500px] flex-1 px-5 py-8 lg:px-10">
      <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="cyber-kicker">● Live leaderboard · Stand 42 · Temporada 2025</p>
          <h1 className="mt-3 font-display text-5xl font-black uppercase leading-none sm:text-7xl">🏆 Ranking <span className="bg-gradient-to-r from-neon-cyan to-violet-300 bg-clip-text text-transparent">de la feria</span></h1>
          <p className="mt-3 max-w-3xl text-lg text-zinc-300">¿Puedes entrar al Top 10? Compite contra aspirantes de todos los colegios y asegura tu lugar entre las mentes digitales del stand.</p>
        </div>
        <aside className="cyber-panel flex shrink-0 divide-x divide-white/10 rounded-2xl px-5 py-4 font-mono">
          <div className="pr-5"><p className="text-[9px] uppercase tracking-widest text-zinc-500">Puesto actual</p><strong className="text-neon-cyan">{current ? `#${String(current.position).padStart(2, '0')} ${current.alias}` : 'SIN REGISTRO'}</strong></div>
          <div className="pl-5"><p className="text-[9px] uppercase tracking-widest text-zinc-500">Top 10 cutoff</p><strong className="text-violet-300">{cutoff ? `${cutoff} pts` : '—'}</strong></div>
        </aside>
      </section>

      {ranking.length > 0 && <section className="mt-16 grid items-end gap-5 lg:grid-cols-3" aria-label="Podio de la feria">
        {ranking.slice(0, 3).map((entry) => {
          const style = podiumStyles[entry.position as 1 | 2 | 3]
          const profile = profileLabels[entry.profile]
          return <article key={entry.position} className={`cyber-panel relative overflow-visible rounded-3xl border p-6 text-center ${style.glow} ${style.order}`}>
            <span className="absolute left-1/2 top-0 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-cyber-600 text-3xl shadow-lg">{style.medal}</span>
            <div className="mx-auto mt-6 grid h-28 w-28 place-items-center rounded-full border-4 border-cyber-600 bg-gradient-to-br from-cyan-400/25 to-violet-500/25 text-5xl shadow-neon">{profile.icon}</div>
            <p className="mt-3 font-mono text-[10px] font-bold text-amber-300">#{String(entry.position).padStart(2, '0')} LEADER</p>
            <h2 className="mt-1 font-display text-2xl font-black">{entry.alias}</h2>
            <p className="mt-2 inline-block rounded-full bg-cyber-600 px-3 py-1 font-mono text-[9px] tracking-wider" style={{ color: profile.color }}>{profile.label} · {profile.icon}</p>
            <div className="mt-5 flex items-center justify-between rounded-xl bg-cyber-950/70 px-4 py-3"><span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">Puntaje</span><strong className="font-mono text-2xl text-amber-300">{entry.score}<small className="ml-1 text-[9px] text-zinc-400">pts</small></strong></div>
            <p className="-mx-6 -mb-6 mt-5 rounded-b-3xl bg-white/[.03] py-5 font-mono text-[10px] tracking-widest text-zinc-300">{style.label}</p>
          </article>
        })}
      </section>}

      <section className="mt-10">
        <div className="mb-3 flex justify-between px-4 font-mono text-[9px] uppercase tracking-[.2em] text-zinc-400"><span>Posición · Digital architect</span><span>Score gauntlet</span></div>
        <ol className="space-y-2">
          {ranking.map((entry) => {
            const isCurrent = entry.alias === participant?.alias
            const profile = profileLabels[entry.profile]
            return <li key={`${entry.position}-${entry.alias}`} className={`grid grid-cols-[3rem_1fr_auto] items-center gap-4 rounded-2xl border px-4 py-3 transition ${isCurrent ? 'border-neon-cyan bg-cyan-400/10 shadow-neon' : 'border-white/[.04] bg-cyber-800/75'}`}>
              <span className={`grid h-10 w-10 place-items-center rounded-lg font-mono font-bold ${entry.position <= 3 ? 'bg-amber-400/15 text-amber-300' : isCurrent ? 'bg-neon-cyan text-cyan-950' : 'bg-cyber-600 text-zinc-300'}`}>{String(entry.position).padStart(2, '0')}</span>
              <div className="min-w-0"><p className={`truncate font-display text-lg font-bold ${isCurrent ? 'text-neon-cyan' : ''}`}>{entry.position <= 3 ? podiumStyles[entry.position as 1 | 2 | 3].medal : '🎖️'} <span className="ml-2">{entry.alias}</span>{isCurrent && <small className="ml-2 rounded bg-cyan-400/20 px-2 py-1 font-mono text-[8px] tracking-wider">TÚ · EN RACHA</small>}</p><p className="truncate font-mono text-[9px] tracking-wider text-zinc-400">Perfil: {profile.label} {profile.icon}</p></div>
              <strong className="text-right font-mono text-xl">{entry.score}<small className="block text-[8px] font-normal tracking-widest text-zinc-400">PTS</small></strong>
            </li>
          })}
        </ol>
        {ranking.length === 0 && !error && <p className="cyber-panel rounded-2xl p-10 text-center text-zinc-500">Esperando los primeros resultados…</p>}
      </section>

      <section className="cyber-panel mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl p-5 sm:flex-row">
        <div className="font-mono text-[9px] tracking-widest text-zinc-300"><p><span className="text-neon-cyan">●</span> STAND 42 · PABELLÓN STEM</p><p>Actualización automática cada 5s{lastUpdated ? ` · ${lastUpdated.toLocaleTimeString('es-CO')}` : ''}</p></div>
        <div className="flex flex-wrap gap-3"><button type="button" onClick={() => window.location.assign('/')} className="cyber-primary rounded-xl px-7 py-3 font-display font-black">↻ JUGAR DE NUEVO</button><button type="button" onClick={() => window.location.assign('/')} className="rounded-xl bg-cyber-600 px-7 py-3 font-display font-black">⌂ VOLVER AL INICIO</button></div>
      </section>
      <p role="alert" className="mt-3 min-h-5 text-center text-sm text-rose-300">{error}</p>
    </main>
    <BrandFooter />
  </div>
}

export default DashboardPage
