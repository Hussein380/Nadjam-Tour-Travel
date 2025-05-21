export interface User {
  id: string
  name: string
  email: string
  bio?: string
  sessionCount: number
  moodAverage?: number
  moodTrend?: "up" | "down" | "stable"
  streak: number
  insights?: UserInsight[]
  preferences?: UserPreferences
}

export interface UserInsight {
  id: string
  title: string
  description: string
  date: string
}

export interface UserPreferences {
  emailNotifications: boolean
  sessionReminders: boolean
  weeklyInsights: boolean
  voicePreference: "female" | "male" | "neutral"
  theme: "light" | "dark" | "system"
}
