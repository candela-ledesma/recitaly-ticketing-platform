import { NextResponse } from 'next/server';
import { actionRemove, actionUpdate } from '@/app/(actions)/cartActions';

export const dynamic = 'force-dynamic';

// DELETE /api/cart/[itemId] - Remove specific item
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ itemId: string }> } 
) {
    try {
        const resolvedParams = await params;
        const itemId = parseInt(resolvedParams.itemId);
        
        if (isNaN(itemId)) {
            return NextResponse.json({ error: 'Invalid itemId' }, { status: 400 });
        }

        await actionRemove(itemId);
        
        return NextResponse.json({ message: 'Item removed from cart' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
    }
}

// PUT /api/cart/[itemId] - Update item quantity
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ itemId: string }> } // ← Cambiar tipo
) {
    try {
        const resolvedParams = await params; // ← Await params
        const itemId = parseInt(resolvedParams.itemId);
        const { quantity } = await req.json();
        
        if (isNaN(itemId) || !quantity || quantity < 1) {
            return NextResponse.json({ error: 'Invalid itemId or quantity' }, { status: 400 });
        }

        const updatedItem = await actionUpdate(itemId, quantity);
        
        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error('Error updating cart item:', error);
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
}