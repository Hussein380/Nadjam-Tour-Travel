import { fetchPostBySlug } from "@/lib/sanity"
import type { Metadata } from "next"
import PortableContent from "@/components/PortableContent"

type Params = { slug: string }

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { slug } = await params
    const post = await fetchPostBySlug(slug)
    if (!post) return { title: "Post not found" }
    const title = post.seo?.title || post.title
    const description = post.seo?.description || post.excerpt || undefined
    const images = post.seo?.ogImage?.url ? [{ url: post.seo.ogImage.url }] : undefined
    const canonical = post.seo?.canonical

    return {
        title,
        description,
        openGraph: { title, description, images },
        alternates: canonical ? { canonical } : undefined,
    }
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
    const { slug } = await params
    const post = await fetchPostBySlug(slug)
    if (!post) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-medium">Post not found</h1>
            </div>
        )
    }

    return (
        <article className="min-h-screen bg-gray-50">
            {post.heroImage?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`${post.heroImage.url}?w=1600&h=600&fit=crop&auto=format`} alt={post.heroImage.alt || post.title} className="w-full h-72 sm:h-96 object-cover" />
            )}
            <div className="max-w-3xl mx-auto px-4 py-10">
                <h1 className="text-4xl font-light mb-4">{post.title}</h1>
                <div className="text-gray-500 text-sm mb-6 flex gap-3">
                    {post.author?.name && <span>By {post.author.name}</span>}
                    {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
                </div>
                {post.excerpt && <p className="text-gray-700 mb-6">{post.excerpt}</p>}
                <div className="prose prose-lg max-w-none">
                    <PortableContent value={post.content} />
                </div>
            </div>
        </article>
    )
}


