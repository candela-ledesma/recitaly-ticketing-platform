"use client";
import React from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export function AddToCartButton({ recitalId, quantity }: { recitalId: number, quantity?: number }) {
    const ctx = useCart();
    const  { add } = ctx;
    const router = useRouter();

    const [isAdding, setIsAdding] = React.useState(false);

    async function handleAdd(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
        event.preventDefault();
        setIsAdding(true);
        
        await add(recitalId, quantity);
        setIsAdding(false);
        router.push("/home/cart");
    }

    return (
        <button
            onClick={handleAdd}
            className="w-full bg-pink-200 text-[#23232b] font-bold py-3 rounded-lg hover:bg-pink-300 transition text-lg"
        >
            {isAdding ? "Adding..." : "Add to Cart"}
        </button>
    );
}
