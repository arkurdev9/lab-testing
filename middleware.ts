import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the user session from cookie or header
  // In this implementation, we'll check for a session token in cookies
  // or user data stored after login
  let user = null;
  let userRole = null;

  // Cek apakah ada data pengguna di cookie
  const userData = request.cookies.get('current_user');
  if (userData) {
    try {
      const parsedUserData = JSON.parse(userData.value || '{}');
      user = { id: parsedUserData.id };
      userRole = parsedUserData.role;
    } catch (error) {
      console.error('Error parsing user data from cookie:', error);
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (userRole !== 'Admin') {
      // Redirect to unauthorized page if not admin
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Protect user routes
  if (request.nextUrl.pathname.startsWith('/user')) {
    if (!user) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (!['Petugas Lapangan', 'Kepala Lab'].includes(userRole)) {
      // Redirect to unauthorized page if not authorized
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Allow access to protected routes if authenticated
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Continue to the next middleware or route
  return NextResponse.next();
}

// Define which routes the middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};