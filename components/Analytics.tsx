"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const MEASUREMENT_ID = "G-4VZS2PFML0"

export default function Analytics() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (!pathname) return

        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

        // @ts-expect-error gtag is injected by next/script in layout
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            // Use config to record a page_view for GA4 on SPA navigations
            // https://developers.google.com/gtagjs/reference/api#config
            // @ts-expect-error gtag is injected globally
            window.gtag("config", MEASUREMENT_ID, { page_path: url })
        }
    }, [pathname, searchParams])

    return null
}


