import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
    try {
        const { regNo, fullName, reason, details } = await req.json();

        if (!regNo || !fullName || !reason) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { regNo }
        });

        if (!user) {
            return NextResponse.json({ error: 'User with this registration number not found' }, { status: 404 });
        }

        // Check for existing pending request
        const existingRequest = await prisma.passwordResetRequest.findFirst({
            where: {
                regNo,
                status: 'PENDING'
            }
        });

        if (existingRequest) {
            return NextResponse.json({ error: 'You already have a pending reset request. Please wait for admin approval.' }, { status: 400 });
        }

        // Create the request
        await prisma.passwordResetRequest.create({
            data: {
                regNo,
                fullName,
                reason,
                details: details || '',
                status: 'PENDING'
            }
        });

        return NextResponse.json({ message: 'Reset request submitted successfully. Please wait for admin approval.' }, { status: 201 });
    } catch (error) {
        console.error('Request Reset Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
