'use server'

import { CreateStoreSchema } from '@/components/Cards/CreateStoreContent'
import { CreateProductSchema } from '@/components/Cards/NewProductContent'
import { CreateCategorySchema } from '@/components/Cards/NewCategoryContent'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { cartProduct } from '@/components/providers/cart-provider'
import { headers } from 'next/headers'
import { ProductSchema } from '@/lib/schema/ProductSchema'

export type StoreCollection = {
    id: string,
    coverUrl: string | null,
    title: string,
    category: string,
    products: string[] | null,
}

export type StoreCategory = {
    id: string,
    store_id: string,
    title: string,
    products: string[] | null,
    collections: string[] | null,
}

export type StoreProduct = {
    id: string,
    user_id: string,
    store_id: string
    title: string,
    description: string,
    price: number,
    isFeatured: boolean,
    category: string | null,
    collections: string[] | null,
    stripe_product_id: string,
    stripe_price_id: string
    media:
        {
            url: string,
            isVideo: boolean,
        }[] | null
}

export type storeData = {
    id: string,
    user_id: string,
    title: string,
    slug: string,
    logoUrl: string,
    published: boolean,
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export const createStore = async (formData: z.infer<typeof CreateStoreSchema>) => {
    const supabase = createClient()
    const { data, error } : {data: storeData[] | null, error: any} = await supabase
        .from('stores')
        .insert([
            { title: formData.storeName, slug: formData.storeSlug, logoUrl: formData.storeLogo },
        ])
        .select()
    revalidatePath("/dashboard", "layout")
    if (data == null) {
        return error
    } else {
        redirect("/dashboard?id="+data[0].id)
    }
}

export const findStoreWithSlug = async (storeSlug: string) => {
    const supabase = createClient()
    const { data, error } : {data: storeData | null, error: any} = await supabase
        .from('stores')
        .select('*')
        .eq('slug', storeSlug)
        .single().then()
    if (data == null){
        redirect("/")
        return null
    }

    return data
}

export const updatePriceOfProduct = async (productData: StoreProduct, newPrice: number) => {
    const supabase = createClient()
    if (productData.price == newPrice) return
    const newStripePrice = await stripe.prices.create({
        currency: 'usd',
        product: productData.stripe_product_id,
        unit_amount_decimal: newPrice * 100
    })
    await stripe.products.update(
        productData.stripe_product_id,
        {
            default_price: newStripePrice.id
        }
    )
    await stripe.prices.update(
        productData.stripe_price_id,
        {
            active: false
        }
    )
    await supabase
        .from('products')
        .update({
            price: newPrice,
            stripe_price_id: newStripePrice.id
        })
        .eq('id', productData.id)
    //redirect(`/dashboard/${productData.store_id}/products`)
}

export const startCheckout = async (cartItems: cartProduct[], shopSlug: string) => {
    const headersList = headers()
    const domain = headersList.get("x-forwarded-host") || ""
    const storeUrl = `http://${domain}/shop/${shopSlug}`
    const itemsData = cartItems.map((item: cartProduct) => {
        return {
            price: item.stripe_price_id,
            quantity: item.quantity
        }
    })
    console.log(itemsData)
    const session = await stripe.checkout.sessions.create({
        line_items: itemsData,
        mode: 'payment',
        success_url: storeUrl + "?success=true",
        cancel_url: storeUrl,
    })
    redirect(session.url)
}

export const createProduct = async (formData: z.infer<typeof ProductSchema>, shopId: string, mediaData: StoreProduct["media"]) => {
    const supabase = createClient()
    const newProduct = await stripe.products.create({
        name: formData.title,
        default_price_data: {
            currency: "USD",
            unit_amount_decimal: Number(formData.price) * 100
        }
    })
    if (newProduct == null) return
    console.log(newProduct)
    const {data: newProductSupabase, error} = await supabase
        .from('products')
        .insert([
            { media: mediaData, category: formData.category, stripe_product_id: newProduct.id, stripe_price_id: newProduct.default_price, price: formData.price, title: formData.title, store_id: shopId, description: formData.description }
        ])
        .select('*')
        .single()
    if (formData.category != null) {
        const {data: categoryData, error: categoryError} = await supabase
            .from('categories')
            .select('*')
            .eq('id', formData.category)
            .single()
        if (categoryData != null) {
            const {data} = await supabase
                .from('categories')
                .update({ products: [... newProductSupabase.id] })
                .eq('id', formData.category)
        }
    }
    console.log(newProductSupabase)
    if (newProductSupabase == null) return

    revalidatePath("/dashboard/"+shopId+"/products", "page")
    return newProductSupabase
}

export const deleteProduct = async (product: StoreProduct) => {
    const supabase = createClient()
    console.log(product)
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)
    console.log(error)
    const deletedProduct = await stripe.products.update(product.stripe_product_id, {active: false})
    revalidatePath("/dashboard/"+product.store_id+"/products", "page")
}

export const createCategory = async (formData: z.infer<typeof CreateCategorySchema>, shopId: string) => {
    const supabase = createClient()
    const {data: newCategorySupabase, error} = await supabase
        .from('categories')
        .insert([
            { title: formData.title, store_id: shopId }
        ])
        .select('*')
        .single()
    if (newCategorySupabase == null) return

    revalidatePath("/dashboard/"+shopId+"/categories", "page")
    return newCategorySupabase
}

export const deleteCategory = async (category: StoreCategory) => {
    const supabase = createClient()
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id)
    console.log(error)
    revalidatePath("/dashboard/"+category.store_id+"/categories", "page")
}