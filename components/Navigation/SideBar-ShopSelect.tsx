import { Button } from "@/components/ui/button";
import Image from 'next/image'
import { ChevronsUpDown, PlusCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
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
import profilePicturePlaceholder from '../../public/profilePicturePlaceholder.png'
import { PopoverClose } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "../ui/input";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormLabel, FormDescription, FormMessage } from "../ui/form";
import {useForm} from 'react-hook-form';
import { createStore } from "@/Actions/store";
import { toast } from "sonner"
import { Separator } from "../ui/separator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const CreateStoreSchema = z.object({
    storeName: z.string().superRefine((val, ctx) => {
        if (val.length < 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 5,
                type: "string",
                inclusive: true,
                message: "Must be 5 or more characters long"
            })
        }

        if (val.length > 255) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                maximum: 255,
                type: "string",
                inclusive: true,
                message: "Must be less than 255 characters"
            })
        }
    })
})


const SideBarShopSelect = () => {
    const supabase = createClient()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(false)
    const [stores, setStores] = useState<any[] | null>()
    const [currentStore, setCurrentStore] = useState<any | null>()

    const form = useForm<z.infer<typeof CreateStoreSchema>>({
        resolver: zodResolver(CreateStoreSchema),
        defaultValues: {
            storeName: ""
        }
    })

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

    function createNewStore(data: z.infer<typeof CreateStoreSchema>) {
        toast("Creating Store", {
            description: "Store Name: " + data.storeName
        })
        createStore(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Popover>
                <PopoverTrigger asChild className="border-default-100">
                    <Button variant="outline" className="w-full mx-2 bg-default-50 h-10 rounded-lg flex justify-center items-center">
                        <Image src={profilePicturePlaceholder} alt="profile picture" className="rounded-lg flex absolute left-7" width={30} height={30} />
                        <h5 className="absolute left-16 w-28 text-center text-ellipsis overflow-hidden">{currentStore?.title}</h5>
                        <ChevronsUpDown className="flex absolute right-6" height="20px" color="#504949" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="xs:hidden sm:w-[100px] sm:block md:w-[210px] bg-default-50 border-default-100">
                    {stores?.filter((store) => store.id != searchParams.get("id")).map((store) => {
                        return (
                            <Button variant="outline" key={store.id} className="w-full bg-default-50 border border-default-100 hover:border-default-200 mb-1" onClick={() => {changeStore(store.id)}}>
                                <Image src={profilePicturePlaceholder} alt="profile picture" className="rounded-lg flex absolute left-7" width={30} height={30} />
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
export default SideBarShopSelect;