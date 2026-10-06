import type { Profile } from './quiz'

export interface EventStats {
  participants: number
  averageScore: number
  mostCommonProfile: Profile | null
  profileDistribution: Record<Profile, number>
}
