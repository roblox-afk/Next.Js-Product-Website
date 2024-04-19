import { Button } from "@/components/ui/button";
import Image from 'next/image'
import Link from "next/link";
import { ChevronsUpDown } from "lucide-react"
import { error } from "console";
import { ReadonlyURLSearchParams, redirect, RedirectType, usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import profilePicturePlaceholder from '../../public/profilePicturePlaceholder.png'
import { PopoverClose } from "@radix-ui/react-popover";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormLabel, FormDescription, FormMessage } from "../ui/form";

const FormSchema = z.object({
    storeName: z.string().min(5)
})


const SideBarShopSelect = () => {
    const supabase = createClient()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [title, setTitle] = useState()
    const [stores, setStores] = useState<any[] | null>()
    const [currentStore, setCurrentStore] = useState<any | null>()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            storeName: "",
        },
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

    function createNewStore(data: z.infer<typeof FormSchema>) {
        console.log(data)
    }

    return (
        <Dialog>
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
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="w-full bg-default-100 border border-default-100 hover:border-default-200">
                                <Image src={profilePicturePlaceholder} alt="profile picture" className="rounded-lg flex absolute left-7" width={30} height={30} />
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
                                                className="col-span-3 w-[2/4] border-neutral-600 text-neutral-500 font-semibold"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="font-semibold" />
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