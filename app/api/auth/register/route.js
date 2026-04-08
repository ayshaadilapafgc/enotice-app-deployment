import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
    try {
        const { fullName, regNo, password, role, subjectTaught } = await req.json();

        if (!fullName || !regNo || !password || !role) {
            return NextResponse.json({ error: 'All primary fields are required.' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { regNo }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Security: Default isVerified to false ALWAYS over the API wrapper. 
        // Only Admin can manually flip this via the User Management table.
        const user = await prisma.user.create({
            data: {
                fullName,
                regNo,
                password: hashedPassword,
                role: role,
                isVerified: false, 
                subjectTaught: role === 'TEACHER' ? subjectTaught : null
            }
        });

        return NextResponse.json({ message: 'User requested successfully. Pending admin approval.' }, { status: 201 });
    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
