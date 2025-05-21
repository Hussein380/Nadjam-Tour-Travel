"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MicIcon, Calendar, ClipboardList, BarChart3, ArrowRight, Sparkles, Activity, Brain } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RecentSessionsList } from "@/components/sessions/recent-sessions-list"
import { MoodTracker } from "@/components/dashboard/mood-tracker"
import { getUserData } from "@/lib/actions/user-actions"
import { getRecentSessions } from "@/lib/actions/session-actions"
import { getAssessmentProgress } from "@/lib/actions/assessment-actions"
import type { User } from "@/types"
import type { Session } from "@/types/sessions"
import type { AssessmentProgress } from "@/types/assessments"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [recentSessions, setRecentSessions] = useState<Session[]>([])
  const [assessmentProgress, setAssessmentProgress] = useState<AssessmentProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const userData = await getUserData()
        const sessionsData = await getRecentSessions(5)
        const progressData = await getAssessmentProgress()

        setUser(userData)
        setRecentSessions(sessionsData)
        setAssessmentProgress(progressData)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text={`Welcome back${user?.name ? ", " + user.name : ""}! Here's an overview of your mental health journey.`}
      />

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-black/40 backdrop-blur-md border border-white/5 p-1">
          <TabsTrigger value="overview" className="px-6 py-2.5">
            Overview
          </TabsTrigger>
          <TabsTrigger value="insights" className="px-6 py-2.5">
            Insights
          </TabsTrigger>
          <TabsTrigger value="progress" className="px-6 py-2.5">
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Sessions"
              value={user?.sessionCount || 0}
              description={user?.sessionCount ? "+1 from last week" : "Start your first session"}
              icon={<Calendar className="h-5 w-5 text-rose-400" />}
            />

            <StatCard
              title="Mood Trend"
              value={user?.moodAverage || "N/A"}
              description={user?.moodTrend === "up" ? "Improving" : user?.moodTrend === "down" ? "Declining" : "Stable"}
              icon={<BarChart3 className="h-5 w-5 text-purple-400" />}
            />

            <StatCard
              title="Assessments"
              value={`${assessmentProgress?.completed || 0}/${assessmentProgress?.total || 0}`}
              description={
                <Progress
                  value={assessmentProgress ? (assessmentProgress.completed / assessmentProgress.total) * 100 : 0}
                  className="mt-2 bg-white/10 h-1.5"
                  indicatorClassName="bg-gradient-to-r from-rose-500 to-purple-600"
                />
              }
              icon={<ClipboardList className="h-5 w-5 text-blue-400" />}
            />

            <StatCard
              title="Streak"
              value={`${user?.streak || 0} days`}
              description={
                user?.streak
                  ? `${user.streak > 1 ? user.streak + " consecutive days" : "1 day"}`
                  : "Start your streak today"
              }
              icon={<Activity className="h-5 w-5 text-emerald-400" />}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-7">
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Recent Sessions</h2>
                  <p className="text-white/50 text-sm">Your most recent therapy sessions</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500/20 to-purple-600/20 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-rose-400" />
                </div>
              </div>

              <RecentSessionsList sessions={recentSessions} isLoading={isLoading} />

              <Button
                variant="outline"
                className="w-full border-white/10 text-white/70 hover:text-white hover:bg-white/5 mt-4"
                asChild
              >
                <Link href="/sessions">
                  View all sessions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Mood Tracker</h2>
                  <p className="text-white/50 text-sm">Your mood over the past 7 days</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-600/20 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-xl p-4">
                <MoodTracker isLoading={isLoading} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Start a New Session</h2>
                <p className="text-white/50 text-sm">Begin a voice conversation with your AI mental health assistant</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-600/20 flex items-center justify-center">
                <MicIcon className="h-4 w-4 text-blue-400" />
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center">
              <div className="mb-8 relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-b from-rose-500/20 to-purple-600/20 flex items-center justify-center">
                  <MicIcon className="h-10 w-10 text-rose-500 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border border-rose-500/30 pulse-ring"></div>
              </div>
              <Button size="lg" className="btn-gradient py-6 px-8 text-lg">
                <MicIcon className="mr-2 h-5 w-5" />
                Start Talking
              </Button>
              <p className="mt-6 text-center text-white/50">Your conversation is private and secure</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Insights</h2>
              <p className="text-white/50 text-sm">Personalized insights based on your sessions and assessments</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500/20 to-rose-600/20 flex items-center justify-center">
              <Brain className="h-4 w-4 text-amber-400" />
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-xl p-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-4 w-full animate-pulse rounded bg-white/10"></div>
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10"></div>
                <div className="h-4 w-5/6 animate-pulse rounded bg-white/10"></div>
              </div>
            ) : user?.insights && user.insights.length > 0 ? (
              <div className="space-y-6">
                {user.insights.map((insight, index) => (
                  <div key={index} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-rose-400" />
                      <h3 className="text-lg font-medium">{insight.title}</h3>
                    </div>
                    <p className="text-white/70 leading-relaxed">{insight.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-rose-500/10 to-purple-600/10 flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-white/30" />
                </div>
                <h3 className="text-lg font-medium mb-2">No insights yet</h3>
                <p className="text-white/50 max-w-md">
                  Complete more sessions and assessments to receive personalized insights about your mental health
                  journey
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Your Progress</h2>
              <p className="text-white/50 text-sm">Track your mental health journey over time</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-600/20 flex items-center justify-center">
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-xl p-6">
            {isLoading ? (
              <div className="h-[300px] w-full animate-pulse rounded bg-white/10"></div>
            ) : (
              <div className="h-[300px] w-full rounded flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500/10 to-blue-600/10 flex items-center justify-center mb-4 mx-auto">
                    <Activity className="h-8 w-8 text-white/30" />
                  </div>
                  <p className="text-white/50 max-w-md">
                    Progress chart will appear here showing your mental health journey over time
                  </p>
                  <Button className="mt-6 border-white/10 text-white/70 hover:text-white hover:bg-white/5">
                    Generate Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  description: string | React.ReactNode
  icon: React.ReactNode
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-white/70">{title}</p>
        <div className="h-8 w-8 rounded-full bg-black/40 flex items-center justify-center">{icon}</div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {typeof description === "string" ? <p className="text-sm text-white/50">{description}</p> : description}
    </div>
  )
}
