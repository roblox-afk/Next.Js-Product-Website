import { findStoreWithSlug, StoreCategory, StoreCollection, storeData, StoreProduct } from "@/Actions/store";
import CollectionCard from "@/components/Cards/Shop/CollectionCard";
import ProductCard from "@/components/Cards/Shop/ProductCard";
import { DefaultShopLayout } from "@/components/Shop/layouts/default";
import { LockedShop } from "@/components/Shop/Locked";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

async function handleVisit(id:string) {

}

const ShopCollection = async ({ params } : { params: {shopSlug: string, collectionId: string} }) => {
    const supabase = createClient()
    const layout = "default"
    const { data, error } : {data: storeData | null, error: any} = await supabase
        .from('stores')
        .select('*')
        .eq('slug', params.shopSlug)
        .single()

    if (data == null) return null


    const { data: collectionsData, error: collectionsError } : { data: StoreCollection | null, error: any } = await supabase
        .from('collections')
        .select('*')
        .eq('store_id', data.id)
        .eq('id', params.collectionId)
        .single()

    if (collectionsData == null) return redirect("/shop/"+params.shopSlug)

    const { data: productsData, error: productsError } : { data: StoreProduct[] | null, error: any } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', data.id)
        .contains('collections', [params.collectionId])

    return (
        <div className="mx-24 h-[100]">
            <h1 className="pt-10 text-4xl font-bold">{collectionsData.title}</h1>
            <div className="grid grid-cols-3 mt-6">
                {productsData?.map((product) => {
                    return (
                        <ProductCard key={product.id} productData={product}  />
                    )
                })}
            </div>
        </div>
    )
}
export default ShopCollection;