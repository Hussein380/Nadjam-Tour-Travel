import { fetchAllPosts } from "@/lib/sanity"
import Link from "next/link"

export const revalidate = 300

export default async function BlogIndexPage() {
    const posts = await fetchAllPosts()

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h1 className="text-4xl sm:text-5xl font-light text-white">Insights & Stories</h1>
                    <p className="text-white/80 mt-3 max-w-2xl">Travel tips, destination guides, and stories from the wild.</p>
                </div>
            </section>

            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {posts.length === 0 ? (
                        <p className="text-gray-600">No posts yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {posts.map(post => (
                                <article key={post._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    {post.heroImage?.url && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={`${post.heroImage.url}?w=1200&h=630&fit=crop&auto=format`} alt={post.heroImage.alt || post.title} className="w-full h-56 object-cover" />
                                    )}
                                    <div className="p-6">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {post.categories?.map(c => (
                                                <span key={c.title} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">{c.title}</span>
                                            ))}
                                        </div>
                                        <Link href={`/blog/${post.slug.current}`} className="text-2xl font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                                            {post.title}
                                        </Link>
                                        {post.excerpt && <p className="text-gray-600 mt-3">{post.excerpt}</p>}
                                        <div className="mt-4 text-sm text-gray-500 flex items-center gap-3">
                                            {post.author?.name && <span>By {post.author.name}</span>}
                                            {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
                                        </div>
                                        <div className="mt-6">
                                            <Link href={`/blog/${post.slug.current}`} className="text-emerald-700 font-medium hover:underline">Read more →</Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}


