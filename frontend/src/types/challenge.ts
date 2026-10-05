export type Direction = 0 | 1 | 2 | 3
export type CommandType = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'REPEAT'

export interface CommandBlock {
  id: string
  type: CommandType
  repeat?: number
}

export interface ChallengeResult {
  id: string
  success: boolean
  attempts: number
  elapsedSeconds: number
}

export interface ChallengeSubmission {
  success: boolean
  attempts: number
  elapsedMilliseconds: number
}
