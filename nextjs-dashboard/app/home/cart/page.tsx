// app/home/cart/page.tsx  
import { Suspense } from "react";
import { auth } from "@/app/auth/auth";
import { getCart } from "@/app/lib/cartService";
import { CartProvider } from "@/app/context/CartContext";
import CartScreen from "@/app/home/cart/cartLayout";
                                                
export default async function CartPage() {      
   
    const session = await auth();
    if (!session?.user?.id)
        return <p className="mt-20 text-center">Please log in to view your cart.</p>;

    
    const items = await getCart(Number(session.user.id));

   
    return (
        <CartProvider initialCart={items}>
        <Suspense fallback={<p className="mt-20 text-center">Loading cart…</p>}>
            <CartScreen />      
        </Suspense>
        </CartProvider>
    );
}
