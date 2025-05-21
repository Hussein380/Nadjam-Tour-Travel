import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, MoreHorizontal, Printer, Share2, Trash } from "lucide-react"
import type { Session } from "@/types/sessions"

interface SessionActionsProps {
  session: Session
}

export function SessionActions({ session }: SessionActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-1">
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Export</span>
      </Button>
      <Button variant="outline" size="sm" className="gap-1">
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Printer className="mr-2 h-4 w-4" />
            <span>Print</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
