import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Transcript } from "@/types/sessions"

interface SessionTranscriptProps {
  transcript: Transcript[]
}

export function SessionTranscript({ transcript }: SessionTranscriptProps) {
  if (!transcript || transcript.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No transcript available for this session.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transcript.map((entry, index) => (
        <div key={index} className="flex gap-4">
          <Avatar className="h-8 w-8">
            {entry.speaker === "user" ? (
              <>
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </>
            ) : (
              <>
                <AvatarImage src="/placeholder.svg" alt="Assistant" />
                <AvatarFallback>AI</AvatarFallback>
              </>
            )}
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{entry.speaker === "user" ? "You" : "AI Assistant"}</p>
            <p className="text-sm">{entry.text}</p>
            <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
