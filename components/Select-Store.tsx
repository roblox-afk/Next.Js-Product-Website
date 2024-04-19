import NavBar from "./Navigation/NavBar";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import StoreCard from './Cards/StoreCard';
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { CreateStoreSchema } from "./Navigation/SideBar-ShopSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createStore } from "@/Actions/store";
import { toast } from "sonner";

export function SelectStore() {
    const supabase = createClient()
    const router = useRouter()
    const [stores, setStores] = useState<any[] | null>()
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof CreateStoreSchema>>({
        resolver: zodResolver(CreateStoreSchema),
        defaultValues: {
            storeName: ""
        }
    })

    useEffect(() => {
        async function fetchStores() {
            let { data: stores, error } = await supabase
                .from('stores')
                .select('*')
            setStores(stores)
        }
        fetchStores()
    }, [supabase])

    function createNewStore(data: z.infer<typeof CreateStoreSchema>) {
        toast("Creating Store", {
            description: "Store Name: " + data.storeName
        })
        createStore(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
            <DialogContent className="sm:max-w-[425px] border-neutral-600">
                <DialogHeader>
                    <DialogTitle className="text-neutral-200">Create New Store!</DialogTitle>
                    <DialogDescription className="text-neutral-300">
                        Create a new store for your business in only 3 steps.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(createNewStore)} className="">
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="storeName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name of Store</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="name"
                                                    title="Name of Store"
                                                    placeholder="Fancy Shopping Inc."
                                                    className="col-span-3 w-[2/4] border-neutral-600 text-neutral-500 font-semibold focus-visible:ring-0 focus-visible:border-2"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="font-semibold text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className="">
                            <Button type="submit" className="bg-transparet hover:bg-default-100 border border-default-100">Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}