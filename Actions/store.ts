'use server'

import { CreateStoreSchema } from '@/components/Cards/CreateStoreContent'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { cartProduct } from '@/components/providers/cart-provider'
import { headers } from 'next/headers'
import { ProductSchema } from '@/lib/schema/ProductSchema'
import { CategorySchema } from '@/lib/schema/CategorySchema'
import { CollectionSchema } from '@/lib/schema/CollectionSchema'

export type StoreCollection = {
    id: string,
    store_id: string,
    cover_url: string | null,
    title: string,
    category: string,
    products: string[] | null,
    featured: boolean
}

export type StoreCategory = {
    id: string,
    store_id: string,
    title: string,
    products: string[] | null,
    banner_url: string,
    featured_products: string[] | null
}

export type StoreProduct = {
    id: string,
    user_id: string,
    store_id: string
    title: string,
    description: string,
    price: number,
    isFeatured: boolean,
    featured_in_category: boolean,
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
    const {data: newProductSupabase, error} = await supabase
        .from('products')
        .insert([
            { media: mediaData, isFeatured: formData.isFeatured, category: formData.category, stripe_product_id: newProduct.id, stripe_price_id: newProduct.default_price, price: formData.price, title: formData.title, store_id: shopId, description: formData.description }
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
    if (newProductSupabase == null) return

    revalidatePath("/dashboard/"+shopId+"/products", "page")
    return newProductSupabase
}

export const deleteProduct = async (product: StoreProduct) => {
    const supabase = createClient()
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)
    const deletedProduct = await stripe.products.update(product.stripe_product_id, {active: false})
    revalidatePath("/dashboard/"+product.store_id+"/products", "page")
}

export const createCategory = async (formData: z.infer<typeof CategorySchema>, shopId: string, banner_url: string) => {
    const supabase = createClient()
    console.log("test")
    const {data: newCategorySupabase} = await supabase
        .from('categories')
        .insert([
            { title: formData.title, store_id: shopId, banner_url: banner_url }
        ])
        .select('*')
        .single()
    console.log(newCategorySupabase)

    if (newCategorySupabase == null) return

    revalidatePath("/dashboard/"+shopId+"/categories", "page")
    return newCategorySupabase
}

export const addFeaturedProduct = async (productId: string) => {
    const supabase = createClient()
    const {data: productData} = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()
    if (productData == null) return
    const {data: oldCategory}: {data: StoreCategory | null} = await supabase
        .from('categories')
        .select('*')
        .eq('id', productData.category)
        .single()
    if (oldCategory == null) return
    await supabase
        .from('categories')
        .update({
            featured_products: [...oldCategory.featured_products || [], productId]
        })
        .eq('id', productData.category)
        .select()
    await supabase
        .from('products')
        .update({
            featured_in_category: true
        })
        .eq('id', productId)
        .select()
    revalidatePath("/dashboard/"+productData.store_id+"/categories", "page")
}

export const removeFeaturedProduct = async (productId: string) => {
    const supabase = createClient()
    const {data: productData} = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()
    if (productData == null) return
    const {data: oldCategory}: {data: StoreCategory | null} = await supabase
        .from('categories')
        .select('*')
        .eq('id', productData.category)
        .single()
    if (oldCategory == null) return
    if (oldCategory.featured_products == null) return
    await supabase
        .from('categories')
        .update({
            featured_products: oldCategory.featured_products.filter(v => v != productId)
        })
        .eq('id', productData.category)
        .select()
    await supabase
        .from('products')
        .update({
            featured_in_category: false
        })
        .eq('id', productId)
        .select()
    revalidatePath("/dashboard/"+productData.store_id+"/categories", "page")
}

export const deleteCategory = async (category: StoreCategory) => {
    const supabase = createClient()
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id)
    revalidatePath("/dashboard/"+category.store_id+"/categories", "page")
}

export const createCollection = async (formData: z.infer<typeof CollectionSchema>, shopId: string, banner_url: string) => {
    const supabase = createClient()
    const {data: newCollectionSupabase} = await supabase
        .from('collections')
        .insert([
            { title: formData.title, store_id: shopId, cover_url: banner_url, featured: formData.featured, category: formData.category }
        ])
        .select('*')
        .single()

    if (newCollectionSupabase == null) return

    revalidatePath("/dashboard/"+shopId+"/collections", "page")
    return newCollectionSupabase
}

export const deleteCollection = async (collection: StoreCollection) => {
    const supabase = createClient()
    const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collection.id)
    revalidatePath("/dashboard/"+collection.store_id+"/collections", "page")
}