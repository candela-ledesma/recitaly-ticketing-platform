// app/payment/pending/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Suspense } from 'react'

function PaymentPending() {
    const searchParams = useSearchParams();
    const collection_id = searchParams.get('collection_id');

    return (
        
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-8">
            <div className="max-w-md mx-auto text-center">
                <div className="bg-zinc-800 rounded-xl p-8 shadow-lg">
                    <Clock size={64} className="mx-auto text-yellow-500 mb-4" />
                    
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Payment Pending
                    </h1>
                    
                    <p className="text-gray-300 mb-6">
                        Your payment is being processed. You'll receive an email confirmation once it's completed.
                    </p>

                    {collection_id && (
                        <div className="bg-zinc-700 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-300">
                                <strong>Reference:</strong> {collection_id}
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Link 
                            href="/home" 
                            className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
       
    );
}

export default function PaymentPendingPage() {
    return (
        <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
            <PaymentPending />
        </Suspense>
    );
}