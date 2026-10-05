export type Direction = 0 | 1 | 2 | 3
export type CommandType = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'REPEAT'

export interface CommandBlock {
  id: string
  type: CommandType
  repeat?: number
}

export interface ChallengeResult {
  id: string
  challengeId: string
  success: boolean
  attempts: number
  elapsedSeconds: number
}

export interface ChallengeSubmission {
  challengeId: string
  commands: Exclude<CommandType, 'REPEAT'>[]
  attempts: number
  elapsedMilliseconds: number
}

export interface ChallengeCell {
  row: number
  column: number
}

export interface ChallengeDefinition {
  id: string
  name: string
  rows: number
  columns: number
  start: ChallengeCell
  startDirection: Direction
  target: ChallengeCell
  obstacles: ChallengeCell[]
}
