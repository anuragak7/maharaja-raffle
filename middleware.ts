import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const cookie = req.cookies.get('admin_auth')?.value;

  if (url.pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  if (cookie !== '1') {
    if (url.pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const loginUrl = url.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('next', url.pathname + url.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}