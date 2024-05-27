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
import { EditCategoryContent } from "./content"
import { revalidatePath } from "next/cache"
import { isVideoUrl } from "@/lib/utils"
import axios from "axios"

const DashboardEditCategory = async ({params} : {params: {shopId: string, categoryId: string}}) => {
    const supabase = createClient()
    const createNewCategory = params.categoryId == "new"

    const { data: category } = await supabase
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