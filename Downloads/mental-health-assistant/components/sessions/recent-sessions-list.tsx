import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import type { Session } from "@/types/sessions"

interface RecentSessionsListProps {
  sessions: Session[]
  isLoading?: boolean
}

export function RecentSessionsList({ sessions, isLoading = false }: RecentSessionsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 bg-white/5 rounded-xl p-4 animate-pulse">
            <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px] bg-white/10" />
              <Skeleton className="h-4 w-[200px] bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-black/40 backdrop-blur-md border border-white/5 rounded-xl">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-rose-500/10 to-purple-600/10 flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-white/30" />
        </div>
        <h3 className="text-lg font-medium mb-2">No sessions yet</h3>
        <p className="text-white/50 max-w-md">Start your first session to begin your mental health journey</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={`/sessions/${session.id}`}
          className="flex items-start space-x-4 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl p-5 transition-colors hover:bg-white/5"
        >
          <div className="rounded-full bg-gradient-to-br from-rose-500/20 to-purple-600/20 p-3 flex-shrink-0">
            <Calendar className="h-5 w-5 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium">{new Date(session.date).toLocaleDateString()}</p>
              <Badge
                variant={session.mood >= 3 ? "outline" : "destructive"}
                className={session.mood >= 3 ? "border-green-500/50 text-green-400 bg-transparent" : ""}
              >
                {getMoodLabel(session.mood)}
              </Badge>
            </div>
            <p className="text-white/70 line-clamp-2 mb-2">{session.summary}</p>
            <div className="flex items-center text-xs text-white/50">
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
