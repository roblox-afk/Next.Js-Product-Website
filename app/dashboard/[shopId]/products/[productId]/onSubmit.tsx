import { createClient } from "@/lib/supabase/client"
import { ProductSchema } from "./page"
import { z } from "zod"

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