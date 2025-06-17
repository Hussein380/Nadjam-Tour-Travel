import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import ErrorBoundary from "@/components/ErrorBoundary"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Nadjam Tour & Travel - Discover Amazing Destinations",
  description:
    "Book your dream vacation with Nadjam Tour & Travel. Explore our curated travel packages and create unforgettable memories.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50">
        <ErrorBoundary>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  )
}
