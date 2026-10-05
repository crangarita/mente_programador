import { FormEvent, useState } from 'react'
import { createParticipant } from '../services/api'
import type { Participant } from '../types/participant'

const MIN_ALIAS_LENGTH = 2
const MAX_ALIAS_LENGTH = 30

interface RegisterPageProps {
  onRegistered: (participant: Participant) => void
}

function RegisterPage({ onRegistered }: RegisterPageProps) {
  const [alias, setAlias] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedAlias = alias.trim()

    if (normalizedAlias.length < MIN_ALIAS_LENGTH || normalizedAlias.length > MAX_ALIAS_LENGTH) {
      setError('El alias debe tener entre 2 y 30 caracteres.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const createdParticipant = await createParticipant(normalizedAlias)
      sessionStorage.setItem('participant', JSON.stringify(createdParticipant))
      onRegistered(createdParticipant)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ocurrió un error inesperado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-5 py-10 text-zinc-100">
      <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
      <section className="relative w-full max-w-md rounded-3xl border border-cyan-400/20 bg-zinc-900/90 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur sm:p-9">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Mente Programador</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">¿Cómo quieres aparecer en el ranking?</h1>
          <p className="mt-3 text-zinc-400">Elige un alias. No necesitamos ningún dato personal.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="alias" className="mb-2 block text-sm font-semibold text-zinc-200">
            Alias
          </label>
          <input
            id="alias"
            name="alias"
            type="text"
            autoComplete="off"
            autoFocus
            maxLength={MAX_ALIAS_LENGTH}
            value={alias}
            onChange={(event) => {
              setAlias(event.target.value)
              if (error) setError('')
            }}
            aria-describedby="alias-help alias-error"
            aria-invalid={Boolean(error)}
            placeholder="Ej. ByteMaster"
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-4 text-lg text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
          />
          <div className="mt-2 flex min-h-6 items-start justify-between gap-4 text-xs">
            <p id="alias-error" role="alert" className="text-rose-400">{error}</p>
            <p id="alias-help" className="ml-auto shrink-0 text-zinc-500">{alias.length}/{MAX_ALIAS_LENGTH}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-base font-black tracking-wide text-zinc-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? 'CREANDO SESIÓN…' : 'CONTINUAR'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default RegisterPage
