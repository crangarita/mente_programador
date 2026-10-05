import { useState } from 'react'
import RegisterPage from './pages/RegisterPage'
import QuizPage from './pages/QuizPage'
import ChallengePage from './pages/ChallengePage'
import DashboardPage from './pages/DashboardPage'
import type { Participant } from './types/participant'

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

function App() {
  const [participant, setParticipant] = useState<Participant | null>(storedParticipant)
  const [showChallenge, setShowChallenge] = useState(
    () => participant !== null && sessionStorage.getItem('quizComplete') === participant.id,
  )

  if (window.location.pathname === '/dashboard') return <DashboardPage />

  if (participant) {
    if (showChallenge) {
      return <ChallengePage participant={participant} />
    }

    return <QuizPage participant={participant} onContinue={() => setShowChallenge(true)} />
  }

  return <RegisterPage onRegistered={setParticipant} />
}

export default App
