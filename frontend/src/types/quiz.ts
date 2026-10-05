export type Profile =
  | 'FRONTEND_CREATOR'
  | 'BACKEND_ARCHITECT'
  | 'AI_EXPLORER'
  | 'CYBER_GUARDIAN'
  | 'DATA_DETECTIVE'
  | 'GAME_BUILDER'

export type QuizOption = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface QuestionOption {
  id: QuizOption
  label: string
  profile: Profile
  icon: string
}

export interface Question {
  number: number
  text: string
  options: QuestionOption[]
}

export interface AnswerResult {
  id: string
  questionNumber: number
  selectedOption: QuizOption
  awardedProfile: Profile
  points: number
  profileScores: Record<Profile, number>
  preliminaryProfile: Profile
}

