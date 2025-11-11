import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

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

        // Revalidate the blog index and specific post page (if provided)
        const paths: string[] = ["/blog"]
        revalidatePath("/blog")
        if (slug) {
            const postPath = `/blog/${slug}`
            revalidatePath(postPath)
            paths.push(postPath)
        }

        return NextResponse.json({ revalidated: true, paths })
    } catch (e) {
        return NextResponse.json({ revalidated: false, error: (e as Error).message }, { status: 500 })
    }
}


