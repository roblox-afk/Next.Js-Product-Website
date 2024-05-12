"use client"
import { ProductDescription } from "@/components/Tiptap/productDescription"
import { Input } from "@/components/ui/input"
import { ChevronLeft, XCircleIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { StoreCategory } from "@/Actions/store"
import { boolean, z } from "zod"
import { CategorySchema } from './page';
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UploadButton } from "@/lib/uploadthing"
import { Spinner } from "@nextui-org/react"
import Image from "next/image"
import { isVideoUrl } from "@/lib/utils"
import { OnSubmitDashboardCategoryPage } from "./onSubmit"

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

    const form = useForm<z.infer<typeof CategorySchema>>({
        resolver: zodResolver(CategorySchema),
        mode: "onChange",
        defaultValues: {
            title: createNewCategory ? "" : categoryData.title,
        }
    })

    // TODO: Fix bug where Media doesn't show after added and not removed after remove

    function onSubmit(v: z.infer<typeof CategorySchema>) {
        const result = OnSubmitDashboardCategoryPage(v, createNewCategory, params)
        router.push(`/dashboard/${params.shopId}/categories`)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="px-2 mx-auto w-1/2 h-screen flex flex-row">
                    <div className="w-[68%]">
                        <div className="mt-5 whitespace-nowrap flex text-center">
                            <Button className="border-default-300 hover:bg-default-50" variant="outline" size="icon" type="button" asChild><Link href={"/dashboard/"+params.shopId+"/products"}><ChevronLeft className="w-4 h-4" /></Link></Button>
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
                    </div>
                    <div className="ml-5 w-[30%]">
                        <div className="my-48">
                            <Button type="submit" variant="outline" className="bg-default-50 hover:bg-default-100 border-default-100 float-right">{createNewCategory ? "Create" : "Save"}</Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}