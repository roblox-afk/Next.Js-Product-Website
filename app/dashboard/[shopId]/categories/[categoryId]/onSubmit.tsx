import { createClient } from "@/lib/supabase/client"
import { CategorySchema } from "./page"
import { z } from "zod"

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