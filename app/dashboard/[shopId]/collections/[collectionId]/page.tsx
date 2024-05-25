"use server"
import {Divider, ScrollShadow} from "@nextui-org/react"
import { createClient } from "@/lib/supabase/server"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog } from "@/components/ui/dialog"
import DialogSetup from "@/components/DialogSetup"
import { Drawer } from "@/components/ui/drawer"
import { ProductDescription } from "@/components/Tiptap/productDescription"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { EditCollectionContent } from "./content"
import { revalidatePath } from "next/cache"
import { isVideoUrl } from "@/lib/utils"
import axios from "axios"

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

const DashboardEditCollection = async ({params} : {params: {shopId: string, collectionId: string}}) => {
    const supabase = createClient()
    const createNewCollection = params.collectionId == "new"

    const { data: collection } = await supabase
        .from("collections")
        .select('*')
        .eq('store_id', params.shopId)
        .eq('id', params.collectionId)
        .single()
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', params.shopId)
    if (!collection && !createNewCollection) redirect(`/dashboard/${params.shopId}/collections`)

    return (
        <EditCollectionContent createNewCollection={createNewCollection} categories={categories} collectionData={collection} params={params} />
    )
}

export default DashboardEditCollection