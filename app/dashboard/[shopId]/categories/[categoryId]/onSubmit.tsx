'use server'
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { createProduct, StoreCategory, StoreProduct, updatePriceOfProduct } from "@/Actions/store"
import {ProductSchema} from "@/lib/schema/ProductSchema"
import { redirect } from "next/navigation"
import { createCategory } from '@/Actions/store';
import { CategorySchema } from "@/lib/schema/CategorySchema"
import axios from "axios"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function AddBannerToProduct(url: string, categoryId: string) {
    const supabase = createClient()
    console.log(url)
    await supabase
        .from('categories')
        .update({
            banner_url: url
        })
        .eq('id', categoryId)
        .select()
}

export async function RemoveBannerFromCategory(url: string, categoryId: string) {
    const supabase = createClient()
    const imageKey = url.substring(url.lastIndexOf('/') + 1)
    console.log(url)
    await supabase
        .from('categories')
        .update({
            banner_url: ""
        })
        .eq('id', categoryId)
        .select()
    axios.post("/api/uploadthing/delete", {imageKey})
}

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