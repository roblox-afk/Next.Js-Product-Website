'use server'
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { createCollection, createProduct, StoreCategory, StoreProduct, updatePriceOfProduct } from "@/Actions/store"
import {ProductSchema} from "@/lib/schema/ProductSchema"
import { redirect } from "next/navigation"
import { createCategory } from '@/Actions/store';
import { CategorySchema } from "@/lib/schema/CategorySchema"
import { CollectionSchema } from "@/lib/schema/CollectionSchema"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

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