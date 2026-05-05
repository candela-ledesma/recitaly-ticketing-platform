import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST() {
  const now = new Date();
  const result = await prisma.recital.updateMany({
    where: {
      date: { lt: now },
      status: 'ACTIVE',
    },
    data: {
      status: 'INACTIVE',
    },
  });
  return NextResponse.json({ count: result.count });
}