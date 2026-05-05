// app/checkout/layout.tsx (opcional)
import { CartProvider } from '@/app/context/CartContext';

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            {children}
        </CartProvider>
    );
}