// app/api/recitals/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';   
import { notFound } from 'next/navigation'; 
import { stat } from 'fs';


export const dynamic = 'force-dynamic'; 

export async function GET(req: Request) {

try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const skipParam = searchParams.get('skip');
    const take = limitParam ? Number(limitParam) : undefined;
    const skip = skipParam ? Number(skipParam) : 0;
    const artist = searchParams.get('artist') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const status = searchParams.get('status') || 'ACTIVE';

    if (status !== 'ACTIVE') {
        
        const recitals = await prisma.recital.findMany({
            orderBy: { date: 'asc' },
            where: {
                status: 'INACTIVE',
            },
            include: { artist: true, venue: true, images: true},
            ...(take ? { take } : {}),
            ...(skip ? { skip } : {}),
            });

    
        if (!recitals || recitals.length === 0) {
                 throw notFound(); 
        }   

         return NextResponse.json(recitals); 
    }


    if(artist.length > 0) {
        const recitals = await prisma.recital.findMany({
    orderBy: { date: 'asc' },
    where: {
        status: 'ACTIVE',
        artist: { name: { contains: artist, mode: 'insensitive' }
    }
    
    },
    include: { artist: true, venue: true, images: true},
    ...(take ? { take } : {}),
    ...(skip ? { skip } : {}),
    });


    if (!recitals || recitals.length === 0) {
        return NextResponse.json([], { status: 200 });
    }

    

    return NextResponse.json(recitals); 
    }else{

        const dateFilter: any = {};
        if (dateFrom) dateFilter.gte = new Date(dateFrom);
        if (dateTo)   dateFilter.lte = new Date(dateTo);

        const recitals = await prisma.recital.findMany({
            orderBy: { date: 'asc' },
            where: {
                status: 'ACTIVE',
                ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}),
            },
            include: { artist: true, venue: true, images: true},
            ...(take ? { take } : {}),
            ...(skip ? { skip } : {}),
            });

    
    if (!recitals || recitals.length === 0) {
        throw notFound(); 
    }

    return NextResponse.json(recitals); 
    }
} catch (err: any) {
    console.error('[GET /api/recitals]', err.code, err.meta ?? err);
    return NextResponse.json(
    { error: 'db_error', details: err.meta ?? String(err) },
    { status: 500 },
    );
}

}


export async function DELETE() {
    try {
    
        // Delete all related data first (cascade)
        await prisma.booking.deleteMany({});
        await prisma.cart.deleteMany({});
        
        // Then delete all recitals
        const result = await prisma.recital.deleteMany({});
        
        return NextResponse.json({ 
            message: `Successfully deleted ${result.count} recitals`,
            deletedCount: result.count
        });
    } catch (error) {
        console.error('❌ Error deleting all recitals:', error);
        return NextResponse.json(
            { error: 'Failed to delete all recitals' },
            { status: 500 }
        );
    }
}