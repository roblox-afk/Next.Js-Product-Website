import NavBar from "./Navigation/NavBar";
import { Button } from "./ui/button";
import StoreCard from './Cards/StoreCard';
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { set } from "zod";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export function SelectStore() {   
    const supabase = createClient()
    const router = useRouter()
    const [stores, setStores] = useState<any[] | null>()

    useEffect(() => {
        async function fetchStores() {
            let { data: stores, error } = await supabase
                .from('stores')
                .select('*')
            setStores(stores)
        }
        fetchStores()
    }, [supabase])

    return (
        <>
            <NavBar loggedIn={true} />
            <div className="w-full h-[100%] mt-20">
                <h1 className="font-bold ml-12 size-40 text-2xl h-10">Select store</h1>
                <div className="my-10 mx-20 grid grid-flow-col auto-cols-max gap-10">
                    {stores?.map(function(data) {
                        return (
                            <StoreCard key={data.title} title={data.title} id={data.id} logo="" isCreateNew={false} />
                        )
                    })}
                    <StoreCard key="createNew" title="createNew" id="createNew" logo="" isCreateNew={true} />
                </div>
            </div>
        </>
    )
}