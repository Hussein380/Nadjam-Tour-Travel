import type { Session } from "@/types/sessions"

// Mock data for demonstration
const mockSessions: Session[] = [
  {
    id: "session1",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    duration: 15,
    mood: 4,
    summary:
      "Discussed work stress and practiced mindfulness techniques. Identified triggers and developed coping strategies.",
    transcript: [
      {
        speaker: "assistant",
        text: "Hello! How are you feeling today?",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        speaker: "user",
        text: "I'm feeling a bit stressed about work deadlines.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
      },
      {
        speaker: "assistant",
        text: "I understand. Work stress can be challenging. Let's talk about some strategies that might help you manage this stress.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
      },
    ],
    insights: [
      {
        title: "Work-Related Stress",
        description: "You've mentioned work stress in several sessions. This appears to be a recurring theme.",
        suggestions: [
          "Try setting clearer boundaries between work and personal time",
          "Practice the 5-minute mindfulness exercise we discussed",
          "Consider discussing workload with your manager",
        ],
      },
    ],
    resources: [
      {
        title: "Mindfulness for Stress Reduction",
        description: "A guided meditation specifically designed for workplace stress",
        url: "https://example.com/mindfulness",
        type: "exercise",
      },
      {
        title: "Setting Healthy Work Boundaries",
        description: "Article on establishing and maintaining work-life balance",
        url: "https://example.com/boundaries",
        type: "article",
      },
    ],
  },
  {
    id: "session2",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    duration: 20,
    mood: 3,
    summary:
      "Explored feelings of anxiety about upcoming social event. Practiced breathing exercises and developed a preparation plan.",
    transcript: [
      {
        speaker: "assistant",
        text: "Welcome back! What's on your mind today?",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        speaker: "user",
        text: "I'm feeling anxious about a social gathering this weekend.",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
      },
      {
        speaker: "assistant",
        text: "Social anxiety is common. Let's work through some techniques that might help you feel more comfortable.",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
      },
    ],
    insights: [
      {
        title: "Social Anxiety Patterns",
        description:
          "You tend to experience anxiety before social events, but report feeling better once you're there.",
        suggestions: [
          "Try the 4-7-8 breathing technique before the event",
          "Prepare a few conversation starters in advance",
          "Plan for a quiet break during the event if needed",
        ],
      },
    ],
  },
  {
    id: "session3",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    duration: 25,
    mood: 2,
    summary:
      "Discussed feelings of sadness related to recent family conflict. Explored coping mechanisms and practiced emotional regulation techniques to help manage difficult family dynamics.",
    transcript: [
      {
        speaker: "assistant",
        text: "Hello again. How have you been since our last session?",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        speaker: "user",
        text: "Not great. I had an argument with my sister and I've been feeling down about it.",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
      },
      {
        speaker: "assistant",
        text: "I'm sorry to hear that. Family conflicts can be particularly difficult. Would you like to talk about what happened?",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
      },
    ],
    insights: [
      {
        title: "Family Relationship Patterns",
        description:
          "There seems to be a recurring pattern in conflicts with your sister that triggers feelings of inadequacy.",
        suggestions: [
          "Practice the assertive communication techniques we discussed",
          "Set emotional boundaries before family gatherings",
          "Consider writing in your journal before responding to triggering situations",
        ],
      },
    ],
  },
]

export async function getAllSessions(): Promise<Session[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSessions)
    }, 1000)
  })
}

export async function getRecentSessions(limit = 5): Promise<Session[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const sortedSessions = [...mockSessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      resolve(sortedSessions.slice(0, limit))
    }, 1000)
  })
}

export async function getSessionById(id: string): Promise<Session | null> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const session = mockSessions.find((s) => s.id === id) || null
      resolve(session)
    }, 1000)
  })
}

export async function createSession(sessionData: Partial<Session>): Promise<Session> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSession: Session = {
        id: `session${Date.now()}`,
        date: new Date().toISOString(),
        duration: sessionData.duration || 0,
        mood: sessionData.mood || 3,
        summary: sessionData.summary || "",
        transcript: sessionData.transcript || [],
        insights: sessionData.insights || [],
        resources: sessionData.resources || [],
      }
      resolve(newSession)
    }, 1000)
  })
}
