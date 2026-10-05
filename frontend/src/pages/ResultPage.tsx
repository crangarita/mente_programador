import { useState } from 'react'
import ProfileCard from '../components/ProfileCard'
import { getRanking } from '../services/api'
import type { RankingEntry } from '../types/ranking'
import type { FinalResult } from '../types/result'
import RankingPage from './RankingPage'
import BrandHeader from '../components/BrandHeader'

function ResultPage({ result }: { result: FinalResult }) {
  const [ranking, setRanking] = useState<RankingEntry[] | null>(null)
  const [loadingRanking, setLoadingRanking] = useState(false)
  const [rankingError, setRankingError] = useState('')

  async function showRanking() {
    setLoadingRanking(true)
    setRankingError('')
    try {
      setRanking(await getRanking(11))
    } catch (error) {
      setRankingError(error instanceof Error ? error.message : 'No pudimos cargar el ranking.')
    } finally {
      setLoadingRanking(false)
    }
  }

  if (ranking) return <RankingPage ranking={ranking} onBack={() => setRanking(null)} />

  return (
    <div className="cyber-page min-h-screen text-zinc-100"><BrandHeader active="RESULTADO" />
    <main className="px-4 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-3xl">
        <header className="mb-7 text-center">
          <p className="cyber-kicker">● Diagnóstico completado // Calibración 100%</p>
          <h1 className="mt-3 font-display text-3xl font-black sm:text-5xl">¡{result.alias}, tu perfil tecnológico es extraordinario!</h1>
        </header>

        <ProfileCard profile={result.profile} />

        <section className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Resumen del resultado">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center">
            <p className="text-sm text-zinc-400">Test</p><p className="mt-1 text-2xl font-black text-cyan-300">{result.testScore}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center">
            <p className="text-sm text-zinc-400">Reto</p><p className="mt-1 text-2xl font-black text-cyan-300">{result.challengeScore}</p>
          </div>
          <div className="rounded-2xl border border-cyan-300/40 bg-cyan-300/10 p-5 text-center">
            <p className="text-sm text-cyan-100">Puntaje total</p><p className="mt-1 text-3xl font-black text-cyan-300">{result.score}<span className="text-base">/1000</span></p>
          </div>
        </section>

        <div className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-5 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-200">Posición actual</p>
          <p className="mt-1 text-4xl font-black text-amber-300">#{result.rankingPosition}</p>
        </div>

        <p role="alert" className="mt-3 min-h-6 text-center text-sm text-rose-400">{rankingError}</p>
        <button type="button" onClick={showRanking} disabled={loadingRanking} className="cyber-primary mt-2 w-full rounded-2xl px-5 py-4 font-display font-black disabled:opacity-60">
          {loadingRanking ? 'CARGANDO…' : 'VER RANKING'}
        </button>
      </section>
    </main></div>
  )
}

export default ResultPage
