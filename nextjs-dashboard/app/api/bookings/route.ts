import { NextResponse } from 'next/server';
import { addBookings } from '@/app/lib/recital';

export async function POST(req: Request) {
  try {
    const { bookings } = await req.json();

    if (!Array.isArray(bookings)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    // Ejecuta cada booking individualmente
    const created = await Promise.all(
      bookings.map((b: any) =>
        addBookings(Number(b.userId), Number(b.recitalId), Number(b.amount))
      )
    );

    return NextResponse.json({ success: true, created });

  } catch (error) {
    console.error('❌ Error creating bookings:', error);
    return NextResponse.json({ error: 'Failed to create bookings' }, { status: 500 });
  }
}
