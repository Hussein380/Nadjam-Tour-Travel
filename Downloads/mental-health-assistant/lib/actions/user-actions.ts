import type { User, UserPreferences } from "@/types"

// Mock data for demonstration
const mockUser: User = {
  id: "user123",
  name: "Alex Johnson",
  email: "alex@example.com",
  bio: "Working on improving my mental health one day at a time.",
  sessionCount: 12,
  moodAverage: 3.7,
  moodTrend: "up",
  streak: 5,
  insights: [
    {
      id: "insight1",
      title: "Sleep Pattern Improvement",
      description: "Your sleep quality has improved by 20% over the last month based on your session reports.",
      date: new Date().toISOString(),
    },
    {
      id: "insight2",
      title: "Stress Triggers Identified",
      description: "Work meetings and evening news appear to be consistent triggers for your anxiety.",
      date: new Date().toISOString(),
    },
  ],
  preferences: {
    emailNotifications: true,
    sessionReminders: true,
    weeklyInsights: true,
    voicePreference: "female",
    theme: "dark",
  },
}

// Mock mood data for the chart
const mockMoodData = [
  { date: "2023-05-01", value: 2 },
  { date: "2023-05-02", value: 3 },
  { date: "2023-05-03", value: 3 },
  { date: "2023-05-04", value: 4 },
  { date: "2023-05-05", value: 3 },
  { date: "2023-05-06", value: 4 },
  { date: "2023-05-07", value: 5 },
]

export async function getUserData(): Promise<User> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser)
    }, 1000)
  })
}

export async function updateUserProfile(data: {
  name: string
  email: string
  bio?: string
}): Promise<User> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedUser = { ...mockUser, ...data }
      resolve(updatedUser)
    }, 1000)
  })
}

export async function updateUserPreferences(preferences: UserPreferences): Promise<UserPreferences> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(preferences)
    }, 1000)
  })
}

export async function getMoodData(days = 7): Promise<any[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMoodData.slice(-days))
    }, 1000)
  })
}
