// app/payment/success/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart, CartProvider } from "@/app/context/CartContext"; // Importar CartProvider

function PaymentSuccess() {
    const [done, setDone] = useState(false);
    const [processing, setProcessing] = useState(true);
    const { clear, reload } = useCart();
    const searchParams = useSearchParams();

    // Obtener parámetros de MercadoPago
    const collection_id = searchParams.get('collection_id');
    const collection_status = searchParams.get('collection_status');
    const payment_id = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const external_reference = searchParams.get('external_reference');
    const preference_id = searchParams.get('preference_id');

    useEffect(() => {
        const processPayment = async () => {

            // Verificar si el pago fue exitoso
            const isApproved = collection_status === 'approved' || status === 'approved';
            
            if (!isApproved) {
                setProcessing(false);
                return;
            }

            try {
                
                // Crear bookings desde el carrito
                const res = await fetch('/api/bookings/create-from-cart', { 
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentId: collection_id || payment_id,
                        paymentStatus: collection_status || status,
                        external_reference,
                        preference_id
                    })
                });
                
                const data = await res.json();

                if (res.ok && data.success && data.bookings > 0) {
                    
                    // Limpiar carrito local
                    clear();
                    
                    // Recargar desde backend
                    await reload();
                    
                    setDone(true);
                    setProcessing(false);
                } else {
                    alert("Error creating your booking! " + (data.error || "Try again or contact support."));
                    setProcessing(false);
                }
            } catch (error) {
                alert("Error processing payment! Please contact support.");
                setProcessing(false);
            }
        };

        processPayment();
    }, [collection_id, collection_status, payment_id, status]);

    if (processing) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p>Procesando tu compra...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-8">
            <div className="max-w-md mx-auto text-center">
                <div className="bg-zinc-800 rounded-xl p-8 shadow-lg">
                    {done ? (
                        <>
                            <div className="text-green-500 text-6xl mb-4">✅</div>
                            <h1 className="text-2xl font-bold text-white mb-2">
                                ¡Compra realizada!
                            </h1>
                            <p className="text-gray-300 mb-6">
                                Tus reservas han sido creadas exitosamente.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="text-red-500 text-6xl mb-4">❌</div>
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Error en el pago
                            </h1>
                            <p className="text-gray-300 mb-6">
                                El pago no fue procesado correctamente.
                            </p>
                        </>
                    )}

                    {/* Debug info */}
                    <div className="bg-zinc-700 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-white mb-2">Debug Info:</h3>
                        <div className="text-sm text-gray-300 space-y-1">
                            <p><strong>Collection ID:</strong> {collection_id || 'N/A'}</p>
                            <p><strong>Collection Status:</strong> {collection_status || 'N/A'}</p>
                            <p><strong>Payment ID:</strong> {payment_id || 'N/A'}</p>
                            <p><strong>Status:</strong> {status || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <a 
                            href="/home" 
                            className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Volver al inicio
                        </a>
                        
                        <a 
                            href="/home/profile" 
                            className="block w-full bg-zinc-600 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Ver mis reservas
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function PaymentSuccessPage() {
    return (
        <CartProvider>
            <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
                <PaymentSuccess />
            </Suspense>
        </CartProvider>
    );
}