'use server'
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { createProduct, StoreProduct, updatePriceOfProduct } from "@/Actions/store"
import {ProductSchema} from "@/lib/schema/ProductSchema"
import { redirect } from "next/navigation"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function OnSubmitDashboardProductPage(values: z.infer<typeof ProductSchema>, createNewProduct: boolean, productData: StoreProduct, media: StoreProduct["media"]) {
    const supabase = createClient()
    if (createNewProduct) {
        createProduct(values, productData.store_id, media)
        redirect(`/dashboard/${productData.store_id}/products`)
    } else {
        await supabase
            .from('products')
            .update({
                title: values.title,
                description: values.description,
                category: values.category,
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