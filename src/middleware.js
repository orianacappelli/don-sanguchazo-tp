// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. Obtenemos el token o la cookie que identifica al usuario
  const token = request.cookies.get('token'); // Asumimos que guardas el JWT o sesión en una cookie llamada 'token'
  const userRole = request.cookies.get('userRole')?.value; // Opcional: si guardas el rol en otra cookie

  const { pathname } = request.nextUrl;

  // 2. Protegemos rutas que empiezan con /dashboard
  if (pathname.startsWith('/dashboard')) {
    // Si no hay token, lo mandamos al login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si hay token pero el rol no es 'admin', lo mandamos al home
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Configuración: a qué rutas aplicar este middleware
export const config = {
  matcher: ['/dashboard/:path*'],
};