import { NextRequest, NextResponse } from 'next/server'
import { looksLikeFirestoreId } from '@/lib/slug'

async function fetchHotelJson(url: URL) {
  try {
    const response = await fetch(url, {
      headers: {
        'x-slug-middleware': '1',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch (error) {
    console.error('Slug middleware fetch failed:', error)
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  if (!pathname.startsWith('/hotels/')) {
    return NextResponse.next()
  }

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length < 2) {
    return NextResponse.next()
  }

  const slugOrId = segments[1]

  try {
    if (looksLikeFirestoreId(slugOrId)) {
      const apiUrl = new URL(`/api/hotels/${slugOrId}`, origin)
      const hotel = await fetchHotelJson(apiUrl)
      if (hotel?.slug && hotel.slug !== slugOrId) {
        const redirectUrl = new URL(`/hotels/${hotel.slug}`, origin)
        return NextResponse.redirect(redirectUrl, 308)
      }
      return NextResponse.next()
    }

    const apiUrl = new URL(`/api/hotels/slug/${slugOrId}`, origin)
    const hotel = await fetchHotelJson(apiUrl)
    if (hotel?.slug && hotel.slug !== slugOrId) {
      const redirectUrl = new URL(`/hotels/${hotel.slug}`, origin)
      return NextResponse.redirect(redirectUrl, 308)
    }
  } catch (error) {
    console.error('Slug middleware error:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/hotels/:path*'],
}

