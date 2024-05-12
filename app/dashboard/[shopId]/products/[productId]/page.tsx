import {Divider, ScrollShadow} from "@nextui-org/react"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog } from "@/components/ui/dialog"
import NewProductContent from "@/components/Cards/NewProductContent"
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

export const ProductSchema = z.object({
    title: z.string().superRefine((val, ctx) => {
        if (val.length < 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 5,
                type: "string",
                inclusive: true,
                message: "Must be 5 or more characters long"
            })
        }

        if (val.length > 255) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                maximum: 255,
                type: "string",
                inclusive: true,
                message: "Must be less than 255 characters"
            })
        }
    }),
    description: z.string().min(5, {"message": "Too short of a description. Minimum 5 characters."}),
    price: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string"
    }),
    category: z.string(),
    isFeatured: z.boolean()
})

export async function AddMediaToProduct(url: string, productId: string) {
    if (!url) return
    const supabase = createClient()
    let newMediaArray
    const {data: mediaInProduct} = await supabase
        .from('products')
        .select('media')
        .eq('id', productId)
        .single()
    if (mediaInProduct == null) return
    if (mediaInProduct.media == null) {
        newMediaArray = [{
            url: url,
            isVideo: isVideoUrl(url)
        }]
    } else {
        mediaInProduct.media.push({
            url: url,
            isVideo: isVideoUrl(url)
        })
    }
    console.log(newMediaArray)
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
    let newMediaArray = mediaInProduct.media.filter((media: {url: string, isVideo: boolean}) => media.url !== url)
    console.log(newMediaArray)
    if (JSON.stringify(newMediaArray) == "[]") newMediaArray = null
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

export async function OnSubmitDashboardProductPage(values: z.infer<typeof ProductSchema>, createNewProduct: boolean, params: {shopId: string, productId: string}) {
    const supabase = createClient()
    if (createNewProduct) {
        const newProduct = await supabase
    } else {
        const updatedProduct = await supabase
            .from('products')
            .update({
                title: values.title,
                description: values.description,
                //price: values.price,
                //category: values.category,
                //isFeatured: values.isFeatured,
            })
            .eq('id', params.productId)
            .select()
    }
    return null
}

const DashboardEditProduct = async ({params} : {params: {shopId: string, productId: string}}) => {
    const supabase = createClient()
    const createNewProduct = params.productId == "new"

    const { data: product, error } = await supabase
        .from("products")
        .select('*')
        .eq('store_id', params.shopId)
        .eq('id', params.productId)
        .single()
    if (!product && !createNewProduct) redirect(`/dashboard/${params.shopId}/products`)

    return (
        <EditProductContent createNewProduct={createNewProduct} productData={product} params={params} />
    )
}

export default DashboardEditProduct