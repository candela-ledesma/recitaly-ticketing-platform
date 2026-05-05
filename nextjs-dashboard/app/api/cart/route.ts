import { NextResponse } from 'next/server';
import { auth } from '@/app/auth/auth';
import { actionAdd, actionClear } from '@/app/(actions)/cartActions';
import { getCart } from '@/app/lib/cartService'; 

export const dynamic = 'force-dynamic';

// POST /api/cart - Add item to cart
export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recitalId, quantity = 1 } = await req.json();
    if (!recitalId) {
        return NextResponse.json({ error: "Missing recitalId" }, { status: 400 });
    }

    try {
        if(quantity <1) throw new Error("Quantity must be at least 1");
        const item = await actionAdd(recitalId, quantity);
        return NextResponse.json(item, { status: 201 });
    } catch (err) {
        console.error("[POST /api/cart]", err);
        return NextResponse.json({ error: "db_error" }, { status: 500 });
    }
}

// GET /api/cart - Get all cart items
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const items = await getCart(Number(session.user.id));
        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await actionClear();
        return NextResponse.json({ message: 'Cart cleared' });
    } catch (error) {
        return NextResponse.json({ 
            error: 'Failed to clear cart',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}