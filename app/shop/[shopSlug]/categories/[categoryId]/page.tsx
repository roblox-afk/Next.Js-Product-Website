import { findStoreWithSlug, StoreCategory, StoreCollection, storeData, StoreProduct } from "@/Actions/store";
import CollectionCard from "@/components/Cards/Shop/CollectionCard";
import ProductCard from "@/components/Cards/Shop/ProductCard";
import { DefaultShopLayout } from "@/components/Shop/layouts/default";
import { ModernShopLayout } from "@/components/Shop/layouts/modern";
import { LockedShop } from "@/components/Shop/Locked";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

async function handleVisit(id:string) {

}

const ShopCategory = async ({ params } : { params: {shopSlug: string, categoryId: string} }) => {
    const supabase = createClient()
    const layout = "default"
    const { data, error } : {data: storeData | null, error: any} = await supabase
        .from('stores')
        .select('*')
        .eq('slug', params.shopSlug)
        .single()

    if (data == null) return null

    const { data: categoryData, error: categoryError } : { data: StoreCategory | null, error: any } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', data?.id)
        .eq('id', params.categoryId)
        .single()

    if (categoryData == null) return redirect("/shop/"+params.shopSlug)

    const { data: collectionsData, error: collectionsError } : { data: StoreCollection[] | null, error: any } = await supabase
        .from('collections')
        .select('*')
        .eq('store_id', data.id)
        .eq('category', categoryData.id)

    const { data: productsData, error: productsError } : { data: StoreProduct[] | null, error: any } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', data.id)
        .eq('category', params.categoryId)

    return (
        <div className="mx-24 h-[100]">
            <h1 className="pt-10 text-4xl font-bold">{categoryData.title}</h1>
            <div className="grid grid-cols-3 mt-12">
                {collectionsData?.map((collection) => {
                    return (
                        <CollectionCard key={collection.id} collectionData={collection}  />
                    )
                })}
            </div>
            {productsData && collectionsData ? <Separator className="w-full mt-6 bg-default-100" /> : <></> }
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
export default ShopCategory;