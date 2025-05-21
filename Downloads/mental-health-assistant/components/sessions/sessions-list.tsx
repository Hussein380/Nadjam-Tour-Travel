import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import type { Session } from "@/types/sessions"

interface SessionsListProps {
  sessions: Session[]
}

export function SessionsList({ sessions }: SessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
        <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="font-medium">No sessions found</h3>
        <p className="text-sm text-muted-foreground">Start a new session or adjust your filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={`/sessions/${session.id}`}
          className="flex items-start space-x-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="rounded-full bg-rose-100 p-2 dark:bg-rose-900/20">
            <Calendar className="h-5 w-5 text-rose-500" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{new Date(session.date).toLocaleDateString()}</p>
              <Badge variant={session.mood >= 3 ? "outline" : "destructive"}>{getMoodLabel(session.mood)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{session.summary}</p>
            <div className="flex items-center pt-2 text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>{session.duration} minutes</span>
              <span className="mx-2">•</span>
              <span>{formatDistanceToNow(new Date(session.date), { addSuffix: true })}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function getMoodLabel(mood: number): string {
  switch (mood) {
    case 1:
      return "Very Low"
    case 2:
      return "Low"
    case 3:
      return "Neutral"
    case 4:
      return "Good"
    case 5:
      return "Excellent"
    default:
      return "Unknown"
  }
}
