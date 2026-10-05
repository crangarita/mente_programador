import type { Participant } from '../types/participant'
import type { AnswerResult, QuizOption } from '../types/quiz'
import type { ChallengeResult } from '../types/challenge'
import type { FinalResult } from '../types/result'
import type { RankingEntry } from '../types/ranking'
import type { EventStats } from '../types/stats'

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

interface ApiErrorBody {
  message?: string
  errors?: Record<string, string>
}

export async function createParticipant(alias: string): Promise<Participant> {
  const response = await fetch(`${apiUrl}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alias }),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new Error(body.errors?.alias ?? body.message ?? 'No pudimos registrar tu alias.')
  }

  return response.json() as Promise<Participant>
}

export async function saveAnswer(
  participantId: string,
  questionNumber: number,
  selectedOption: QuizOption,
): Promise<AnswerResult> {
  const response = await fetch(`${apiUrl}/participants/${participantId}/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionNumber, selectedOption }),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new Error(body.message ?? 'No pudimos guardar tu respuesta.')
  }

  return response.json() as Promise<AnswerResult>
}

export async function saveChallenge(
  participantId: string,
  result: Omit<ChallengeResult, 'id'>,
): Promise<ChallengeResult> {
  const response = await fetch(`${apiUrl}/participants/${participantId}/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new Error(body.message ?? 'No pudimos guardar el resultado del reto.')
  }

  return response.json() as Promise<ChallengeResult>
}

export async function finishParticipant(participantId: string): Promise<FinalResult> {
  const response = await fetch(`${apiUrl}/participants/${participantId}/finish`, { method: 'POST' })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new Error(body.message ?? 'No pudimos calcular tu resultado.')
  }
  return response.json() as Promise<FinalResult>
}

export async function getRanking(limit = 10): Promise<RankingEntry[]> {
  const response = await fetch(`${apiUrl}/ranking?limit=${limit}`)
  if (!response.ok) throw new Error('No pudimos cargar el ranking.')
  return response.json() as Promise<RankingEntry[]>
}

export async function getStats(): Promise<EventStats> {
  const response = await fetch(`${apiUrl}/stats`)
  if (!response.ok) throw new Error('No pudimos cargar las estadísticas.')
  return response.json() as Promise<EventStats>
}
