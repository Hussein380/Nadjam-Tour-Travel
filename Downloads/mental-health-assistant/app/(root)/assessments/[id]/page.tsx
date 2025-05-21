import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AssessmentForm } from "@/components/assessments/assessment-form"
import { AssessmentResults } from "@/components/assessments/assessment-results"
import { getAssessmentById } from "@/lib/actions/assessment-actions"

interface AssessmentPageProps {
  params: {
    id: string
  }
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const assessment = await getAssessmentById(params.id)

  if (!assessment) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={assessment.title} text={assessment.description} />

      <Card>
        <CardHeader>
          <CardTitle>{assessment.completed ? "Assessment Results" : "Assessment Questions"}</CardTitle>
          <CardDescription>
            {assessment.completed
              ? "Review your assessment results and insights"
              : "Please answer all questions honestly for the most accurate results"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assessment.completed ? (
            <AssessmentResults assessment={assessment} />
          ) : (
            <AssessmentForm assessment={assessment} />
          )}
        </CardContent>
        {assessment.completed && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <a href="/assessments">Back to Assessments</a>
            </Button>
            <Button>Download Results</Button>
          </CardFooter>
        )}
      </Card>
    </DashboardShell>
  )
}
