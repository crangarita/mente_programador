import { useState } from 'react'
import { getRanking } from '../services/api'
import type { RankingEntry } from '../types/ranking'
import BrandHeader from '../components/BrandHeader'

const profileLabels: Record<RankingEntry['profile'], { label: string; icon: string }> = {
  FRONTEND_CREATOR: { label: 'Creador Frontend', icon: '🎨' },
  BACKEND_ARCHITECT: { label: 'Arquitecto Backend', icon: '⚙️' },
  AI_EXPLORER: { label: 'Explorador de IA', icon: '🤖' },
  CYBER_GUARDIAN: { label: 'Guardián Cibernético', icon: '🛡️' },
  DATA_DETECTIVE: { label: 'Detective de Datos', icon: '📊' },
  GAME_BUILDER: { label: 'Constructor de Juegos', icon: '🎮' },
}

interface RankingPageProps {
  ranking: RankingEntry[]
  onBack: () => void
}

function RankingPage({ ranking, onBack }: RankingPageProps) {
  const [entries, setEntries] = useState(ranking.slice(0, 10))
  const [hasMore, setHasMore] = useState(ranking.length > 10)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadError, setLoadError] = useState('')

  async function loadMore() {
    const nextLimit = entries.length + 10
    setIsLoadingMore(true)
    setLoadError('')
    try {
      const nextRanking = await getRanking(nextLimit + 1)
      setEntries(nextRanking.slice(0, nextLimit))
      setHasMore(nextRanking.length > nextLimit)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'No pudimos cargar más resultados.')
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <div className="cyber-page min-h-screen text-zinc-100"><BrandHeader active="RANKING" />
    <main className="px-4 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-4xl">
        <header className="text-center">
          <p className="cyber-kicker">● Live leaderboard · Stand Ingeniería de Sistemas</p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">🏆 Ranking de la feria</h1>
          <p className="mt-3 text-zinc-400">Las mentes programadoras con mayor puntaje.</p>
        </header>

        <div className="cyber-panel mt-8 overflow-hidden rounded-3xl">
          <div className="hidden grid-cols-[5rem_1fr_1.2fr_7rem] gap-4 border-b border-zinc-800 px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500 sm:grid">
            <span>Posición</span><span>Alias</span><span>Perfil</span><span className="text-right">Puntaje</span>
          </div>
          <ol aria-label="Ranking de participantes" className="divide-y divide-zinc-800">
            {entries.map((entry) => {
              const profile = profileLabels[entry.profile]
              const medal = entry.position === 1 ? '🥇' : entry.position === 2 ? '🥈' : entry.position === 3 ? '🥉' : `#${entry.position}`
              return (
                <li key={`${entry.position}-${entry.alias}`} className={`grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[5rem_1fr_1.2fr_7rem] sm:gap-4 sm:px-6 ${entry.position <= 3 ? 'bg-cyan-300/[0.04]' : ''}`}>
                  <span className="text-xl font-black text-amber-300">{medal}</span>
                  <span className="min-w-0 truncate font-black text-white">{entry.alias}</span>
                  <span className="col-span-2 flex items-center gap-2 text-sm text-zinc-300 sm:col-span-1"><span aria-hidden="true">{profile.icon}</span>{profile.label}</span>
                  <span className="text-right text-xl font-black text-cyan-300">{entry.score}</span>
                </li>
              )
            })}
            {entries.length === 0 && <li className="px-5 py-14 text-center text-zinc-500">Aún no hay resultados en el ranking.</li>}
          </ol>
        </div>

        <p role="alert" className="mt-3 min-h-5 text-center text-sm text-rose-400">{loadError}</p>
        {hasMore && (
          <button type="button" onClick={loadMore} disabled={isLoadingMore} className="mt-2 w-full rounded-2xl bg-violet-400 px-5 py-4 font-black text-zinc-950 hover:bg-violet-300 disabled:opacity-60">
            {isLoadingMore ? 'CARGANDO…' : 'VER 10 MÁS'}
          </button>
        )}

        <button type="button" onClick={onBack} className="mt-3 w-full rounded-2xl border border-zinc-700 px-5 py-4 font-black hover:bg-zinc-900">VOLVER A MI RESULTADO</button>
      </section>
    </main></div>
  )
}

export default RankingPage
