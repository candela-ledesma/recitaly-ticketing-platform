// app/api/mercadopago/verify-payment/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function GET(req: NextRequest,  { params }: { params: Promise<{ id: string }>}){
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        const payment = new Payment(mercadopago);
        
        const paymentInfo = await payment.get({ id });
        
        return NextResponse.json({
            id: paymentInfo.id,
            status: paymentInfo.status,
            status_detail: paymentInfo.status_detail,
            transaction_amount: paymentInfo.transaction_amount,
            currency_id: paymentInfo.currency_id,
            date_created: paymentInfo.date_created,
        });
        
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}