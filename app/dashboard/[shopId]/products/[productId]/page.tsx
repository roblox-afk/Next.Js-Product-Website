import {Divider, ScrollShadow} from "@nextui-org/react"
import { createClient } from "@/lib/supabase/server"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog } from "@/components/ui/dialog"
import NewProductContent from "@/components/Cards/NewProductContent"
import DialogSetup from "@/components/DialogSetup"
import { Drawer } from "@/components/ui/drawer"
import { ProductDescription } from "@/components/Tiptap/productDescription"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const DashboardEditProduct = async ({params} : {params: {shopId: string, productId: string}}) => {
    const supabase = createClient()
    let data = {}
    const { data: product, error } = await supabase
        .from("products")
        .select('*')
        .eq('store_id', params.shopId)
        .eq('id', params.productId)
        .single()

    // TODO: Add Zod and Form functionality

    return (
        <div className="px-2 mx-[377px] w-1/2 h-screen flex flex-row">
            <div className=" w-[68%]">
                <div className="mt-5 whitespace-nowrap">
                    <Button className="border-default-300" variant="outline" size="icon"><ChevronLeft className="w-4 h-4" /></Button>
                    <h1 className="text-large font-semibold">Editing: {product.title}</h1>
                </div>
                <div className="rounded-lg bg-default-100 h-auto justify-center content-center mt-10">
                    <div className="m-2">
                        <h6 className="my-2 text-default-700">Title</h6>
                        <Input className="border-default-300 bg-default-100 mb-4" title="Title" />
                        <h6 className="mb-2 text-default-700">Description</h6>
                        <ProductDescription />
                    </div>
                </div>
            </div>
            <div className="ml-5 w-[30%]"></div>
        </div>
    )
}

export default DashboardEditProduct