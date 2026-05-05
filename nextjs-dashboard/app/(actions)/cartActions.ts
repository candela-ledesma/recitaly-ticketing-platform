// /app/(actions)/cartActions.ts
"use server";

import { addToCart, updateCartItem, clearCart, removeCartItem } from "../lib/cartService";
import { auth } from "@/app/auth/auth";


export async function actionAdd(recitalId: number, qty = 1) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return await addToCart(Number(session.user.id), recitalId, qty);
}

export async function actionUpdate(itemId: number, qty: number) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return await updateCartItem(itemId, qty);
}

export async function actionRemove(itemId: number) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return await removeCartItem(itemId);
}


export async function actionClear() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return await clearCart(Number(session.user.id));
}