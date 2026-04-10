import { NextResponse, type NextRequest } from 'next/server'
import { AUTH_COOKIE } from './lib/auth'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get(AUTH_COOKIE)?.value === '1'
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/login')

  if (!isLoggedIn && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isLoggedIn && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
