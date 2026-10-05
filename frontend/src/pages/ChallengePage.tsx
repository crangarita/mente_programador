import { useEffect, useRef, useState } from 'react'
import { finishParticipant, saveChallenge } from '../services/api'
import type { Participant } from '../types/participant'
import type { CommandBlock, CommandType, Direction } from '../types/challenge'
import type { FinalResult } from '../types/result'
import ResultPage from './ResultPage'

interface ChallengePageProps {
  participant: Participant
}

const commandLabels: Record<CommandType, string> = {
  FORWARD: 'AVANZAR',
  TURN_LEFT: 'GIRAR IZQUIERDA',
  TURN_RIGHT: 'GIRAR DERECHA',
  REPEAT: 'REPETIR',
}

const commandIcons: Record<CommandType, string> = {
  FORWARD: '↑',
  TURN_LEFT: '↶',
  TURN_RIGHT: '↷',
  REPEAT: '⟳',
}

const sleep = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

function ChallengePage({ participant }: ChallengePageProps) {
  const [commands, setCommands] = useState<CommandBlock[]>([])
  const [robotPosition, setRobotPosition] = useState(0)
  const [direction, setDirection] = useState<Direction>(0)
  const [attempts, setAttempts] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null)
  const startedAt = useRef<number | null>(null)

  useEffect(() => {
    startedAt.current = Date.now()
    const timer = window.setInterval(() => {
      if (startedAt.current !== null) {
        setElapsedSeconds(Math.floor((Date.now() - startedAt.current) / 1000))
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  function addCommand(type: CommandType, repeat?: number) {
    if (commands.length >= 10 || isRunning) return
    setCommands((current) => [...current, { id: crypto.randomUUID(), type, repeat }])
    setMessage('')
    setError('')
  }

  function moveCommand(index: number, offset: number) {
    const destination = index + offset
    if (destination < 0 || destination >= commands.length || isRunning) return
    setCommands((current) => {
      const next = [...current]
      const [block] = next.splice(index, 1)
      next.splice(destination, 0, block)
      return next
    })
  }

  function removeCommand(index: number) {
    if (isRunning) return
    setCommands((current) => current.filter((_, currentIndex) => currentIndex !== index))
  }

  function expandedCommands(): CommandType[] {
    const expanded: CommandType[] = []
    for (let index = 0; index < commands.length; index += 1) {
      const command = commands[index]
      if (command.type === 'REPEAT') {
        const next = commands[index + 1]
        if (!next || next.type === 'REPEAT') continue
        for (let count = 0; count < (command.repeat ?? 2); count += 1) expanded.push(next.type)
        index += 1
      } else {
        expanded.push(command.type)
      }
    }
    return expanded.slice(0, 30)
  }

  async function execute() {
    if (commands.length === 0 || isRunning) {
      setError('Agrega al menos un bloque antes de ejecutar.')
      return
    }

    setIsRunning(true)
    setError('')
    setMessage('')
    setRobotPosition(0)
    setDirection(0)
    await sleep(350)

    let currentPosition = 0
    let currentDirection: Direction = 0
    const nextAttempt = attempts + 1
    setAttempts(nextAttempt)

    for (const command of expandedCommands()) {
      if (command === 'TURN_LEFT') currentDirection = ((currentDirection + 3) % 4) as Direction
      if (command === 'TURN_RIGHT') currentDirection = ((currentDirection + 1) % 4) as Direction
      if (command === 'FORWARD') {
        if (currentDirection === 0) currentPosition = Math.min(4, currentPosition + 1)
        if (currentDirection === 2) currentPosition = Math.max(0, currentPosition - 1)
      }
      setDirection(currentDirection)
      setRobotPosition(currentPosition)
      await sleep(450)
    }

    const success = currentPosition === 4
    const finalElapsedMilliseconds = startedAt.current === null
      ? elapsedSeconds * 1000
      : Date.now() - startedAt.current

    try {
      await saveChallenge(participant.id, {
        success,
        attempts: nextAttempt,
        elapsedMilliseconds: finalElapsedMilliseconds,
      })
      if (success) {
        setMessage('¡Lo lograste! Calculando tu resultado…')
        setFinalResult(await finishParticipant(participant.id))
      } else {
        setMessage('El robot aún no llegó. Ajusta tus bloques e inténtalo otra vez.')
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos guardar el intento.')
    } finally {
      setIsRunning(false)
    }
  }

  if (finalResult) return <ResultPage result={finalResult} />

  function reset() {
    if (isRunning) return
    setCommands([])
    setRobotPosition(0)
    setDirection(0)
    setMessage('')
    setError('')
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-7 text-zinc-100 sm:px-6">
      <section className="mx-auto w-full max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <p className="font-black tracking-wide text-cyan-300">MENTE PROGRAMADOR</p>
          <div className="flex gap-2 text-xs text-zinc-400 sm:text-sm">
            <span className="rounded-full border border-zinc-800 px-3 py-1.5">Intentos: {attempts}</span>
            <span className="rounded-full border border-zinc-800 px-3 py-1.5">Tiempo: {elapsedSeconds}s</span>
          </div>
        </header>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Reto lógico</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Programa el robot</h1>
          <p className="mt-3 text-zinc-400">Ordena los bloques para llevar el robot hasta la meta. “Repetir” ejecuta varias veces el bloque que le sigue.</p>

          <div className="mt-7 grid grid-cols-5 gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 p-3 sm:gap-4 sm:p-5" aria-label="Tablero del reto">
            {[0, 1, 2, 3, 4].map((cell) => (
              <div key={cell} className={`relative flex aspect-square items-center justify-center rounded-xl border ${cell === 4 ? 'border-violet-400/60 bg-violet-400/10' : 'border-zinc-800 bg-zinc-900'}`}>
                {cell === 4 && <span className="text-2xl sm:text-4xl" aria-label="Meta">🎯</span>}
                {cell === robotPosition && (
                  <span
                    className="absolute text-2xl transition-all duration-300 sm:text-4xl"
                    style={{ transform: `rotate(${direction * 90}deg)` }}
                    aria-label={`Robot en posición ${robotPosition + 1}`}
                  >
                    🤖
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <section>
              <h2 className="font-bold text-zinc-200">Bloques disponibles</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" disabled={isRunning || commands.length >= 10} onClick={() => addCommand('FORWARD')} className="rounded-xl bg-cyan-300 px-3 py-3 font-bold text-zinc-950 disabled:opacity-50">↑ Avanzar</button>
                <button type="button" disabled={isRunning || commands.length >= 10} onClick={() => addCommand('TURN_LEFT')} className="rounded-xl bg-zinc-800 px-3 py-3 font-bold disabled:opacity-50">↶ Izquierda</button>
                <button type="button" disabled={isRunning || commands.length >= 10} onClick={() => addCommand('TURN_RIGHT')} className="rounded-xl bg-zinc-800 px-3 py-3 font-bold disabled:opacity-50">↷ Derecha</button>
                <button type="button" disabled={isRunning || commands.length >= 10} onClick={() => addCommand('REPEAT', 2)} className="rounded-xl bg-violet-400 px-3 py-3 font-bold text-zinc-950 disabled:opacity-50">⟳ Repetir 2</button>
                <button type="button" disabled={isRunning || commands.length >= 10} onClick={() => addCommand('REPEAT', 3)} className="rounded-xl bg-violet-400 px-3 py-3 font-bold text-zinc-950 disabled:opacity-50">⟳ Repetir 3</button>
                <button type="button" disabled={isRunning || commands.length >= 10} onClick={() => addCommand('REPEAT', 4)} className="rounded-xl bg-violet-400 px-3 py-3 font-bold text-zinc-950 disabled:opacity-50">⟳ Repetir 4</button>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-zinc-200">Tu algoritmo</h2>
                <span className="text-xs text-zinc-500">{commands.length}/10 bloques</span>
              </div>
              <ol className="mt-3 min-h-44 space-y-2 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/50 p-3">
                {commands.length === 0 && <li className="py-14 text-center text-sm text-zinc-600">Toca los bloques para agregarlos</li>}
                {commands.map((command, index) => (
                  <li key={command.id} className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 font-bold text-cyan-300">{commandIcons[command.type]}</span>
                    <span className="min-w-0 flex-1 text-sm font-bold">{commandLabels[command.type]} {command.repeat ?? ''}</span>
                    <button type="button" disabled={isRunning || index === 0} aria-label={`Subir bloque ${index + 1}`} onClick={() => moveCommand(index, -1)} className="rounded-md px-2 py-1 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30">↑</button>
                    <button type="button" disabled={isRunning || index === commands.length - 1} aria-label={`Bajar bloque ${index + 1}`} onClick={() => moveCommand(index, 1)} className="rounded-md px-2 py-1 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30">↓</button>
                    <button type="button" disabled={isRunning} aria-label={`Eliminar bloque ${index + 1}`} onClick={() => removeCommand(index)} className="rounded-md px-2 py-1 text-rose-400 hover:bg-rose-400/10 disabled:opacity-30">×</button>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <p role="status" className={`mt-5 min-h-6 text-center font-bold ${robotPosition === 4 ? 'text-emerald-300' : 'text-amber-300'}`}>{message}</p>
          <p role="alert" className="min-h-6 text-center text-sm text-rose-400">{error}</p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={reset} disabled={isRunning} className="rounded-2xl border border-zinc-700 px-5 py-4 font-black hover:bg-zinc-800 disabled:opacity-50">REINICIAR</button>
            <button type="button" onClick={execute} disabled={isRunning} className="rounded-2xl bg-cyan-300 px-5 py-4 font-black text-zinc-950 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60">{isRunning ? 'EJECUTANDO…' : 'EJECUTAR'}</button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ChallengePage
