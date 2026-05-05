// /app/ui/CartSidebar.tsx
"use client";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

export default function CartSidebar({ 
    isOpen, 
    onClose 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
}) {
    const { items, update, clear } = useCart();

    const total = items.reduce((sum, item) => 
        sum + ((item.recital.price ?? 0) * item.amount), 0
    );

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Carrito</h2>
                    <button onClick={onClose} className="text-gray-500">✕</button>
                </div>

                {items.length === 0 ? (
                    <p>Tu carrito está vacío</p>
                ) : (
                    <>
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 mb-4 p-4 border rounded">
                                {item.recital.images[0] && (
                                    <Image
                                        src={item.recital.images[0].url}
                                        alt={item.recital.name}
                                        width={60}
                                        height={60}
                                        className="rounded"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.recital.name}</h3>
                                    <p className="text-sm text-gray-600">{item.recital.artist.name}</p>
                                    <p className="text-pink-600">${item.recital.price}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => update(item.id, item.amount - 1)}
                                        className="bg-gray-200 px-2 py-1 rounded"
                                    >
                                        -
                                    </button>
                                    <span>{item.amount}</span>
                                    <button 
                                        onClick={() => update(item.id, item.amount + 1)}
                                        className="bg-gray-200 px-2 py-1 rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        <div className="border-t pt-4">
                            <div className="flex justify-between mb-4">
                                <span className="font-bold">Total: ${total}</span>
                            </div>
                            <button className="w-full bg-pink-500 text-white py-2 rounded mb-2">
                                Proceder al pago
                            </button>
                            <button 
                                onClick={clear}
                                className="w-full bg-gray-200 text-gray-700 py-2 rounded"
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}