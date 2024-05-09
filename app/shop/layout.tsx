"use client"
import CartProvider from "@/components/providers/cart-provider";

export default function ShopRootLayout({children}: {children: React.ReactNode}) {
    return (
        <CartProvider>
            {children}
        </CartProvider>
    );
}