// app/api/user/me/route.ts
import { auth } from '@/app/auth/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
      select: {
        adress: true,
        phoneNumber: true,
      },
    });

    return Response.json(user ?? {});
  } catch (error) {
    console.error('Error in /api/user/me:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
