import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-enotice-key');
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
