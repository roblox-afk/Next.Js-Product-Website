import { Button } from "@/components/ui/button";
import Image from 'next/image'
import Link from "next/link";
import { ChevronsUpDown } from "lucide-react"
import { error } from "console";
import { ReadonlyURLSearchParams, redirect, RedirectType, usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import profilePicturePlaceholder from '../../public/profilePicturePlaceholder.png'
import { PopoverClose } from "@radix-ui/react-popover";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";


const SideBarShopSelect = () => {
    const supabase = createClient()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [stores, setStores] = useState<any[] | null>()
    const [currentStore, setCurrentStore] = useState<any | null>()

    useEffect(() => {
        async function hasAccess() {
            const searchParamId = searchParams.get("id")
            let access = false
            let { data: storeIds, error } = await supabase
                .from('stores')
                .select('id')

            if (searchParamId == null) return null

            storeIds?.forEach(x => {
                if (x.id == searchParamId) access = true
            });

            if (access == false) {
                "use server"
                router.push("/dashboard")
            }
            return access
        }
        async function getStores() {
            const searchParamId = searchParams.get("id")
            let access = false
            let { data: stores } = await supabase
                .from('stores')
                .select('*')
            setStores(stores)

            let { data: storeCurrent } = await supabase
                .from('stores')
                .select('*')
                .eq('id', searchParamId)
                .maybeSingle()
            setCurrentStore(storeCurrent)
        }
        hasAccess()
        getStores()
    }, [pathname, supabase, searchParams, router])

    function changeStore(id: string) {
        // TODO: Add safety to make sure store exsist's
        // TODO: Add safety to make sure user has access to store
        console.log("changeStore: Debug")
        const params = new URLSearchParams(searchParams.toString())
        params.set("id", id)
        router.push(pathname + '?' + params.toString())
    }

    return (
        <Popover>
            <PopoverTrigger asChild className="border-default-100">
                <Button variant="outline" className="w-full mx-2 bg-default-50 h-10 rounded-lg flex justify-center items-center">
                    <Image src={profilePicturePlaceholder} alt="profile picture" className="rounded-lg flex absolute left-7" width={30} height={30} />
                    <h5 className="flex absolute left-16 w-28 text-center">{currentStore?.title}</h5>
                    <ChevronsUpDown className="flex absolute right-6" height="20px" color="#504949" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="xs:hidden sm:w-[100px] sm:block md:w-[224px] bg-default-50 border-default-100">
                <Button variant="ghost" className="w-full bg-default-100 border border-default-100 hover:border-default-200" onClick={() => {changeStore("test")}}>
                    <Image src={profilePicturePlaceholder} alt="profile picture" className="rounded-lg flex absolute left-7" width={30} height={30} />
                    <h5 className="flex absolute left-9">TwentyCharactersOnly</h5>
                </Button>
                <PopoverClose asChild>
                    <Button variant="ghost" className="w-full bg-default-100 border border-default-100 hover:border-default-200">
                        <Image src={profilePicturePlaceholder} alt="profile picture" className="rounded-lg flex absolute left-7" width={30} height={30} />
                    </Button>
                </PopoverClose>
            </PopoverContent>
        </Popover>
    )
}
export default SideBarShopSelect;