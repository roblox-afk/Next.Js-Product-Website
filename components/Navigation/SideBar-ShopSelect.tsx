import { Button } from "@/components/ui/button";
import Image from 'next/image'
import { ChevronsUpDown, CircleCheck, PlusCircle, TriangleAlert } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"
import profilePicturePlaceholder from '../../public/profilePicturePlaceholder.png'
import { PopoverClose } from "@radix-ui/react-popover";
import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod"
import { Separator } from "../ui/separator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CreateStoreContent from "../Cards/CreateStoreContent";
import { Skeleton } from "@/components/ui/skeleton";


const SideBarShopSelect = ({shopId} : {shopId: string}) => {
    const supabase = createClient()
    const router = useRouter()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [stores, setStores] = useState<any[] | null>()
    const [currentStore, setCurrentStore] = useState<any | null>()

    useEffect(() => {
        async function hasAccess() {
            const userId = (await supabase.auth.getUser()).data.user?.id
            let access = false
            let { data: storeIds, error } = await supabase
                .from('stores')
                .select('id')
                .eq('user_id', userId)

            if (storeIds == null) return null

            storeIds?.forEach(x => {
                if (x.id == shopId) access = true
            });

            if (access == false) {
                router.push("/dashboard")
            }
            return access
        }
        async function getStores() {
            const userId = (await supabase.auth.getUser()).data.user?.id
            let { data: stores } = await supabase
                .from('stores')
                .select('*')
                .eq('user_id', userId)
            setStores(stores)

            let { data: storeCurrent } = await supabase
                .from('stores')
                .select('*')
                .eq('id', shopId)
                .eq('user_id', userId)
                .single()
            setCurrentStore(storeCurrent)
        }
        hasAccess()
        getStores()
    }, [supabase, router, shopId])

    function changeStore(id: string) {
        const pathAfterId = pathname.replace(`/dashboard/${shopId}`, "")
        console.log(pathAfterId)
        router.push(`/dashboard/${id}${pathAfterId}`)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Popover>
                {currentStore != null ?
                    <PopoverTrigger asChild className="border-default-100">
                        <Button variant="outline" className="w-full mx-2 bg-default-50 h-10 rounded-lg flex justify-center items-center">
                                    <Image src={currentStore.logoUrl} alt="profile picture" className="rounded-lg flex absolute left-7" width={30} height={30} />
                                    <h5 className="absolute left-16 w-28 text-center text-ellipsis overflow-hidden indent-[-99999px] md:indent-0">{currentStore.title}</h5>
                                    <ChevronsUpDown className="flex absolute right-5 md:right-6" height="20px" color="#504949" />
                        </Button>
                    </PopoverTrigger> :
                    <>
                        <Skeleton className="w-full mx-2 bg-default-50 h-10 rounded-lg flex justify-center items-center">
                            <Skeleton className="rounded-lg flex absolute left-7 w-[30px] h-[30px] bg-default-100" />
                            <Skeleton className="absolute left-16 w-32 mb-2 overflow-hidden bg-default-100 h-2" />
                            <Skeleton className="absolute left-16 w-24 mt-4 overflow-hidden bg-default-100 h-2" />
                        </Skeleton>
                    </>
                }
                <PopoverContent className="xs:hidden sm:w-[100px] sm:block md:w-[210px] bg-default-50 border-default-100">
                    <Button variant="outline" key={currentStore?.id} className="w-full bg-default-100 border border-default-100 hover:border-default-100 mb-1">
                        <Image src={currentStore?.logoUrl} alt="profile picture" className="rounded-lg flex absolute left-7" width={30} height={30} />
                        <h5 className="aboslute ml-8 text-ellipsis overflow-hidden">{currentStore?.title}</h5>
                    </Button>
                    {stores?.filter((store) => store.id != shopId).map((store) => {
                        return (
                            <Button variant="outline" key={store.id} className="w-full bg-default-50 border border-default-100 hover:border-default-200 mb-1" onClick={() => {changeStore(store.id)}}>
                                <Image src={store.logoUrl} alt="profile picture" className="rounded-lg flex absolute left-7" width={30} height={30} />
                                <h5 className="aboslute ml-8 text-ellipsis overflow-hidden">{store.title}</h5>
                            </Button>
                        )
                    })}
                    <Separator className="my-2 bg-neutral-700" />
                    <PopoverClose asChild>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full bg-default-50 border-default-100 text-default-500 hover:text-default-800">
                                <PlusCircle className="mr-2" />
                                Create New
                            </Button>
                        </DialogTrigger>
                    </PopoverClose>
                </PopoverContent>
            </Popover>


            <CreateStoreContent setOpen={setOpen} />
        </Dialog>
    )
}

export default SideBarShopSelect;