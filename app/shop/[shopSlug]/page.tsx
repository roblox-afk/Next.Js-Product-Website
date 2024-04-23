import { findStoreWithSlug, storeData } from "@/Actions/store";
import { DefaultShopLayout } from "@/components/Shop/layouts/default";
import { ModernShopLayout } from "@/components/Shop/layouts/modern";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

async function handleVisit(id:string) {

}

const ShopPage = async ({ params } : { params: {shopSlug: string} }) => {
    const supabase = createClient()
    const layout = "default"
    const { data, error } : {data: storeData | null, error: any} = await supabase
        .from('stores')
        .select('*')
        .eq('slug', params.shopSlug)
        .single()

    console.log(data)

    return (
        <h1>{data?.title}</h1>
    )
}
export default ShopPage;