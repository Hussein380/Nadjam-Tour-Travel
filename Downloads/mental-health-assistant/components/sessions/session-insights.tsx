import type { Insight } from "@/types/sessions"

interface SessionInsightsProps {
  insights: Insight[]
}

export function SessionInsights({ insights }: SessionInsightsProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No insights available for this session.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <div key={index} className="rounded-lg border p-4">
          <h3 className="font-medium">{insight.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
          {insight.suggestions && insight.suggestions.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium">Suggestions:</h4>
              <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                {insight.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
