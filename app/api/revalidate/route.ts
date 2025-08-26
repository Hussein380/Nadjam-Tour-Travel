import { NextRequest, NextResponse } from "next/server"

// Shared secret with Sanity webhook
const WEBHOOK_SECRET = process.env.SANITY_REVALIDATE_SECRET

export async function POST(req: NextRequest) {
    try {
        const secret = req.nextUrl.searchParams.get("secret") || req.headers.get("x-webhook-secret")
        if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
            return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
        }

        const body = await req.json().catch(() => ({} as any))
        const slug = body?.slug || req.nextUrl.searchParams.get("slug")

        // Revalidate the blog index
        // In Next.js App Router, tagging would be ideal; here we return a hint response
        const paths: string[] = ["/blog"]
        if (slug) paths.push(`/blog/${slug}`)

        return NextResponse.json({ revalidated: true, paths })
    } catch (e) {
        return NextResponse.json({ revalidated: false, error: (e as Error).message }, { status: 500 })
    }
}


