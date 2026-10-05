import { useEffect, useRef, useState } from 'react'
import { finishParticipant, getChallenge, saveChallenge } from '../services/api'
import type { Participant } from '../types/participant'
import type { ChallengeCell, ChallengeDefinition, CommandBlock, CommandType, Direction } from '../types/challenge'
import type { FinalResult } from '../types/result'
import ResultPage from './ResultPage'

interface ChallengePageProps { participant: Participant }

const commandLabels: Record<CommandType, string> = {
  FORWARD: 'AVANZAR', TURN_LEFT: 'GIRAR IZQUIERDA', TURN_RIGHT: 'GIRAR DERECHA', REPEAT: 'REPETIR',
}
const commandIcons: Record<CommandType, string> = {
  FORWARD: '↑', TURN_LEFT: '↶', TURN_RIGHT: '↷', REPEAT: '⟳',
}
const sleep = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))
const cellKey = (cell: ChallengeCell) => `${cell.row}-${cell.column}`

function ChallengePage({ participant }: ChallengePageProps) {
  const [challenge, setChallenge] = useState<ChallengeDefinition | null>(null)
  const [commands, setCommands] = useState<CommandBlock[]>([])
  const [robotPosition, setRobotPosition] = useState<ChallengeCell | null>(null)
  const [direction, setDirection] = useState<Direction>(0)
  const [attempts, setAttempts] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null)
  const startedAt = useRef<number | null>(null)

  useEffect(() => {
    let active = true
    getChallenge(participant.id).then((assigned) => {
      if (!active) return
      setChallenge(assigned)
      setRobotPosition(assigned.start)
      setDirection(assigned.startDirection)
      startedAt.current = Date.now()
    }).catch((requestError) => {
      if (active) setError(requestError instanceof Error ? requestError.message : 'No pudimos cargar el reto.')
    })
    return () => { active = false }
  }, [participant.id])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (startedAt.current !== null) setElapsedSeconds(Math.floor((Date.now() - startedAt.current) / 1000))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  function addCommand(type: CommandType, repeat?: number) {
    if (commands.length >= 10 || isRunning) return
    setCommands((current) => [...current, { id: crypto.randomUUID(), type, repeat }])
    setMessage(''); setError('')
  }

  function moveCommand(index: number, offset: number) {
    const destination = index + offset
    if (destination < 0 || destination >= commands.length || isRunning) return
    setCommands((current) => {
      const next = [...current]; const [block] = next.splice(index, 1); next.splice(destination, 0, block); return next
    })
  }

  function removeCommand(index: number) {
    if (!isRunning) setCommands((current) => current.filter((_, currentIndex) => currentIndex !== index))
  }

  function expandedCommands(): Exclude<CommandType, 'REPEAT'>[] {
    const expanded: Exclude<CommandType, 'REPEAT'>[] = []
    for (let index = 0; index < commands.length; index += 1) {
      const command = commands[index]
      if (command.type === 'REPEAT') {
        const next = commands[index + 1]
        if (!next || next.type === 'REPEAT') continue
        for (let count = 0; count < (command.repeat ?? 2); count += 1) expanded.push(next.type)
        index += 1
      } else expanded.push(command.type)
    }
    return expanded.slice(0, 30)
  }

  async function execute() {
    if (!challenge || commands.length === 0 || isRunning) {
      if (challenge) setError('Agrega al menos un bloque antes de ejecutar.')
      return
    }
    setIsRunning(true); setError(''); setMessage('')
    setRobotPosition(challenge.start); setDirection(challenge.startDirection)
    await sleep(350)

    let row = challenge.start.row
    let column = challenge.start.column
    let currentDirection = challenge.startDirection
    const obstacles = new Set(challenge.obstacles.map(cellKey))
    const nextAttempt = attempts + 1
    const expanded = expandedCommands()
    setAttempts(nextAttempt)

    for (const command of expanded) {
      if (command === 'TURN_LEFT') currentDirection = ((currentDirection + 3) % 4) as Direction
      if (command === 'TURN_RIGHT') currentDirection = ((currentDirection + 1) % 4) as Direction
      if (command === 'FORWARD') {
        const nextRow = row + [-1, 0, 1, 0][currentDirection]
        const nextColumn = column + [0, 1, 0, -1][currentDirection]
        if (nextRow >= 0 && nextRow < challenge.rows && nextColumn >= 0 && nextColumn < challenge.columns
          && !obstacles.has(`${nextRow}-${nextColumn}`)) {
          row = nextRow; column = nextColumn
        }
      }
      setDirection(currentDirection); setRobotPosition({ row, column }); await sleep(350)
    }

    const success = row === challenge.target.row && column === challenge.target.column
    const elapsedMilliseconds = startedAt.current === null ? elapsedSeconds * 1000 : Date.now() - startedAt.current
    try {
      const saved = await saveChallenge(participant.id, {
        challengeId: challenge.id, commands: expanded, attempts: nextAttempt, elapsedMilliseconds,
      })
      if (saved.success && success) {
        setMessage('¡Lo lograste! Calculando tu resultado…')
        setFinalResult(await finishParticipant(participant.id))
      } else setMessage('El robot aún no llegó. Ajusta tus bloques e inténtalo otra vez.')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos guardar el intento.')
    } finally { setIsRunning(false) }
  }

  if (finalResult) return <ResultPage result={finalResult} />

  function reset() {
    if (isRunning || !challenge) return
    setCommands([]); setRobotPosition(challenge.start); setDirection(challenge.startDirection); setMessage(''); setError('')
  }

  const obstacleKeys = new Set(challenge?.obstacles.map(cellKey) ?? [])
  const cells = challenge ? Array.from({ length: challenge.rows * challenge.columns }, (_, index) => ({
    row: Math.floor(index / challenge.columns), column: index % challenge.columns,
  })) : []

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-4 text-zinc-100 sm:px-6 lg:py-5">
      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-4 flex items-center justify-between gap-4">
          <p className="font-black tracking-wide text-cyan-300">MENTE PROGRAMADOR</p>
          <div className="flex gap-2 text-xs text-zinc-400 sm:text-sm">
            <span className="rounded-full border border-zinc-800 px-3 py-1.5">Intentos: {attempts}</span>
            <span className="rounded-full border border-zinc-800 px-3 py-1.5">Tiempo: {elapsedSeconds}s</span>
          </div>
        </header>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl sm:p-6 lg:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Reto lógico · {challenge?.name ?? 'Asignando ruta…'}</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Programa el robot</h1>
          <p className="mt-2 text-zinc-400">Llega a la meta sin chocar con los bloques. “Repetir” ejecuta varias veces el bloque que le sigue.</p>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.22fr)] lg:items-start">
            <div className="mx-auto grid w-full max-w-md grid-cols-5 gap-1.5 rounded-2xl border border-zinc-700 bg-zinc-950 p-3 sm:gap-2" aria-label="Tablero del reto">
              {cells.map((cell) => {
                const isTarget = challenge && cellKey(cell) === cellKey(challenge.target)
                const isRobot = robotPosition && cellKey(cell) === cellKey(robotPosition)
                const isObstacle = obstacleKeys.has(cellKey(cell))
                return <div key={cellKey(cell)} className={`relative flex aspect-square items-center justify-center rounded-lg border ${isTarget ? 'border-violet-400/60 bg-violet-400/10' : isObstacle ? 'border-rose-400/30 bg-rose-400/15' : 'border-zinc-800 bg-zinc-900'}`}>
                  {isTarget && <span className="text-xl sm:text-2xl" aria-label="Meta">🎯</span>}
                  {isObstacle && <span className="text-lg opacity-80 sm:text-xl" aria-label="Obstáculo">🧱</span>}
                  {isRobot && <span className="absolute text-xl transition-all duration-300 sm:text-2xl" style={{ transform: `rotate(${direction * 90}deg)` }} aria-label="Robot">🤖</span>}
                </div>
              })}
            </div>

            <div>
              <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
            <section><h2 className="font-bold text-zinc-200">Bloques disponibles</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" disabled={!challenge || isRunning || commands.length >= 10} onClick={() => addCommand('FORWARD')} className="rounded-xl bg-cyan-300 px-3 py-3 font-bold text-zinc-950 disabled:opacity-50">↑ Avanzar</button>
                <button type="button" disabled={!challenge || isRunning || commands.length >= 10} onClick={() => addCommand('TURN_LEFT')} className="rounded-xl bg-zinc-800 px-3 py-3 font-bold disabled:opacity-50">↶ Izquierda</button>
                <button type="button" disabled={!challenge || isRunning || commands.length >= 10} onClick={() => addCommand('TURN_RIGHT')} className="rounded-xl bg-zinc-800 px-3 py-3 font-bold disabled:opacity-50">↷ Derecha</button>
                {[2, 3, 4].map((repeat) => <button key={repeat} type="button" disabled={!challenge || isRunning || commands.length >= 10} onClick={() => addCommand('REPEAT', repeat)} className="rounded-xl bg-violet-400 px-3 py-3 font-bold text-zinc-950 disabled:opacity-50">⟳ Repetir {repeat}</button>)}
              </div>
            </section>
            <section><div className="flex items-center justify-between"><h2 className="font-bold text-zinc-200">Tu algoritmo</h2><span className="text-xs text-zinc-500">{commands.length}/10 bloques</span></div>
              <ol className="mt-3 min-h-44 space-y-2 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/50 p-3">
                {commands.length === 0 && <li className="py-14 text-center text-sm text-zinc-600">Toca los bloques para agregarlos</li>}
                {commands.map((command, index) => <li key={command.id} className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 font-bold text-cyan-300">{commandIcons[command.type]}</span>
                  <span className="min-w-0 flex-1 text-sm font-bold">{commandLabels[command.type]} {command.repeat ?? ''}</span>
                  <button type="button" disabled={isRunning || index === 0} aria-label={`Subir bloque ${index + 1}`} onClick={() => moveCommand(index, -1)} className="rounded-md px-2 py-1 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30">↑</button>
                  <button type="button" disabled={isRunning || index === commands.length - 1} aria-label={`Bajar bloque ${index + 1}`} onClick={() => moveCommand(index, 1)} className="rounded-md px-2 py-1 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30">↓</button>
                  <button type="button" disabled={isRunning} aria-label={`Eliminar bloque ${index + 1}`} onClick={() => removeCommand(index)} className="rounded-md px-2 py-1 text-rose-400 hover:bg-rose-400/10 disabled:opacity-30">×</button>
                </li>)}
              </ol>
            </section>
              </div>
              <p role="status" className="mt-3 min-h-6 text-center font-bold text-amber-300">{message}</p>
              <p role="alert" className="min-h-5 text-center text-sm text-rose-400">{error}</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={reset} disabled={!challenge || isRunning} className="rounded-2xl border border-zinc-700 px-5 py-3 font-black hover:bg-zinc-800 disabled:opacity-50">REINICIAR</button>
                <button type="button" onClick={execute} disabled={!challenge || isRunning} className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-zinc-950 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60">{isRunning ? 'EJECUTANDO…' : 'EJECUTAR'}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ChallengePage
