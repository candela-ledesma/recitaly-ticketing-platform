// app/api/mercadopago/checkout-cart/route.ts
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});
const preferenceClient = new Preference(mercadopago);


export async function POST(req: Request) {
    try {
        const { items } = await req.json();
        
        const preference = {
            items: items.map((item: any, index: number) => ({
                id: `cart-item-${index}`,
                title: item.title,
                quantity: item.quantity,
                currency_id: 'ARS',
                unit_price: item.unit_price,
            })),
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
                failure: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/failure`,
                pending: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/pending`,
            },
            // Remover auto_return para development
            auto_return: 'approved',
        };

        const response = await preferenceClient.create({ body: preference });
        
        return NextResponse.json({ init_point: response.init_point });
        
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout' },
            { status: 500 }
        );
    }
}