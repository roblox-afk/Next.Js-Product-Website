import { findStoreWithSlug, storeData } from "@/Actions/store";
import { DefaultShopLayout } from "@/components/Shop/layouts/default";
import { ModernShopLayout } from "@/components/Shop/layouts/modern";
import { LockedShop } from "@/components/Shop/Locked";
import { createClient } from "@/lib/supabase/server";
import { redirect, useSearchParams } from 'next/navigation';
import { ReactElement, useEffect, useState } from "react";

const ShopPage = async ({ params } : { params: {shopSlug: string} }) => {
    const supabase = createClient()
    const layout = "default"
    const { data, error } : {data: storeData | null, error: any} = await supabase
        .from('stores')
        .select('*')
        .eq('slug', params.shopSlug)
        .single()

    if (data == null) return null

    return (
        <>
        </>
    )
}
export default ShopPage;