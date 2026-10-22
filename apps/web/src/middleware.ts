import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // ─── Proteksi halaman admin & dashboard (Fase 3) ───
  // Rute yang butuh login: /dashboard, /cart, /checkout, /orders
  const protectedPaths = ['/dashboard', '/cart', '/checkout', '/orders'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── Jika sudah login dan buka halaman auth, arahkan ke dashboard ───
  const authPaths = ['/login', '/register'];
  const isAuthPage = authPaths.some((p) => pathname === p);

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ─── Storefront publik (/, /products, /products/[slug]) — tidak diblok ───
  return NextResponse.next();
}

export const config = {
  // Awasi semua rute kecuali aset statis dan Next.js internal
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
