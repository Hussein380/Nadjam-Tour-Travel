import type React from "react"
interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">{heading}</h1>
        {text && <p className="text-white/70 text-lg">{text}</p>}
      </div>
      {children}
    </div>
  )
}
