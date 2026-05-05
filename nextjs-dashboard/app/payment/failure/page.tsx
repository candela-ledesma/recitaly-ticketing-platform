// app/payment/failure/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'
import Link from 'next/link';
import { XCircle } from 'lucide-react';

 function FailurePage() {
    const searchParams = useSearchParams();
    const collection_status = searchParams.get('collection_status');

    return (
        
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-8">
            <div className="max-w-md mx-auto text-center">
                <div className="bg-zinc-800 rounded-xl p-8 shadow-lg">
                    <XCircle size={64} className="mx-auto text-red-500 mb-4" />
                    
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Payment Failed
                    </h1>
                    
                    <p className="text-gray-300 mb-6">
                        There was an issue processing your payment. Please try again.
                    </p>

                    <div className="space-y-3">
                        <Link 
                            href="/home/cart" 
                            className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Back to Cart
                        </Link>
                        
                        <Link 
                            href="/home" 
                            className="block w-full bg-zinc-600 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        
    );
}
export default function PaymentFailurePage() {
    return (
        <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
            <FailurePage />
        </Suspense>
    );
}