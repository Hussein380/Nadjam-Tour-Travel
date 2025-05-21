import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MicIcon, Plus } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SessionsList } from "@/components/sessions/sessions-list"
import { SessionFilters } from "@/components/sessions/session-filters"
import { getAllSessions } from "@/lib/actions/session-actions"

export default async function SessionsPage() {
  const sessions = await getAllSessions()

  return (
    <DashboardShell>
      <DashboardHeader heading="Therapy Sessions" text="View and manage your therapy sessions.">
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          New Session
        </Button>
      </DashboardHeader>

      <div className="grid gap-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Start a New Session</CardTitle>
            <CardDescription>Begin a voice conversation with your AI mental health assistant</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 sm:flex-row sm:justify-between">
            <div className="mb-4 flex items-center sm:mb-0">
              <div className="mr-4 rounded-full bg-rose-100 p-4 dark:bg-rose-900/20">
                <MicIcon className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <h3 className="font-medium">Voice Session</h3>
                <p className="text-sm text-muted-foreground">Talk through your thoughts and feelings</p>
              </div>
            </div>
            <Button size="lg" className="gap-2">
              <MicIcon className="h-4 w-4" />
              Start Talking
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-xl font-semibold">Your Sessions</h2>
            <SessionFilters />
          </div>

          <SessionsList sessions={sessions} />
        </div>
      </div>
    </DashboardShell>
  )
}
