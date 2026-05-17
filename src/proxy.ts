import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const protectedRoutes = ['/dashboard', '/passbook']
const authRoutes = ['/auth/signin', '/auth/signup', '/auth/forgot-password']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth_token')?.value

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminAuthRoute = pathname === '/admin/login'

  // Block unauthenticated users from admin routes
  if (isAdminRoute && !isAdminAuthRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    const payload = await verifyToken(token)
    if (!payload || payload.type !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // Redirect authenticated admins away from admin login
  if (isAdminAuthRoute && token) {
    const payload = await verifyToken(token)
    if (payload && payload.type === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
    const payload = await verifyToken(token)
    if (!payload) {
      const res = NextResponse.redirect(new URL('/auth/signin', req.url))
      res.cookies.delete('auth_token')
      return res
    }
  }

  if (isAuthRoute && token) {
    const payload = await verifyToken(token)
    if (payload) {
      if (payload.type === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
