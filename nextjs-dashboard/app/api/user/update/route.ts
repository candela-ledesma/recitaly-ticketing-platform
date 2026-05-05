// app/api/user/route.ts
import { auth } from '@/app/auth/auth';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

    const { name } = await req.json();

    try {
        await prisma.user.update({
        where: { email: session.user.email },
        data: { name },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
