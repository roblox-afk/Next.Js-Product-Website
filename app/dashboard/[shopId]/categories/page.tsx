import {Button, Divider, ScrollShadow} from "@nextui-org/react"
import { DataTable } from "./date-table"
import { columns } from "./columns"
import { createClient } from "@/lib/supabase/server"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog } from "@/components/ui/dialog"
import NewCategoryContent from "@/components/Cards/NewCategoryContent"

const DashboardCategories = async ({params} : {params: {shopId: string}}) => {
    const supabase = createClient()
    const { data: categories, error } = await supabase
        .from("categories")
        .select('*')
        .eq('store_id', params.shopId)

    return (
        <Dialog>
            <div className="flex flex-col w-1/2 mx-20 py-10">
                <h1 className="text-4xl pb-7">Categories</h1>
                {categories != null ?
                    <DataTable columns={columns} data={categories} /> :
                    <>
                        <Skeleton className="" />
                    </>
                }
            </div>
            <NewCategoryContent shopId={params.shopId} />
        </Dialog>
    )
}

export default DashboardCategories