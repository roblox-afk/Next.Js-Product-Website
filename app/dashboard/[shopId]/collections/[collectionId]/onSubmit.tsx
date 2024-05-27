'use server'
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { createCollection, createProduct, StoreCategory, StoreProduct, updatePriceOfProduct } from "@/Actions/store"
import {ProductSchema} from "@/lib/schema/ProductSchema"
import { redirect } from "next/navigation"
import { createCategory } from '@/Actions/store';
import { CategorySchema } from "@/lib/schema/CategorySchema"
import { CollectionSchema } from "@/lib/schema/CollectionSchema"
import axios from "axios"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function AddBannerToCollection(url: string, categoryId: string) {
    const supabase = createClient()
    await supabase
        .from('collections')
        .update({
            cover_url: url
        })
        .eq('id', categoryId)
        .select()
}

export async function RemoveBannerFromCollection(url: string, categoryId: string) {
    const supabase = createClient()
    const imageKey = url.substring(url.lastIndexOf('/') + 1)
    console.log(url)
    await supabase
        .from('collections')
        .update({
            cover_url: ""
        })
        .eq('id', categoryId)
        .select()
    axios.post("/api/uploadthing/delete", {imageKey})
}

export async function OnSubmitDashboardCollectionPage(values: z.infer<typeof CollectionSchema>, createNewCollection: boolean, banner_url: string, params: {shopId: string, collectionId: string}) {
    const supabase = createClient()
    if (createNewCollection) {
        createCollection(values, params.shopId, banner_url)
        redirect(`/dashboard/${params.shopId}/collections`)
    } else {
        await supabase
            .from('collections')
            .update({
                title: values.title,
                featured: values.featured,
                category: values.category,
            })
            .eq('id', params.collectionId)
        redirect(`/dashboard/${params.shopId}/collections`)
    }
    return null
}