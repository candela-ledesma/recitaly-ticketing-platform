// app/home/checkout/page.tsx
"use client";

import { useCart } from '@/app/context/CartContext';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
    const { items, getTotalItems, getTotalPrice } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    const handlePay = async () => {
        setIsProcessing(true);
        
        try {
            const checkoutData = {
                items: [{
                    title: `Cart Purchase - ${totalItems} items`,
                    quantity: 1,
                    unit_price: totalPrice,
                }]
            };

            const response = await fetch('/api/mercadopago/checkout-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(checkoutData),
            });

            if (!response.ok) throw new Error('Failed to create checkout');

            const { init_point } = await response.json();
            window.location.href = init_point;
            
        } catch (error) {
            console.error('Payment error:', error);
            alert('Error processing payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!items.length) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <p className="text-4xl mb-4">🛒</p>
                    <p className="text-xl mb-4">Your cart is empty</p>
                    <Link href="/home" className="text-pink-300 hover:underline">
                        Continue shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/home/cart" className="text-pink-300 hover:underline flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back to Cart
                    </Link>
                    <h1 className="text-3xl font-bold mt-2">Checkout</h1>
                </div>

                <div className="bg-zinc-800 rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 mb-3 p-3 bg-zinc-700 rounded">
                            {item.recital.images && item.recital.images.length > 0 && (
                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                                    <Image
                                        src={item.recital.images[0].url}
                                        alt={item.recital.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-medium">{item.recital.name}</p>
                                <p className="text-sm text-gray-400">
                                    Qty: {item.amount} × ${item.recital.price?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                            <p className="font-semibold">
                                ${((item.recital.price || 0) * item.amount).toFixed(2)}
                            </p>
                        </div>
                    ))}

                    <div className="border-t border-zinc-600 pt-4 mt-4">
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total ({totalItems} items)</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handlePay}
                    disabled={isProcessing || totalPrice === 0}
                    className="w-full bg-pink-200 hover:bg-pink-700 disabled:bg-pink-800 text-[#23232b] font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                    {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                </button>
                
                <p className="text-xs text-gray-400 text-center mt-4">
                    You will be redirected to MercadoPago to complete your payment.
                </p>
            </div>
        </div>
    );
}