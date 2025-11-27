import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /nadjam/
Disallow: /_next/

# Sitemap
Sitemap: https://www.nadjamtravel.com/sitemap.xml`;

  return new NextResponse(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
