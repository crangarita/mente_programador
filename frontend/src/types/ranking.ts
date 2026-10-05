import type { Profile } from './quiz'

export interface RankingEntry {
  position: number
  alias: string
  profile: Profile
  score: number
}
