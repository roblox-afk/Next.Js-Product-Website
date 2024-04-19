'use server'

import { CreateStoreSchema } from '@/components/Navigation/SideBar-ShopSelect'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const createStore = async (formData: z.infer<typeof CreateStoreSchema>) => {
    const supabase = createClient()
    const { data, error } : {data: {id:string, user_id:string, title:string, products: JSON, published: boolean}[] | null, error: any} = await supabase
        .from('stores')
        .insert([
            { title: formData.storeName },
        ])
        .select()
    console.log(data)
    revalidatePath("/dashboard", "layout")
    if (data == null) {
        redirect("/dashboard")
    } else {
        redirect("/dashboard?id="+data[0].id)
    }
}