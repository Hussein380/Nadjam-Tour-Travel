"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"

export function SessionFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [moodFilter, setMoodFilter] = useState<number[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="search"
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
        <Button type="submit" size="sm" variant="ghost" className="h-9 px-2">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={dateFilter === "all"} onCheckedChange={() => setDateFilter("all")}>
            All Time
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={dateFilter === "week"} onCheckedChange={() => setDateFilter("week")}>
            Last Week
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={dateFilter === "month"} onCheckedChange={() => setDateFilter("month")}>
            Last Month
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={dateFilter === "year"} onCheckedChange={() => setDateFilter("year")}>
            Last Year
          </DropdownMenuCheckboxItem>

          <DropdownMenuLabel className="mt-2">Filter by Mood</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[1, 2, 3, 4, 5].map((mood) => (
            <DropdownMenuCheckboxItem
              key={mood}
              checked={moodFilter.includes(mood)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setMoodFilter([...moodFilter, mood])
                } else {
                  setMoodFilter(moodFilter.filter((m) => m !== mood))
                }
              }}
            >
              {getMoodLabel(mood)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
