import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

// PATCH /api/recitals/[id] - Update recital
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        const body = await req.json();
        
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        // Update recital and related entities
        const updatedRecital = await prisma.recital.update({
            where: { id },
            data: {
                name: body.name,
                artist: body.artist?.name ? {
                    update: { name: body.artist.name }
                } : undefined,
                venue: body.venue?.name ? {
                    update: { name: body.venue.name }
                } : undefined,
            },
            include: {
                artist: true,
                venue: true,
                images: true,
            },
        });

        return NextResponse.json(updatedRecital);
    } catch (error) {
        console.error('Error updating recital:', error);
        return NextResponse.json(
            { error: 'Failed to update recital' },
            { status: 500 }
        );
    }
}

// DELETE /api/recitals/[id] - Delete recital
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        // PATCH or PUT request to /api/recitals/[id]
        await prisma.recital.update({
        where: { id},
        data: { status: 'INACTIVE' },
        });

        return NextResponse.json({ message: 'Recital made inactive successfully' });
    } catch (error) {
        console.error('Error deleting recital:', error);
        return NextResponse.json(
            { error: 'Failed to delete recital' },
            { status: 500 }
        );
    }
}