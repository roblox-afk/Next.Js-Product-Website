'use server'
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { createProduct, StoreCategory, StoreProduct, updatePriceOfProduct } from "@/Actions/store"
import {ProductSchema} from "@/lib/schema/ProductSchema"
import { redirect } from "next/navigation"
import { createCategory } from '@/Actions/store';
import { CategorySchema } from "@/lib/schema/CategorySchema"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function OnSubmitDashboardCategoryPage(values: z.infer<typeof CategorySchema>, createNewCategory: boolean, banner_url: string, params: {shopId: string, categoryId: string}) {
    const supabase = createClient()
    if (createNewCategory) {
        createCategory(values, params.shopId, banner_url)
        redirect(`/dashboard/${params.shopId}/categories`)
    } else {
        await supabase
            .from('categories')
            .update({
                title: values.title,
            })
            .eq('id', params.categoryId)
        redirect(`/dashboard/${params.shopId}/categories`)
    }
    return null
}