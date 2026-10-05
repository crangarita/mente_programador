import { useCallback, useEffect, useState } from 'react'
import { getRanking, getStats } from '../services/api'
import type { RankingEntry } from '../types/ranking'
import type { EventStats } from '../types/stats'

const profileLabels: Record<NonNullable<EventStats['mostCommonProfile']>, { label: string; icon: string }> = {
  FRONTEND_CREATOR: { label: 'Creador Frontend', icon: '🎨' },
  BACKEND_ARCHITECT: { label: 'Arquitecto Backend', icon: '⚙️' },
  AI_EXPLORER: { label: 'Explorador de IA', icon: '🤖' },
  CYBER_GUARDIAN: { label: 'Guardián Cibernético', icon: '🛡️' },
  DATA_DETECTIVE: { label: 'Detective de Datos', icon: '📊' },
  GAME_BUILDER: { label: 'Constructor de Juegos', icon: '🎮' },
}

function DashboardPage() {
  const [stats, setStats] = useState<EventStats | null>(null)
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [visibleLimit, setVisibleLimit] = useState(10)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const [nextStats, nextRanking] = await Promise.all([getStats(), getRanking(visibleLimit + 1)])
      setStats(nextStats)
      setRanking(nextRanking.slice(0, visibleLimit))
      setHasMore(nextRanking.length > visibleLimit)
      setLastUpdated(new Date())
      setError('')
    } catch {
      setError('No se pudieron actualizar los datos. Reintentando…')
    }
  }, [visibleLimit])

  async function loadMore() {
    setIsLoadingMore(true)
    const nextLimit = visibleLimit + 10
    try {
      const nextRanking = await getRanking(nextLimit + 1)
      setRanking(nextRanking.slice(0, nextLimit))
      setVisibleLimit(nextLimit)
      setHasMore(nextRanking.length > nextLimit)
      setError('')
    } catch {
      setError('No se pudieron cargar más resultados. Intenta nuevamente.')
    } finally {
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => void refresh(), 0)
    const interval = window.setInterval(() => void refresh(), 5_000)
    return () => {
      window.clearTimeout(initialRefresh)
      window.clearInterval(interval)
    }
  }, [refresh])

  const commonProfile = stats?.mostCommonProfile ? profileLabels[stats.mostCommonProfile] : null

  return (
    <main className="cyber-page relative min-h-screen overflow-hidden px-6 py-6 text-zinc-100 lg:px-10 lg:py-8">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-violet-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-[1600px]">
        <header className="cyber-panel flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="cyber-kicker">● Sys.broadcast // Transmisión en vivo</p>
            <h1 className="mt-2 font-display text-4xl font-black uppercase lg:text-6xl">¿Tienes mente de programador?</h1>
          </div>
          <div className="text-left text-sm text-zinc-500 sm:text-right">
            <span className="inline-flex items-center gap-2 font-bold text-emerald-300"><span aria-hidden="true" className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300" />EN VIVO</span>
            <p className="mt-1">Actualiza cada 5 segundos{lastUpdated ? ` · ${lastUpdated.toLocaleTimeString('es-CO')}` : ''}</p>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3" aria-label="Estadísticas de la feria">
          <article className="cyber-panel rounded-3xl p-5 lg:p-7">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Participantes</p>
            <p className="mt-2 text-5xl font-black text-cyan-300 lg:text-7xl">{stats?.participants ?? '—'}</p>
          </article>
          <article className="cyber-panel rounded-3xl p-5 lg:p-7">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Puntaje promedio</p>
            <p className="mt-2 text-5xl font-black text-violet-300 lg:text-7xl">{stats?.averageScore ?? '—'}</p>
          </article>
          <article className="cyber-panel rounded-3xl p-5 lg:p-7">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Perfil más frecuente</p>
            <div className="mt-3 flex items-center gap-4"><span className="text-4xl lg:text-6xl" aria-hidden="true">{commonProfile?.icon ?? '✨'}</span><p className="text-2xl font-black text-amber-200 lg:text-4xl">{commonProfile?.label ?? 'Sin resultados'}</p></div>
          </article>
        </section>

        <section className="cyber-panel mt-6 overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 lg:px-8">
            <h2 className="text-2xl font-black lg:text-3xl">Ranking</h2>
            <span className="text-sm font-bold text-zinc-500">MOSTRANDO {ranking.length} RESULTADOS</span>
          </div>
          <div className="grid divide-y divide-zinc-800 xl:grid-cols-2 xl:divide-x xl:divide-y-0">
            {[ranking.slice(0, Math.ceil(ranking.length / 2)), ranking.slice(Math.ceil(ranking.length / 2))].map((column, columnIndex) => (
              <ol key={columnIndex} className="divide-y divide-zinc-800" aria-label={columnIndex === 0 ? 'Primera parte del ranking' : 'Segunda parte del ranking'}>
                {column.map((entry) => (
                  <li key={`${entry.position}-${entry.alias}`} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 px-6 py-3.5 lg:px-8 lg:py-4">
                    <span className={`text-2xl font-black ${entry.position <= 3 ? 'text-amber-300' : 'text-zinc-500'}`}>#{entry.position}</span>
                    <div className="min-w-0"><p className="truncate text-lg font-black lg:text-xl">{entry.alias}</p><p className="truncate text-sm text-zinc-500">{profileLabels[entry.profile].icon} {profileLabels[entry.profile].label}</p></div>
                    <span className="text-2xl font-black text-cyan-300 lg:text-3xl">{entry.score}</span>
                  </li>
                ))}
                {column.length === 0 && <li className="px-8 py-10 text-center text-zinc-600">Esperando participantes…</li>}
              </ol>
            ))}
          </div>
          {hasMore && <div className="border-t border-zinc-800 p-4 text-center">
            <button type="button" onClick={loadMore} disabled={isLoadingMore} className="w-full rounded-2xl bg-violet-400 px-5 py-3 font-black text-zinc-950 hover:bg-violet-300 disabled:opacity-60 sm:w-auto sm:min-w-64">
              {isLoadingMore ? 'CARGANDO…' : 'VER 10 MÁS'}
            </button>
          </div>}
        </section>

        <p role="alert" className="mt-3 min-h-5 text-center text-sm text-rose-300">{error}</p>
      </section>
    </main>
  )
}

export default DashboardPage
