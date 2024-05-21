"use client"
import { findStoreWithSlug, storeData } from "@/Actions/store";
import { CartContext } from "@/components/providers/cart-provider";
import { DefaultShopLayout } from "@/components/Shop/layouts/default";
import { ModernShopLayout } from "@/components/Shop/layouts/modern";
import { LockedShop } from "@/components/Shop/Locked";
import { createClient } from "@/lib/supabase/server";
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { ReactElement, useContext, useEffect, useState } from "react";

const ShopPage = ({ params } : { params: {shopSlug: string} }) => {
    const router = useRouter()
    const successParam = useSearchParams().get("success")
    const cartContext = useContext(CartContext)
    if (successParam == "true") {
        cartContext.clearCart()
        router.push(`/shop/${params.shopSlug}`)
    }
    return (
        <>
        </>
    )
}
export default ShopPage;