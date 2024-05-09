import { findStoreWithSlug, StoreCategory, StoreCollection, storeData, StoreProduct } from "@/Actions/store";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";
import { Button } from '@/components/ui/button';

const ShopProduct = async ({ params } : { params: {shopSlug: string, productId: string} }) => {
    const supabase = createClient()
    const layout = "default"
    const { data, error } : {data: storeData | null, error: any} = await supabase
        .from('stores')
        .select('*')
        .eq('slug', params.shopSlug)
        .single()

    if (data == null) return redirect("/shop/"+params.shopSlug)

    const { data: productData, error: productError } : { data: StoreProduct | null, error: any } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', data.id)
        .eq('id', params.productId)
        .single()

    if (productData == null) return redirect("/shop/"+params.shopSlug)

    return (
        <div className="h-full">
            <div className="flex flex-col h-full w-[550px] mr-36 float-right mt-20">
                <h1 className="font-bold text-4xl w-[90%]">{productData.title}</h1>
                <h2 className="font-semibold mt-2">{productData.price == null || productData.price == 0 ? "Free" : "$" + productData.price + " USD"}</h2>
                <h2 className="font-semibold">Tax included</h2>
                <Button className="my-4 border-default-100 hover:border-default-200" variant="outline">ADD TO CART</Button>
                <p className="font-medium">{productData.description}</p>
            </div>
        </div>
    )
}
export default ShopProduct;