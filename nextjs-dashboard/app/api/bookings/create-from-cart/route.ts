// app/api/bookings/create-from-cart/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/app/auth/auth'; 
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { paymentId, paymentStatus, external_reference, preference_id } = await req.json();
        const userId = Number(session.user.id);

    
        // Obtener items del carrito
        const cartItems = await prisma.cart.findMany({
            where: { userId },
            include: {
                recital: {
                    include: {
                        venue: true,
                        artist: true,
                    }
                }
            }
        });

            if (!cartItems.length) {
                return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
            }

            // Crear bookings
            const bookings = await Promise.all(
        cartItems.map(async (item) => {
            // Buscar si ya existe booking para este userId y recitalId
            const existing = await prisma.booking.findFirst({
            where: { userId, recitalId: item.recital.id },
            include: {
                recital: { include: { venue: true, artist: true } }
            }
            });

            if (existing) {
            // Actualizar la cantidad
            const updated = await prisma.booking.update({
                where: { id: existing.id },
                data: { amount: existing.amount + item.amount },
                include: {
                recital: { include: { venue: true, artist: true } }
                }
            });
            return updated;
            } else {
            // Crear nueva booking
            const created = await prisma.booking.create({
                data: {
                userId,
                recitalId: item.recital.id,
                amount: item.amount,
                date: new Date(),
                },
                include: {
                recital: { include: { venue: true, artist: true } }
                }
            });
            return created;
            }
        })
        );


        // Limpiar carrito de la BD
        const deleted = await prisma.cart.deleteMany({
            where: { userId }
        });

    
        return NextResponse.json({
            success: true,
            bookings: bookings.length,
            cartCleared: deleted.count,
            data: bookings
        });

    } catch (error) {
        console.error('❌ Error creating bookings:', error);
        return NextResponse.json(
            { 
                error: 'Failed to create bookings', 
                details: error instanceof Error ? error.message : String(error) 
            },
            { status: 500 }
        );
    }
}


export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(session.user.id);

        // Verificar si hay items en el carrito
        const cartItems = await prisma.cart.findMany({
            where: { userId },
            include: {
                recital: {
                    include: {
                        venue: true,
                        artist: true,
                    }
                }
            }
        });

        return NextResponse.json({
            userId,
            cartItems: cartItems.length,
            data: cartItems,
            message: "Cart items found"
        });

    } catch (error) {
        console.error('❌ Error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to fetch cart', 
                details: error instanceof Error ? error.message : String(error) 
            },
            { status: 500 }
        );
    }
}