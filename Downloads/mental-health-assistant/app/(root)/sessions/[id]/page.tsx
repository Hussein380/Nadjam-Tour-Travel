import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SessionTranscript } from "@/components/sessions/session-transcript"
import { SessionInsights } from "@/components/sessions/session-insights"
import { SessionActions } from "@/components/sessions/session-actions"
import { getSessionById } from "@/lib/actions/session-actions"

interface SessionPageProps {
  params: {
    id: string
  }
}

export default async function SessionPage({ params }: SessionPageProps) {
  const session = await getSessionById(params.id)

  if (!session) {
    notFound()
  }

  const formattedDate = new Date(session.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <DashboardShell>
      <DashboardHeader heading={`Session: ${formattedDate}`} text={`Duration: ${session.duration} minutes`}>
        <SessionActions session={session} />
      </DashboardHeader>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Session Summary</CardTitle>
            <CardDescription>Key points and themes from your session</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{session.summary}</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="transcript" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="transcript">
            <Card>
              <CardHeader>
                <CardTitle>Session Transcript</CardTitle>
                <CardDescription>Complete conversation from your session</CardDescription>
              </CardHeader>
              <CardContent>
                <SessionTranscript transcript={session.transcript} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Session Insights</CardTitle>
                <CardDescription>AI-generated insights from your conversation</CardDescription>
              </CardHeader>
              <CardContent>
                <SessionInsights insights={session.insights} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Resources</CardTitle>
                <CardDescription>Personalized resources based on your session</CardDescription>
              </CardHeader>
              <CardContent>
                {session.resources && session.resources.length > 0 ? (
                  <div className="space-y-4">
                    {session.resources.map((resource, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        <Button variant="link" className="mt-2 p-0" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            View Resource
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No resources available for this session.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline">Previous Session</Button>
          <Button variant="outline">Next Session</Button>
        </div>
      </div>
    </DashboardShell>
  )
}
