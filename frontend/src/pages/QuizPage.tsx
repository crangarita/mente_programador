import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import { questions } from '../data/questions'
import { saveAnswer } from '../services/api'
import type { Participant } from '../types/participant'
import type { Profile, QuizOption } from '../types/quiz'
import BrandHeader from '../components/BrandHeader'

interface QuizPageProps {
  participant: Participant
  onContinue: () => void
}

const profileNames: Record<Profile, string> = {
  FRONTEND_CREATOR: 'Frontend Creator',
  BACKEND_ARCHITECT: 'Backend Architect',
  AI_EXPLORER: 'AI Explorer',
  CYBER_GUARDIAN: 'Cyber Guardian',
  DATA_DETECTIVE: 'Data Detective',
  GAME_BUILDER: 'Game Builder',
}

function QuizPage({ participant, onContinue }: QuizPageProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null)
  const [preliminaryProfile, setPreliminaryProfile] = useState<Profile | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const question = questions[questionIndex]

  async function continueQuiz() {
    if (!selectedOption) {
      setError('Selecciona una opción para continuar.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const result = await saveAnswer(participant.id, question.number, selectedOption)
      setPreliminaryProfile(result.preliminaryProfile)

      if (questionIndex < questions.length - 1) {
        setQuestionIndex((current) => current + 1)
        setSelectedOption(null)
      } else {
        sessionStorage.setItem('quizComplete', participant.id)
        sessionStorage.setItem('preliminaryProfile', result.preliminaryProfile)
        setIsComplete(true)
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos guardar tu respuesta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isComplete && preliminaryProfile) {
    return (
      <main className="cyber-page flex min-h-screen items-center justify-center px-5 py-10 text-zinc-100">
        <section className="w-full max-w-lg rounded-3xl border border-violet-400/30 bg-zinc-900 p-8 text-center shadow-2xl shadow-violet-500/10">
          <div className="text-5xl" aria-hidden="true">🧠</div>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Test completado</p>
          <h1 className="mt-3 text-3xl font-black">Buen trabajo, {participant.alias}</h1>
          <p className="mt-5 text-zinc-400">Tu perfil preliminar es</p>
          <p className="mt-2 text-2xl font-black text-cyan-300">{profileNames[preliminaryProfile]}</p>
          <button
            type="button"
            onClick={onContinue}
            className="mt-8 w-full rounded-2xl bg-cyan-300 px-5 py-4 font-black text-zinc-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30"
          >
            CONTINUAR AL RETO
          </button>
        </section>
      </main>
    )
  }

  return (
    <div className="cyber-page min-h-screen text-zinc-100"><BrandHeader active="QUIZ" />
      <main className="px-4 py-8 sm:px-6"><section className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between"><p className="cyber-kicker">Nivel 01 · Calibración neural</p><p className="rounded-full bg-cyber-800 px-4 py-2 font-mono text-xs text-zinc-300">PLAYER: {participant.alias}</p></div>

        <div className="cyber-panel rounded-3xl p-5 sm:p-8">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_1.5fr_auto]"><div><p className="cyber-kicker">Pregunta {String(question.number).padStart(2, '0')} / 05</p><p className="mt-1 font-display text-xl font-bold">Calibración de perfil</p></div><ProgressBar current={question.number} total={questions.length} /><div className="rounded-xl bg-cyber-600 px-4 py-3 font-mono text-xs text-violet-200">+{question.number * 90} XP</div></div>
          <h1 className="mt-8 max-w-4xl font-display text-3xl font-black leading-tight sm:text-5xl">{question.text}</h1>

          <fieldset className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <legend className="sr-only">Selecciona una respuesta</legend>
            {question.options.map((option) => {
              const selected = selectedOption === option.id
              return (
                <label
                  key={option.id}
                  className={`min-h-36 cursor-pointer rounded-2xl border p-5 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-cyan-300/30 ${
                    selected
                      ? 'border-cyan-300 bg-cyan-300/10 ring-2 ring-cyan-300/20'
                      : 'border-zinc-700 bg-zinc-950/50 hover:border-zinc-500'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.number}`}
                    value={option.id}
                    checked={selected}
                    onChange={() => {
                      setSelectedOption(option.id)
                      setError('')
                    }}
                    className="sr-only"
                  />
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyber-950 text-2xl" aria-hidden="true">{option.icon}</span>
                  <span className="float-right rounded-md bg-cyber-600 px-2 py-1 font-mono text-[9px] tracking-wider text-neon-cyan">[{option.tag}]</span>
                  <span className="mt-5 block font-display text-lg font-bold text-zinc-100">0{option.id.charCodeAt(0) - 64} · {option.label}</span>
                  <span className="mt-2 block text-sm leading-5 text-zinc-400">{option.description}</span>
                  <span className="mt-4 block font-mono text-[10px] tracking-wider text-neon-cyan">{option.technology}</span>
                </label>
              )
            })}
          </fieldset>

          <p role="alert" className="mt-4 min-h-6 text-sm text-rose-400">{error}</p>
          <button
            type="button"
            onClick={continueQuiz}
            disabled={isSubmitting}
            className="cyber-primary mt-3 w-full rounded-2xl px-8 py-4 font-display font-black transition focus:outline-none focus:ring-4 focus:ring-cyan-300/30 disabled:cursor-wait disabled:opacity-60 sm:ml-auto sm:block sm:w-auto sm:min-w-56"
          >
            {isSubmitting ? 'GUARDANDO…' : questionIndex === questions.length - 1 ? 'FINALIZAR TEST' : 'SIGUIENTE'}
          </button>
        </div>
      </section></main>
    </div>
  )
}

export default QuizPage
