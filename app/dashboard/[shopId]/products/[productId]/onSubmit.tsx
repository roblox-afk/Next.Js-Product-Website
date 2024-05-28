'use server'
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { createProduct, StoreProduct, updatePriceOfProduct } from "@/Actions/store"
import {ProductSchema} from "@/lib/schema/ProductSchema"
import { redirect } from "next/navigation"
import { isVideoUrl } from "@/lib/utils"
import axios from "axios"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function AddMediaToProduct(url: string, productId: string) {
    const supabase = createClient()
    const {data: mediaInProduct} = await supabase
        .from('products')
        .select('media')
        .eq('id', productId)
        .single()
    if (mediaInProduct == null) return
    let newMediaArray = mediaInProduct.media || []
    newMediaArray = [...newMediaArray, {
        url: url,
        isVideo: isVideoUrl(url)
    }]
    const {data: updatedMediaInProduct} = await supabase
        .from('products')
        .update({
            media: newMediaArray
        })
        .eq('id', productId)
        .select()
    return newMediaArray
}

export async function RemoveMediaFromProduct(url: string, productId: string) {
    const supabase = createClient()
    const imageKey = url.substring(url.lastIndexOf('/') + 1)
    const {data: mediaInProduct} = await supabase
        .from('products')
        .select('media')
        .eq('id', productId)
        .single()
    if (mediaInProduct == null || mediaInProduct.media == null) return null
    const newMediaArray = mediaInProduct.media.filter((media: {url: string, isVideo: boolean}) => media.url !== url)
    const {data: updatedMediaInProduct} = await supabase
        .from('products')
        .update({
            media: newMediaArray
        })
        .eq('id', productId)
        .select()
    axios.post("/api/uploadthing/delete", {imageKey})
    return newMediaArray
}

export async function OnSubmitDashboardProductPage(values: z.infer<typeof ProductSchema>, createNewProduct: boolean, productData: StoreProduct, params: {shopId: string, productId: string}, media: StoreProduct["media"]) {
    const supabase = createClient()
    if (createNewProduct) {
        createProduct(values, params.shopId, media)
        redirect(`/dashboard/${params.shopId}/products`)
    } else {
        const collectionsList: string[] = values.collections?.map(collection => collection.value) || []
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