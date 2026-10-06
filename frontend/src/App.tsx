import { useState } from 'react'
import RegisterPage from './pages/RegisterPage'
import QuizPage from './pages/QuizPage'
import ChallengePage from './pages/ChallengePage'
import DashboardPage from './pages/DashboardPage'
import RankingPage from './pages/RankingPage'
import WelcomePage from './pages/WelcomePage'
import ResultPage from './pages/ResultPage'
import type { Participant } from './types/participant'
import type { FinalResult } from './types/result'

function storedParticipant(): Participant | null {
  const value = sessionStorage.getItem('participant')
  if (!value) return null

  try {
    return JSON.parse(value) as Participant
  } catch {
    sessionStorage.removeItem('participant')
    return null
  }
}

function storedFinalResult(): FinalResult | null {
  try { return JSON.parse(sessionStorage.getItem('finalResult') ?? 'null') as FinalResult | null }
  catch { sessionStorage.removeItem('finalResult'); return null }
}

function App() {
  const [participant, setParticipant] = useState<Participant | null>(storedParticipant)
  const [finalResult] = useState<FinalResult | null>(storedFinalResult)
  const [started, setStarted] = useState(() => sessionStorage.getItem('experienceStarted') === 'true')
  const [showChallenge, setShowChallenge] = useState(
    () => participant !== null && sessionStorage.getItem('quizComplete') === participant.id,
  )

  if (window.location.pathname === '/dashboard') return <DashboardPage />
  if (window.location.pathname === '/ranking') return <RankingPage />

  if (!participant && !started) return <WelcomePage onStart={() => { sessionStorage.setItem('experienceStarted', 'true'); setStarted(true) }} />

  if (participant) {
    if (finalResult?.alias === participant.alias) return <ResultPage result={finalResult} />
    if (showChallenge) {
      return <ChallengePage participant={participant} />
    }

    return <QuizPage participant={participant} onContinue={() => setShowChallenge(true)} />
  }

  return <RegisterPage onRegistered={setParticipant} />
}

export default App
