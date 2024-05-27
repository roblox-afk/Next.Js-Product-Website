import {Button, Divider, ScrollShadow} from "@nextui-org/react"
import { DataTable } from "./date-table"
import { columns } from "./columns"
import { createClient } from "@/lib/supabase/server"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog } from "@/components/ui/dialog"
import DialogSetup from "@/components/DialogSetup"
import { Drawer } from "@/components/ui/drawer"

const DashboardCollections = async ({params} : {params: {shopId: string}}) => {
    const supabase = createClient()
    const { data: collections, error } = await supabase
        .from("collections")
        .select('*')
        .eq('store_id', params.shopId)

    return (
        <Dialog>
            <div className="flex flex-col w-3/4 mx-20 py-10">
                <h1 className="text-4xl pb-7">Collections</h1>
                {collections != null ?
                    <DataTable columns={columns} data={collections} /> :
                    <>
                        <Skeleton className="" />
                    </>
                }
            </div>
        </Dialog>
    )
}

export default DashboardCollections