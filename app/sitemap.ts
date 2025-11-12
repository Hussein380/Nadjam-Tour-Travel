import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase/admin';
import { fetchAllPosts } from '@/lib/sanity';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nadjamtravel.com';
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hotels`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/flights`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/services/hajj-umrah`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/services/honeymoon-wedding`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/services/mice`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic pages: Hotels
  let hotelPages: MetadataRoute.Sitemap = [];
  try {
    const hotelsSnapshot = await db
      .collection('hotels')
      .where('active', '==', true)
      .get();

    hotelPages = hotelsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const updatedAt = data.updatedAt?.toDate() || data.createdAt?.toDate() || now;
      return {
        url: `${baseUrl}/hotels/${doc.id}`,
        lastModified: updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });
  } catch (error) {
    console.error('Error fetching hotels for sitemap:', error);
  }

  // Dynamic pages: Packages
  let packagePages: MetadataRoute.Sitemap = [];
  try {
    const packagesSnapshot = await db
      .collection('packages')
      .where('active', '==', true)
      .get();

    packagePages = packagesSnapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return data.slug; // Only include packages with slugs
      })
      .map((doc) => {
        const data = doc.data();
        const updatedAt = data.updatedAt?.toDate() || data.createdAt?.toDate() || now;
        return {
          url: `${baseUrl}/packages/${data.slug}`,
          lastModified: updatedAt,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      });
  } catch (error) {
    console.error('Error fetching packages for sitemap:', error);
  }

  // Dynamic pages: Blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await fetchAllPosts();
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug.current}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticPages, ...hotelPages, ...packagePages, ...blogPages];
}

