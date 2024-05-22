"use client"
import { findStoreWithSlug, storeData } from "@/Actions/store";
import { CartContext } from "@/components/providers/cart-provider";
import { DefaultShopLayout } from "@/components/Shop/layouts/default";
import { ModernShopLayout } from "@/components/Shop/layouts/modern";
import { LockedShop } from "@/components/Shop/Locked";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { ReactElement, useContext, useEffect, useState } from "react";

const ShopPage = ({ params } : { params: {shopSlug: string} }) => {
    const supabase = createClient()
    const router = useRouter()
    const successParam = useSearchParams().get("success")
    const cartContext = useContext(CartContext)
    if (successParam == "true") {
        cartContext.clearCart()
        router.push(`/shop/${params.shopSlug}`)
    }
    const {data: storeData} = supabase
        .from('stores')
        .select('*')
        .eq('slug', params.shopSlug)
    const {data: collections} = supabase
        .from('collections')
        .select('*')
        .eq('store_id', storeData.id)
    return (
        <div className="h-full w-full">
            <div className="h-72 w-full bg-red-50">
                <Carousel>
                    <CarouselContent>
                        {}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    )
}
export default ShopPage;