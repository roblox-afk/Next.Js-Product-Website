'use server'
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { createProduct, StoreProduct, updatePriceOfProduct } from "@/Actions/store"
import {ProductSchema} from "@/lib/schema/ProductSchema"
import { redirect } from "next/navigation"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function OnSubmitDashboardProductPage(values: z.infer<typeof ProductSchema>, createNewProduct: boolean, productData: StoreProduct, params: {shopId: string, productId: string}, media: StoreProduct["media"]) {
    const supabase = createClient()
    if (createNewProduct) {
        createProduct(values, params.shopId, media)
        redirect(`/dashboard/${params.shopId}/products`)
    } else {
        const collectionsList: string[] = values.collections.map(collection => collection.value)
        await supabase
            .from('products')
            .update({
                title: values.title,
                description: values.description,
                category: values.category,
                collections: collectionsList,
                isFeatured: values.isFeatured,
            })
            .eq('id', productData.id)
        if (productData.title != values.title) {
            await stripe.products.update(
                productData.stripe_product_id,
                {
                    name: values.title
                }
            )
        }
        updatePriceOfProduct(productData, Number(values.price))
        redirect(`/dashboard/${productData.store_id}/products`)
    }
    return null
}