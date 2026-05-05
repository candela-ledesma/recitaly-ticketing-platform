// /lib/cartService.ts
import { prisma } from './prisma';


export type CartItemWithRecital = {
    id: number;
    userId: number;
    recitalId: number;
    amount: number;
    recital: {
        id: number;
        name: string;
        date: Date; 
        price?: number;
        images: {
            id: number;
            url: string;
            ratio?: string;
        }[];
        artist: {
            id: number;
            name: string;
        };
        venue: {
            id: number;
            name: string;
            city?: string;
        };
    };
};


export async function getCart(userId: number): Promise<CartItemWithRecital[]> {
    const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: { 
            recital: { 
                include: { 
                    images: true,
                    artist: true,
                    venue: true
                } 
            } 
        },
    });
    return cartItems as CartItemWithRecital[];
}

export async function addToCart(
    userId: number,
    recitalId: number,
    amount = 1,
): Promise<CartItemWithRecital> {
    const cartItem = await prisma.cart.upsert({
        where: { userId_recitalId: { userId, recitalId } },
        update: { amount: { increment: amount } },
        create: { userId, recitalId, amount },
        include: { 
            recital: { 
                include: { 
                    images: true,
                    artist: true,
                    venue: true
                } 
            } 
        },
    });
    return cartItem as CartItemWithRecital;
}

export async function updateCartItem(
    id: number,
    amount: number,
): Promise<CartItemWithRecital | void> {
    if (amount === 0) {
        await prisma.cart.delete({ where: { id } });
        return;
    }
    const updatedCartItem = await prisma.cart.update({
        where: { id },
        data: { amount },
        include: { 
            recital: { 
                include: { 
                    images: true,
                    artist: true,
                    venue: true
                } 
            } 
        },
    });
    return updatedCartItem as CartItemWithRecital;
}

export async function clearCart(userId: number): Promise<void> {
    try {
        const result = await prisma.cart.deleteMany({
            where: { userId }
        });
    } catch (error) {
        console.error('Error in clearCart:', error);
        throw error;
    }
}


export async function removeCartItem(id: number): Promise<void> {
    await prisma.cart.delete({ 
        where: { id } 
    });
}
