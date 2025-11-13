import React, { Suspense } from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import ErrorBoundary from "@/components/ErrorBoundary"
import { Toaster } from "@/components/ui/sonner"
import { ChatBot } from "@/components/ChatBot"
import ReactQueryProvider from "@/components/ReactQueryProvider";
import Script from "next/script"
import Analytics from "@/components/Analytics"

export const metadata: Metadata = {
  title: "Nadjam Tour & Travel - Discover Amazing Destinations",
  description:
    "Book your dream vacation with Nadjam Tour & Travel. Explore our curated travel packages and create unforgettable memories.",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '96x96' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Nadjam Tour & Travel - Discover Amazing Destinations",
    description: "Book your dream vacation with Nadjam Tour & Travel. Explore our curated travel packages and create unforgettable memories.",
    url: 'https://nadjamtravel.com',
    siteName: 'Nadjam Tour & Travel',
    images: [
      {
        url: '/images/nadjam-logo.png',
        width: 1200,
        height: 630,
        alt: 'Nadjam Tour & Travel',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nadjam Tour & Travel',
    description: 'Book your dream vacation with Nadjam Tour & Travel',
    images: ['/images/nadjam-logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50">
        <Script
          id="emrldtp-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var script = document.createElement("script");
                script.async = 1;
                script.src = 'https://emrldtp.cc/NDcyMDI3.js?t=472027';
                document.head.appendChild(script);
              })();
            `,
          }}
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-4VZS2PFML0" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-4VZS2PFML0');
          `}
        </Script>
        <ReactQueryProvider>
          <ErrorBoundary>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ErrorBoundary>
          <Toaster />
          <ChatBot />
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
