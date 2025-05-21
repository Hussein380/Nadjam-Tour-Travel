"use client"

import type React from "react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HeartPulse, Home, Calendar, ClipboardList, User, Settings, Bell, Menu, MicIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
        <div className="bg-black/40 backdrop-blur-md border-r border-white/5 h-full flex flex-col">
          <div className="flex h-16 items-center gap-2 px-6 border-b border-white/5">
            <HeartPulse className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold gradient-text">MindVoice</span>
          </div>

          <div className="flex-1 overflow-auto py-8 px-4">
            <nav className="space-y-1.5">
              <NavItem href="/dashboard" icon={Home} label="Dashboard" />
              <NavItem href="/sessions" icon={Calendar} label="Sessions" />
              <NavItem href="/assessments" icon={ClipboardList} label="Assessments" />
              <NavItem href="/profile" icon={User} label="Profile" />
              <NavItem href="/settings" icon={Settings} label="Settings" />
            </nav>
          </div>

          <div className="p-6 border-t border-white/5">
            <Button className="w-full btn-gradient gap-2 py-6">
              <MicIcon className="h-5 w-5" />
              New Session
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 border-r border-white/5 bg-black/90 backdrop-blur-md">
          <div className="flex h-16 items-center gap-2 px-6 border-b border-white/5">
            <HeartPulse className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold gradient-text">MindVoice</span>
          </div>

          <div className="flex-1 overflow-auto py-8 px-4">
            <nav className="space-y-1.5">
              <NavItem href="/dashboard" icon={Home} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
              <NavItem href="/sessions" icon={Calendar} label="Sessions" onClick={() => setIsSidebarOpen(false)} />
              <NavItem
                href="/assessments"
                icon={ClipboardList}
                label="Assessments"
                onClick={() => setIsSidebarOpen(false)}
              />
              <NavItem href="/profile" icon={User} label="Profile" onClick={() => setIsSidebarOpen(false)} />
              <NavItem href="/settings" icon={Settings} label="Settings" onClick={() => setIsSidebarOpen(false)} />
            </nav>
          </div>

          <div className="p-6 border-t border-white/5">
            <Button className="w-full btn-gradient gap-2 py-6" onClick={() => setIsSidebarOpen(false)}>
              <MicIcon className="h-5 w-5" />
              New Session
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1 md:pl-72">
        <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center md:hidden">
              <SheetTrigger asChild onClick={() => setIsSidebarOpen(true)}>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <div className="ml-3 flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-rose-500" />
                <span className="font-bold gradient-text">MindVoice</span>
              </div>
            </div>

            <div className="flex items-center gap-6 ml-auto">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500"></span>
                <span className="sr-only">Notifications</span>
              </Button>

              <UserNav />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  onClick?: () => void
}

function NavItem({ href, icon: Icon, label, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-4 py-3 text-white/70 transition-colors hover:text-white hover:bg-white/5"
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="text-base">{label}</span>
    </Link>
  )
}

function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border border-white/10">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-rose-500/30 to-purple-600/30 text-rose-400">
              U
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-black/90 backdrop-blur-md border border-white/10" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">User Name</p>
            <p className="text-xs leading-none text-white/50">user@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5">
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5">
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
