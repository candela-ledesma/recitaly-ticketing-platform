//fetch all artists names from database 
import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const artists = await prisma.artist.findMany({
      select: { name: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(artists.map(a => a.name));
  } catch (error) {
    console.error('[GET /api/artists] DB error', error);
    // Return an empty array on error to keep clients resilient
    return NextResponse.json([], { status: 200 });
  } 
}