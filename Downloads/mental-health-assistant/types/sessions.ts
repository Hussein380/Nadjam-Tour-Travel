export interface Session {
  id: string
  date: string
  duration: number
  mood: number
  summary: string
  transcript: Transcript[]
  insights: Insight[]
  resources?: Resource[]
}

export interface Transcript {
  speaker: "user" | "assistant"
  text: string
  timestamp: string
}

export interface Insight {
  title: string
  description: string
  suggestions?: string[]
}

export interface Resource {
  title: string
  description: string
  url: string
  type: "article" | "video" | "exercise" | "tool"
}
