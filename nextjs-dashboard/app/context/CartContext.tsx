"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItemWithRecital } from "@/app/lib/cartService";


type CartContextType = {
    items: CartItemWithRecital[];
    add: (recitalId: number, quantity?: number) => Promise<void>;
    update: (itemId: number, quantity: number) => Promise<void>;
    remove: (itemId: number) => Promise<void>;
    clear: () => Promise<void>; 
    reload: () => Promise<void>; 
    getTotalItems: () => number;
    getTotalPrice: () => number;
};


const CartCtx = createContext<CartContextType | null>(null);

export function useCart() {
    const ctx = useContext(CartCtx);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
}
type CartProviderProps = {
  children: React.ReactNode;
  initialCart?: CartItemWithRecital[];
};

export function CartProvider({ children, initialCart = [] }: CartProviderProps) {
  const [items, setItems] = useState<CartItemWithRecital[]>(initialCart);

    
    const reload = async () => {
        try {
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data: CartItemWithRecital[] = await res.json();
                setItems(data);
            } else {
                setItems([]);
            }
        } catch (e) {
            setItems([]);
        }
    };

    // Carga inicial
    useEffect(() => {
        reload();
    }, []);

    
    const add = async (recitalId: number, quantity = 1) => {
        
        await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recitalId, quantity }),
        });
        await reload();
    };

    const update = async (itemId: number, quantity: number) => {
        await fetch(`/api/cart/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
        });
        await reload();
    };

    const remove = async (itemId: number) => {
        await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
        await reload();
    };

  
    const clear = async () => {
    try {
        // 1. Limpiar backend
        const response = await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to clear cart');
        }

        // 2. Limpiar estado local
        setItems([]);
        
        console.log('✅ Cart cleared successfully');
    } catch (error) {
        console.error('❌ Error clearing cart:', error);
        // En caso de error, al menos limpia local
        setItems([]);
    }
    };

    const getTotalItems = () => items.reduce((sum, item) => sum + item.amount, 0);
    const getTotalPrice = () => items.reduce((sum, item) => sum + (item.recital.price || 0) * item.amount, 0);

    return (
        <CartCtx.Provider value={{
            items, add, update, remove, clear, reload, getTotalItems, getTotalPrice
        }}>
            {children}
        </CartCtx.Provider>
    );
}
