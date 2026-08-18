import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function middleware(request: NextRequest) {
  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/api/auth/check-email']

  const pathname = request.nextUrl.pathname

  // Check if current path is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  try {
    // Get the auth token from cookies
    const token = request.cookies.get('sb-auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Try to verify the token with Supabase
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data, error } = await supabase.auth.getUser(token)

      if (error || !data.user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
