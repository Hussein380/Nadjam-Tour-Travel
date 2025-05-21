export interface Assessment {
  id: string
  title: string
  description: string
  type: "depression" | "anxiety" | "stress" | "wellbeing" | "custom"
  questions: Question[]
  completed: boolean
  progress: number
  results?: AssessmentResult
  tags: string[]
}

export interface Question {
  id: string
  text: string
  type: "scale" | "multiple-choice" | "yes-no" | "text"
  options?: string[]
  answer?: string | number
}

export interface AssessmentResult {
  score: number
  interpretation: string
  recommendations: string[]
  date: string
}

export interface AssessmentProgress {
  total: number
  completed: number
}
