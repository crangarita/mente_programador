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
  const avatars = [
    { icon: '🐰', name: 'Cyber Cat', code: 'AGILIDAD LOGIC' },
    { icon: '🤖', name: 'Glitch Bot', code: 'CORE SYSTEM' },
    { icon: '🦊', name: 'Neon Fox', code: 'STEALTH BUG' },
    { icon: '🥷', name: 'Code Ninja', code: 'REFACTOR EXEC' },
    { icon: '〽️', name: 'Synth Wave', code: 'AI AUDIO DSP' },
    { icon: '🛡️', name: 'Pixel Knight', code: 'CYBER SHIELD' },
  ]
  const [avatar, setAvatar] = useState(avatars[0].icon)

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
      const participantWithAvatar = { ...createdParticipant, avatar }
      sessionStorage.setItem('participant', JSON.stringify(participantWithAvatar))
      onRegistered(participantWithAvatar)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ocurrió un error inesperado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="cyber-page flex min-h-screen flex-col text-zinc-100">
      <BrandHeader active="REGISTRO" />
      <main className="relative flex flex-1 justify-center overflow-hidden px-5 py-10">
      <section className="w-full max-w-6xl">
        <div className="mb-8 text-center">
          <p className="cyber-kicker">● Paso 1 de 3 · Crea tu identidad</p>
          <h1 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl">¿Cómo quieres aparecer en el ranking?</h1>
          <p className="mt-3 text-lg text-zinc-400">Configura tu credencial de aspirante. Sin correos ni contraseñas.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[.7fr_1.5fr]">
          <aside className="space-y-5"><div className="cyber-panel rounded-3xl p-6 text-center"><p className="cyber-kicker text-left">Player ID hologram</p><div className="mx-auto mt-7 grid h-32 w-32 place-items-center rounded-2xl bg-cyber-600 text-6xl shadow-neon">{avatar}</div><p className="mt-5 font-mono text-xs uppercase tracking-widest text-zinc-500">Alias registrado</p><p className="mt-2 font-display text-2xl font-bold">{alias || 'Sin identificar'}</p><p className="mt-3 font-mono text-xs text-neon-cyan">● LISTO PARA EL DESAFÍO</p></div><div className="cyber-panel rounded-3xl p-6"><h2 className="font-display text-xl font-bold">🛡️ Acceso rápido</h2><p className="mt-2 text-zinc-400">Sin correos ni contraseñas. Solo tu alias para la tabla de líderes.</p></div></aside>
        <form onSubmit={handleSubmit} noValidate className="cyber-panel rounded-3xl p-6 sm:p-8">
          <div className="mb-7 flex items-center justify-between"><h2 className="font-display text-2xl font-bold">☺ 1. Elige tu avatar Cyberpunk</h2><span className="cyber-kicker">6 identidades</span></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{avatars.map((item) => <button key={item.name} type="button" onClick={() => setAvatar(item.icon)} className={`rounded-2xl border p-4 text-center transition ${avatar === item.icon ? 'border-neon-cyan bg-cyan-400/10 shadow-neon' : 'border-white/[.06] bg-cyber-600 hover:border-white/20'}`}><span className="text-3xl">{item.icon}</span><span className="mt-2 block font-display font-bold">{item.name}</span><span className="mt-1 block font-mono text-[9px] tracking-wider text-zinc-400">{item.code}</span></button>)}</div>
          <label htmlFor="alias" className="mb-2 block text-sm font-semibold text-zinc-200">
            <span className="mt-8 block font-display text-2xl font-bold">⌨ 2. Escribe tu nombre o alias</span>
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
        </div>
      </section>
      </main><BrandFooter />
    </div>
  )
}

export default RegisterPage
