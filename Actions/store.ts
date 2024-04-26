'use server'

import { CreateStoreSchema } from '@/components/Cards/CreateStoreContent'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export type StoreCollection = {
    id: string,
    coverUrl: string | null,
    title: string,
    products: string[] | null,
}


export type StoreCategory = {
    id: string,
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
    media: [
        {
            url: string,
            isVideo: boolean,
        }
    ] | null
}


export type storeData = {
    id: string,
    user_id: string,
    title: string,
    slug: string,
    logoUrl: string,
    published: boolean,
}

export const createStore = async (formData: z.infer<typeof CreateStoreSchema>) => {
    const supabase = createClient()
    const { data, error } : {data: storeData[] | null, error: any} = await supabase
        .from('stores')
        .insert([
            { title: formData.storeName, slug: formData.storeSlug, logoUrl: formData.storeLogo },
        ])
        .select()
    console.log(data)
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
    console.log(data)
    if (data == null){
        redirect("/")
        return null
    }

    return data
}