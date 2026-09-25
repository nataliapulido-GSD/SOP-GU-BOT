import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');

    // Si intenta entrar al login pero ya tiene sesión, lo mandamos al chat
    if (isAuthPage) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/chat', req.url));
        }
        return null;
    }

    // Si NO tiene sesión y está intentando entrar a cualquier otra ruta (incluyendo "/"), lo mandamos al login
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return null;
});

export const config = {
    // Protegemos todas las rutas excepto las APIs, estáticos y la carpeta de organizaciones
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|orgs).*)'],
};