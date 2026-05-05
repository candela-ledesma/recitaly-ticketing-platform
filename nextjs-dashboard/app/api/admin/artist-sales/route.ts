// app/api/admin/sales-by-artist/route.ts
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await prisma.booking.groupBy({
    by: ['recitalId'],
    _sum: { amount: true },
  });
  console.log('Data:', data);

  const recitals = await prisma.recital.findMany({
    where: { id: { in: data.map(d => d.recitalId) } },
    select: {
      id: true,
      name: true,
      artist: { select: { name: true } },
    },
  });

  console.log('Recitals:', recitals);
  const result = data.map(d => {
    const recital = recitals.find(r => r.id === d.recitalId);
    return {
      artist: recital?.artist.name || 'Unknown',
      recital: recital?.name || 'Unknown',
      total: d._sum.amount || 0,
    };
  });
console.log('Result:', result);
  const grouped = result.reduce((acc, curr) => {
    const found = acc.find(r => r.artist === curr.artist);
    if (found) {
      found.total += curr.total;
    } else {
      acc.push({ artist: curr.artist, total: curr.total });
    }
    return acc;
  }, [] as { artist: string; total: number }[]);
    console.log('Grouped:', grouped);

  return NextResponse.json(grouped);
}
