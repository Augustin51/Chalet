import { type NextRequest, NextResponse } from 'next/server'
import { createSupabaseMiddlewareClient } from './lib/supabase/middleware'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabase = createSupabaseMiddlewareClient(req) 

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  if (!session) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/connexion', req.url))
    }
  }
  if (session) {
    if (pathname === '/connexion') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}