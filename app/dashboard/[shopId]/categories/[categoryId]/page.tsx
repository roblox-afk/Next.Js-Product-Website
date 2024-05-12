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
import { EditCategoryContent } from "./content"
import { revalidatePath } from "next/cache"
import { isVideoUrl } from "@/lib/utils"
import axios from "axios"

export const CategorySchema = z.object({
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
    })
})

export async function OnSubmitDashboardCategoryPage(values: z.infer<typeof CategorySchema>, createNewCategory: boolean, params: {shopId: string, categoryId: string}) {
    const supabase = createClient()
    if (createNewCategory) {
        const newCategory = await supabase
    } else {
        const updatedCategory = await supabase
            .from('categories')
            .update({
                title: values.title,
            })
            .eq('id', params.categoryId)
            .select()
    }
    return null
}

const DashboardEditCategory = async ({params} : {params: {shopId: string, categoryId: string}}) => {
    const supabase = createClient()
    const createNewCategory = params.categoryId == "new"

    const { data: category, error } = await supabase
        .from("categories")
        .select('*')
        .eq('store_id', params.shopId)
        .eq('id', params.categoryId)
        .single()
    if (!category && !createNewCategory) redirect(`/dashboard/${params.shopId}/categories`)

    return (
        <EditCategoryContent createNewCategory={createNewCategory} categoryData={category} params={params} />
    )
}

export default DashboardEditCategory