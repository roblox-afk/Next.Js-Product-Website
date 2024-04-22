'use server'

import { CreateStoreSchema } from '@/components/Cards/CreateStoreContent'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const createStore = async (formData: z.infer<typeof CreateStoreSchema>) => {
    const supabase = createClient()
    const { data, error } : {data: {id:string, user_id:string, title:string, slug: string, products: JSON, published: boolean}[] | null, error: any} = await supabase
        .from('stores')
        .insert([
            { title: formData.storeName, slug: formData.storeSlug },
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
    const { data, error } : {data: {id:string, user_id:string, title:string, slug: string, products: JSON, published: boolean} | null, error: any} = await supabase
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