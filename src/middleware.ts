import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/app/_adapters/supabase/middleware';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/go')) {
    if (!request.nextUrl.pathname.endsWith('/info')) {
      if (request.cookies.has('skip_info_interstitial')) {
        const cookie = request.cookies.get('skip_info_interstitial');

        if (cookie?.value === 'true') {
          return;
        }
      } else if (request.headers.has('x-interwebwtf-skip-insterstitial')) {
        return;
      }

      return NextResponse.redirect(
        new URL(`${request.nextUrl.pathname}/info`, request.nextUrl.origin).toString()
      );
    }

    return;
  }

  if (request.nextUrl.pathname === '/') {
    return;
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - is (expanded short links from other providers)
     * - api (API routes)
     * - login (login page)
     * - request-invite (request invite page)
     * - about (about page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!is|api|login|request-invite|about|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
