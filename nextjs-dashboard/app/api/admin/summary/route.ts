// app/api/admin/summary/route.ts
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { startOfMonth } from 'date-fns';

// app/api/admin/summary/route.ts
export async function GET() {
  const start = startOfMonth(new Date());

  // Total sales
  const totalSales = await prisma.booking.aggregate({
    _sum: { amount: true },
    where: { date: { gte: start } },
  });
  const bookings = await prisma.booking.findMany({
  where: { date: { gte: start } },
  select: {
    amount: true,
    recital: {
      select: { price: true }
    }
  }
});

const totalRevenue = bookings.reduce((sum, b) => {
  return sum + (b.amount * (b.recital.price ?? 0));
}, 0);

  // Top selling recital
  const top = await prisma.booking.groupBy({
    by: ['recitalId'],
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 1,
  });

  const topRecital = top.length > 0
    ? await prisma.recital.findUnique({
        where: { id: top[0].recitalId },
        select: { name: true },
      }).then(recital => ({
        name: recital?.name || 'N/A',
        amount: top[0]._sum.amount || 0,
      }))
    : null;

  // Upcoming recital with least sales
  const next = await prisma.recital.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    include: { bookings: true },
    take: 10,
  });

  const bottom = next
    .map(r => ({
      name: r.name,
      amount: r.bookings.reduce((sum, b) => sum + b.amount, 0),
    }))
    .sort((a, b) => a.amount - b.amount)[0];

  return NextResponse.json({
    totalSales: totalRevenue,
    topRecital,
    bottomRecital: bottom || null,
  });
}

