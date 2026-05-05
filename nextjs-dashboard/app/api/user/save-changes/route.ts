// app/api/user/save-info/route.ts
import { NextRequest } from 'next/server';
import { auth } from '@/app/auth/auth';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
    const session = await auth();

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { address, phone } = await req.json();

  if (!address || address.length < 5) {
    console.log('Invalid address:', address);
    return new Response('Invalid adress', { status: 400 });
  }

  const phoneRegex = /^[\d\s()+-]{7,20}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return new Response('Invalid phone number', { status: 400 });
  }
  const cleanedPhone = phone.replace(/[^\d]/g, ''); // Quita todo excepto números

if (!cleanedPhone || cleanedPhone.length < 8 || cleanedPhone.length > 15) {
  return new Response('Invalid phone number length', { status: 400 });
}

  await prisma.user.update({
    where: { id: Number(session.user.id) },
    data: { adress: address, phoneNumber: Number(phone) },
  });

  return new Response('Saved successfully', { status: 200 });
}
