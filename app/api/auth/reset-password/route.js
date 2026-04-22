import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
    try {
        const { regNo, newPassword } = await req.json();

        if (!regNo || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { regNo }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // In a real app we would hash the password.
        await prisma.user.update({
            where: { regNo },
            data: { password: newPassword }
        });

        return NextResponse.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
