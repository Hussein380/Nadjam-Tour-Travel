import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/nadjam/', '/_next/'],
      },
    ],
    sitemap: 'https://nadjamtravel.com/sitemap.xml',
  };
}

