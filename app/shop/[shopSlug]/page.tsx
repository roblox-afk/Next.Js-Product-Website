import { findStoreWithSlug, storeData } from "@/Actions/store";
import { CartContext } from "@/components/providers/cart-provider";
import { DefaultShopLayout } from "@/components/Shop/layouts/default";
import { LockedShop } from "@/components/Shop/Locked";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { ReactElement, useContext, useEffect, useState } from "react";
import ShopFrontPage from "./content";

const ShopPage = async ({ params } : { params: {shopSlug: string} }) => {
    const supabase = createClient()
    const {data: storeData} = await supabase
        .from('stores')
        .select('*')
        .eq('slug', params.shopSlug)
        .single()
    if (storeData == null) return
    const {data: categories} = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeData.id)
    const {data: collections} = await supabase
        .from('collections')
        .select('*')
        .eq('store_id', storeData.id)
    const {data: products} = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id)
    return (
        <ShopFrontPage params={params} categories={categories} collections={collections} products={products} />
    )
}
export default ShopPage;