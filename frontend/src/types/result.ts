import type { Profile } from './quiz'

export interface FinalResult {
  alias: string
  profile: Profile
  testScore: number
  challengeScore: number
  score: number
  rankingPosition: number
}
