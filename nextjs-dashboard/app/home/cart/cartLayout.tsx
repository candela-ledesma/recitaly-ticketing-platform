// app/home/cart/cartLayout.tsx – Client Component
"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useState } from "react"; 
import { useRouter } from 'next/navigation';

export default function CartScreen() {

    const { items, getTotalItems, getTotalPrice, remove, update, clear } =
    useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false); 
    const router = useRouter(); 

    if (!items.length) {
        return (
        <section className="mx-auto mt-20 max-w-lg text-center">
            <p className="text-4xl">🛒</p>
            <p className="mt-4 text-lg">Your cart is empty.</p>
        </section>
        );
    }

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        
        try {
            router.push('/home/checkout');
            
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Error proceeding to checkout. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };


    return (
        <section className="relative mx-auto max-w-2xl px-4 pb-32">
        {/* header */}
        <header className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Your Cart</h1>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.push('/home')}
                    className="rounded-md bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600 transition-colors"
                >
                    Continue Shopping
                </button>
                <button
                    onClick={async () => await clear()}
                    className="rounded-md bg-pink-200 px-4 py-2 text-sm font-medium text-black hover:bg-pink-700 transition-colors"
                >
                    Clear cart
                </button>
            </div>
        </header>

        {/* list of items */}
        <ul className="space-y-4">
            {items.map((it) => (
            <li
                key={it.id}
                className="flex flex-wrap items-center gap-4 rounded-lg border border-white/10 bg-zinc-800 p-4 shadow-sm"
            >
                {/* optional image */}
                {it.recital.images && it.recital.images.length > 0 && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                    <Image
                    src={it.recital.images[0].url}
                    alt={it.recital.name}
                    fill
                    className="object-cover"
                    />
                </div>
                )}

                {/* name & price */}
                <div className="flex-1 min-w-[8rem]">
                <p className="font-medium leading-tight">{it.recital.name}</p>
                <p className="text-sm text-white/60">
                    {typeof it.recital.price === "number"
                    ? `$${it.recital.price.toFixed(2)} each`
                    : "Price unavailable"}
                </p>
                </div>

                {/* quantity stepper */}
                <div className="flex items-center gap-1">
                <button
                    aria-label="Decrease quantity"
                    disabled={it.amount === 1}
                    className="rounded-md bg-white/10 p-1 disabled:opacity-40 hover:bg-white/20"
                    onClick={() => update(it.id, it.amount - 1)}
                >
                    <Minus size={16} />
                </button>
                <span className="w-8 text-center tabular-nums">{it.amount}</span>
                <button
                    aria-label="Increase quantity"
                    className="rounded-md bg-white/10 p-1 hover:bg-white/20"
                    onClick={() => update(it.id, it.amount + 1)}
                >
                    <Plus size={16} />
                </button>
                </div>

                {/* remove */}
                <button
                aria-label="Remove item"
                onClick={() => remove(it.id)}
                className="ml-2 rounded-md p-1 text-pink-400 hover:text-pink-300"
                >
                <Trash2 size={18} />
                </button>
            </li>
            ))}
        </ul>

        {/*  sticky footer */}
        <aside className="fixed bottom-0 left-0 right-0 bg-pink-200/90 backdrop-blur-sm border-t border-white/10 text-zinc-900 shadow-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
            <p className="font-medium">
                Total ({totalItems} {totalItems === 1 ? "item" : "items"}):
                &nbsp;${totalPrice.toFixed(2)}
            </p>

            <button 
                onClick={handleCheckout}
                disabled={isCheckingOut || totalItems === 0}
                className="rounded-lg bg-zinc-900 px-6 py-2 font-semibold text-pink-200 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isCheckingOut ? 'Processing...' : 'Proceed to checkout'}
            </button>

            </div>
        </aside>
        </section>
    );
}
