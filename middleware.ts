import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const role = req.cookies.get('role')?.value

  const { pathname } = req.nextUrl

  if (pathname === '/firstPage' && token !== 'fake-jwt-token') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (pathname === '/admin') {
    if (token !== 'fake-jwt-token' || role !== 'admin') {
      const url = req.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/firstPage', '/admin']
}
