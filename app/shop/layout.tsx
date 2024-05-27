"use client"
import CartProvider, { CartContext } from "@/components/providers/cart-provider";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";

export default function ShopRootLayout({children}: {children: React.ReactNode}) {
    return (
        <CartProvider>
            {children}
        </CartProvider>
    );
}