"use client"
import { ProductDescription } from "@/components/Tiptap/productDescription"
import { Input } from "@/components/ui/input"
import { Check, ChevronLeft, ChevronsUpDown, XCircleIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { StoreCategory, StoreCollection, StoreProduct } from "@/Actions/store"
import { boolean, z } from "zod"
import { AddBannerToProduct, RemoveBannerFromCategory } from './page';
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UploadButton } from "@/lib/uploadthing"
import { Spinner } from "@nextui-org/react"
import Image from "next/image"
import { cn, getVideoUrlHost, isVideoUrl, makeVideoEmbed } from "@/lib/utils"
import { OnSubmitDashboardCategoryPage } from "./onSubmit"
import { Dialog } from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Suspense, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { ProductSchema } from "@/lib/schema/ProductSchema"
import MultipleSelector, { Option } from "@/components/ui/multi-select"
import { CategorySchema } from "@/lib/schema/CategorySchema"

export const EditCategoryContent = ({
    createNewCategory,
    categoryData,
    params,
}: {
    createNewCategory: boolean,
    categoryData: StoreCategory,
    params: {shopId: string, categoryId: string}
}) => {
    const router = useRouter()
    const [Banner, setBanner] = useState(categoryData?.banner_url == null ? "" : categoryData.banner_url)

    const form = useForm<z.infer<typeof CategorySchema>>({
        resolver: zodResolver(CategorySchema),
        mode: "onChange",
        defaultValues: {
            title: createNewCategory ? "" : categoryData.title,
        }
    })

    function onSubmit(v: z.infer<typeof CategorySchema>) {
        OnSubmitDashboardCategoryPage(v, createNewCategory, createNewCategory ? Banner : "", params)
    }

    return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="mt-14 sm:mt-0 w-[90%] md:w-[75%] px-2 mx-auto h-screen flex flex-row">
                        <div className="w-[68%]">
                            <div className="mt-5 whitespace-nowrap flex text-center">
                                <Button className="border-default-300 hover:bg-default-50" variant="outline" size="icon" type="button" asChild><Link href={"/dashboard/"+params.shopId+"/categories"}><ChevronLeft className="w-4 h-4" /></Link></Button>
                                <h1 className="text-large font-semibold my-auto ml-2">{createNewCategory ? "Add Category" : `Editing: ${categoryData.title}`}</h1>
                            </div>
                            <div className="rounded-lg bg-default-50 border border-default-100 h-auto justify-center content-center mt-10">
                                <div className="m-2">
                                    <h6 className="my-2 text-default-700">Title</h6>
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input className="border-default-300 bg-default-100 mb-4" title="Title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="mt-5 rounded-lg bg-default-50 border border-default-100 h-fit max-h-96 flex-col">
                                <h6 className="m-2 text-default-700">Banner</h6>
                                {Banner == "" ?
                                <div className="m-2 h-full border border-default-300 border-dashed rounded-lg flex justify-center content-center">
                                    <div className="my-16">
                                        <UploadButton
                                            endpoint="imageUploader"
                                            content={{
                                                button({ ready }: { ready: boolean}) {
                                                    if (ready) return "Upload New"
                                                    return <Spinner />
                                                }
                                            }}
                                            appearance={{
                                                button: {
                                                    height: 38,
                                                    width: 108,
                                                    background: "transparent",
                                                    borderColor: "#27272a",
                                                    borderWidth: "1px",
                                                    fontWeight: "600",
                                                    fontSize: "13px",
                                                },
                                                allowedContent: {
                                                    width: "0px",
                                                    height: "0px",
                                                    visibility: "hidden"
                                                },
                                            }}
                                            onClientUploadComplete={(res) => {
                                                if (!createNewCategory) AddBannerToProduct(res[0].url, params.categoryId)
                                                console.log(res)
                                                setBanner(res[0].url)
                                                console.log(Banner)
                                            }}
                                        />
                                    </div>
                                </div>:
                                <div className="mx-2 mb-2 h-auto max-h-80 flex gap-2 flex-wrap flex-shrink">
                                    <div className="group relative h-32 w-48 object-cover overflow-hidden rounded-lg border border-default-100">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="flex relative float-right top-0 z-0 group-[:hover]:z-10"
                                            onClick={() => {
                                                if(!createNewCategory) RemoveBannerFromCategory(Banner, params.categoryId)
                                                setBanner("")
                                            }}>
                                            <XIcon className="z-10" height={24} width={24} />
                                        </Button>
                                        <Image src={Banner} alt="test" fill />
                                    </div>
                                </div>}
                            </div>
                            <div className="my-4">
                                <Button type="submit" variant="outline" className="bg-default-50 hover:bg-default-100 border-default-100 float-right">{createNewCategory ? "Create" : "Save"}</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
    )
}