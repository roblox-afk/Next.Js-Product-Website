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
import { EditProductContent } from "./content"
import { revalidatePath } from "next/cache"
import { isVideoUrl } from "@/lib/utils"
import axios from "axios"

export async function AddMediaToProduct(url: string, productId: string) {
    const supabase = createClient()
    const {data: mediaInProduct} = await supabase
        .from('products')
        .select('media')
        .eq('id', productId)
        .single()
    if (mediaInProduct == null) return
    let newMediaArray = mediaInProduct.media || []
    newMediaArray = [...newMediaArray, {
        url: url,
        isVideo: isVideoUrl(url)
    }]
    const {data: updatedMediaInProduct} = await supabase
        .from('products')
        .update({
            media: newMediaArray
        })
        .eq('id', productId)
        .select()
    return newMediaArray
}

export async function RemoveMediaFromProduct(url: string, productId: string) {
    const supabase = createClient()
    const imageKey = url.substring(url.lastIndexOf('/') + 1)
    const {data: mediaInProduct} = await supabase
        .from('products')
        .select('media')
        .eq('id', productId)
        .single()
    if (mediaInProduct == null || mediaInProduct.media == null) return null
    const newMediaArray = mediaInProduct.media.filter((media: {url: string, isVideo: boolean}) => media.url !== url)
    const {data: updatedMediaInProduct} = await supabase
        .from('products')
        .update({
            media: newMediaArray
        })
        .eq('id', productId)
        .select()
    axios.post("/api/uploadthing/delete", {imageKey})
    return newMediaArray
}

const DashboardEditProduct = async ({params} : {params: {shopId: string, productId: string}}) => {
    const supabase = createClient()
    const createNewProduct = params.productId == "new"

    const { data: product } = await supabase
        .from("products")
        .select('*')
        .eq('store_id', params.shopId)
        .eq('id', params.productId)
        .single()
    if (!product && !createNewProduct) redirect(`/dashboard/${params.shopId}/products`)
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', params.shopId)
    const {data: collections} = await supabase
        .from('collections')
        .select('*')
        .eq('store_id', params.shopId)

    return (
        <EditProductContent createNewProduct={createNewProduct} categories={categories} collections={collections} productData={product} params={params} />
    )
}

export default DashboardEditProduct