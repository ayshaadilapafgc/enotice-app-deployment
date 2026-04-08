import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';

export async function POST(req) {
    try {
        const { regNo, password, role } = await req.json();

        if (!regNo || !password || !role) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { regNo }
        });

        if (!user || user.role !== role) {
            return NextResponse.json({ error: 'Invalid credentials or incorrect role selected.' }, { status: 401 });
        }

        // --- NEW LOGIC: Block unverified users ---
        if (!user.isVerified) {
            return NextResponse.json({ error: 'Account Pending. An Administrator must verify your account before you can log in.' }, { status: 403 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }

        // Create JWT token for session
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-enotice-key');
        const token = await new SignJWT({ id: user.id, regNo: user.regNo, fullName: user.fullName, role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('2h')
            .sign(secret);

        // Set cookie
        const response = NextResponse.json({ message: 'Login successful' });
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7200, // 2 hours
            path: '/',
        });

        return response;
    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
