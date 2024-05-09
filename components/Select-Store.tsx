"use client"
import NavBar from "./Navigation/NavBar";
import {
    Dialog
} from "@/components/ui/dialog"
import StoreCard from './Cards/StoreCard';
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import CreateStoreContent from "./Cards/CreateStoreContent";

export function SelectStore() {
    const supabase = createClient()
    const [stores, setStores] = useState<any[] | null>()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        async function fetchStores() {
            const userId = (await supabase.auth.getUser()).data.user?.id
            let { data: stores, error } = await supabase
                .from('stores')
                .select('*')
                .eq('user_id', userId)
            setStores(stores)
        }
        fetchStores()
    }, [supabase])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <NavBar loggedIn={true} />
            <div className="w-full h-[100%] mt-20">
                <h1 className="font-bold ml-12 size-40 text-2xl h-10">Select store</h1>
                <div className="my-10 mx-20 grid grid-flow-col auto-cols-max gap-10">
                    {stores?.map(function(data) {
                        return (
                            <StoreCard key={data.title} title={data.title} id={data.id} logo={data.logoUrl} isCreateNew={false} />
                        )
                    })}
                    <StoreCard key="createNew" title="createNew" id="createNew" logo="" isCreateNew={true} />
                </div>
            </div>
            <CreateStoreContent setOpen={setOpen} />
        </Dialog>
    )
}