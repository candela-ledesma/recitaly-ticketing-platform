// app/api/save-subscription/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
  const sub = await req.json();
  await prisma.pushSubscription.create({
    data: {
      endpoint: sub.endpoint,
      keys: sub.keys,
    },
  });
  console.log('New subscription saved:', sub);
  return new Response('Subscribed', { status: 201 });
}
