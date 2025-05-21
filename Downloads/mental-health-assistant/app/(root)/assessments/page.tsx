import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ClipboardList, ArrowRight, CheckCircle } from "lucide-react"
import { getAllAssessments } from "@/lib/actions/assessment-actions"

export default async function AssessmentsPage() {
  const assessments = await getAllAssessments()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Mental Health Assessments"
        text="Complete assessments to track your mental health and receive personalized insights."
      />

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{assessment.title}</CardTitle>
                  {assessment.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Completion</span>
                    <span className="font-medium">{assessment.progress}%</span>
                  </div>
                  <Progress value={assessment.progress} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {assessment.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={assessment.completed ? "outline" : "default"}
                  className="w-full justify-between"
                  asChild
                >
                  <Link href={`/assessments/${assessment.id}`}>
                    {assessment.completed ? "View Results" : "Start Assessment"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {assessments.length === 0 && (
          <Card className="flex flex-col items-center justify-center p-8 text-center">
            <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-medium">No assessments available</h3>
            <p className="mt-2 text-muted-foreground">Check back later for new assessments</p>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}
