"use client"

import { useState, useEffect } from "react"
import { getMoodData } from "@/lib/actions/user-actions"

interface MoodTrackerProps {
  isLoading?: boolean
}

export function MoodTracker({ isLoading = false }: MoodTrackerProps) {
  const [moodData, setMoodData] = useState<any[]>([])
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    async function loadMoodData() {
      try {
        const data = await getMoodData(7) // Last 7 days
        setMoodData(data)
      } catch (error) {
        console.error("Error loading mood data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!isLoading) {
      loadMoodData()
    }
  }, [isLoading])

  if (loading) {
    return <div className="h-[200px] w-full animate-pulse rounded bg-white/10"></div>
  }

  if (moodData.length === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center text-center">
        <p className="text-white/70 mb-2">No mood data available yet</p>
        <p className="text-white/50 text-sm">Complete sessions to track your mood</p>
      </div>
    )
  }

  // Simple visualization of mood data
  return (
    <div className="h-[200px] w-full">
      <div className="flex h-full items-end justify-between gap-2 pt-6">
        {moodData.map((day, index) => {
          const height = (day.value / 5) * 100 // Scale to percentage (1-5 scale)
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-rose-500/70 to-purple-500/70"
                style={{ height: `${height}%` }}
              ></div>
              <div className="mt-2 text-xs text-white/50">
                {new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
