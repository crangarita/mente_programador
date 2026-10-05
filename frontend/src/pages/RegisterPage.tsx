import { FormEvent, useState } from 'react'
import { createParticipant } from '../services/api'
import type { Participant } from '../types/participant'
import BrandHeader from '../components/BrandHeader'
import BrandFooter from '../components/BrandFooter'

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
    <div className="cyber-page flex min-h-screen flex-col text-zinc-100">
      <BrandHeader active="REGISTRO" />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-10">
      <section className="cyber-panel relative w-full max-w-3xl rounded-3xl p-6 sm:p-10">
        <div className="mb-8">
          <p className="cyber-kicker">● Paso 1 de 3 · Crea tu identidad</p>
          <h1 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl">¿Cómo quieres aparecer en el ranking?</h1>
          <p className="mt-3 text-lg text-zinc-400">Configura tu credencial de aspirante. Sin correos ni contraseñas.</p>
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
            className="w-full rounded-2xl border border-white/10 bg-cyber-950 px-5 py-5 font-mono text-xl text-white outline-none transition placeholder:text-zinc-600 focus:border-neon-cyan focus:ring-4 focus:ring-cyan-400/10"
          />
          <div className="mt-2 flex min-h-6 items-start justify-between gap-4 text-xs">
            <p id="alias-error" role="alert" className="text-rose-400">{error}</p>
            <p id="alias-help" className="ml-auto shrink-0 text-zinc-500">{alias.length}/{MAX_ALIAS_LENGTH}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cyber-primary mt-6 w-full rounded-2xl px-5 py-4 font-display text-base font-black tracking-wide transition focus:outline-none focus:ring-4 focus:ring-cyan-300/30 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? 'CREANDO SESIÓN…' : 'CONTINUAR'}
          </button>
        </form>
      </section>
      </main><BrandFooter />
    </div>
  )
}

export default RegisterPage
