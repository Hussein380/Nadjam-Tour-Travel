import { createClient } from "@sanity/client"
import groq from "groq"

export interface BlogPost {
  _id: string
  _createdAt: string
  _updatedAt?: string
  title: string
  slug: { current: string }
  excerpt?: string
  content?: any
  publishedAt?: string
  author?: { name?: string }
  categories?: { title: string; slug?: { current: string } }[]
  heroImage?: { url?: string; alt?: string }
  seo?: {
    title?: string
    description?: string
    canonical?: string
    noindex?: boolean
    ogImage?: { url?: string }
  }
}

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || "production"
const apiVersion = process.env.SANITY_API_VERSION || "2024-01-01"
const token = process.env.SANITY_READ_TOKEN

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // If a token is present (private dataset), use the API (no CDN). Otherwise, use CDN for speed.
  useCdn: !token,
  token,
  perspective: "published",
})

export const queries = {
  allPosts: groq`
    *[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc) {
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      excerpt,
      publishedAt,
      "heroImage": {
        "url": coalesce(hero.asset->url, heroImage.asset->url),
        "alt": hero.alt
      },
      "author": author-> { name },
      "categories": categories[]-> { title, slug }
    }
  `,
  postBySlug: groq`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      "heroImage": {
        "url": coalesce(hero.asset->url, heroImage.asset->url),
        "alt": hero.alt
      },
      "author": author-> { name },
      "categories": categories[]-> { title, slug },
      seo
    }
  `,
}

export async function fetchAllPosts(limit?: number): Promise<BlogPost[]> {
  const posts = await sanityClient.fetch<BlogPost[]>(queries.allPosts)
  return typeof limit === "number" ? posts.slice(0, limit) : posts
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await sanityClient.fetch<BlogPost | null>(queries.postBySlug, { slug })
  return post || null
}


