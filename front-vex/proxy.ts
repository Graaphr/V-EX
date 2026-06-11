import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const role = request.cookies.get('role')?.value;
  const pathname = request.nextUrl.pathname;

  const isAdminPage = pathname.startsWith('/admin');
  const isKetuaPblPage = pathname.startsWith('/ketua-pbl');

  if (!isAdminPage && !isKetuaPblPage) {
    return NextResponse.next();
  }

  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminPage && role !== 'Admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isKetuaPblPage && role !== 'Ketua PBL' ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/ketua-pbl/:path*'],
};
