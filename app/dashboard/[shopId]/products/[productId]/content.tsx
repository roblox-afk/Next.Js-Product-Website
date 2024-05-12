"use client"
import { ProductDescription } from "@/components/Tiptap/productDescription"
import { Input } from "@/components/ui/input"
import { ChevronLeft, XCircleIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { StoreProduct } from "@/Actions/store"
import { boolean, z } from "zod"
import { AddMediaToProduct, ProductSchema, RemoveMediaFromProduct } from './page';
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UploadButton } from "@/lib/uploadthing"
import { Spinner } from "@nextui-org/react"
import Image from "next/image"
import { isVideoUrl } from "@/lib/utils"
import { OnSubmitDashboardProductPage } from "./onSubmit"

export const EditProductContent = ({
    createNewProduct,
    productData,
    params,
}: {
    createNewProduct: boolean,
    productData: StoreProduct,
    params: {shopId: string, productId: string}
}) => {
    const router = useRouter()
    let Media = productData.media

    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        mode: "onChange",
        defaultValues: {
            title: createNewProduct ? "" : productData.title,
            description: createNewProduct ? "" : productData.description,
            price: createNewProduct ? "0" : productData.price.toString(),
            category: createNewProduct ? "" : productData.category == null ? "" : productData.category,
            isFeatured: createNewProduct ? false : productData.isFeatured,
        }
    })

    // TODO: Fix bug where Media doesn't show after added and not removed after remove

    function onSubmit(v: z.infer<typeof ProductSchema>) {
        const result = OnSubmitDashboardProductPage(v, createNewProduct, params)
        router.push(`/dashboard/${params.shopId}/products`)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="px-2 mx-auto w-1/2 h-screen flex flex-row">
                    <div className="w-[68%]">
                        <div className="mt-5 whitespace-nowrap flex text-center">
                            <Button className="border-default-300 hover:bg-default-50" variant="outline" size="icon" type="button" asChild><Link href={"/dashboard/"+params.shopId+"/products"}><ChevronLeft className="w-4 h-4" /></Link></Button>
                            <h1 className="text-large font-semibold my-auto ml-2">{createNewProduct ? "Add Product" : `Editing: ${productData.title}`}</h1>
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
                                <h6 className="mb-2 text-default-700">Description</h6>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ProductDescription description={field.value} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="mt-5 rounded-lg bg-default-50 border border-default-100 h-auto flex-col">
                            <h6 className="m-2 text-default-700">Media</h6>
                            {Media == null || Media != null && Media.length < 1 ?
                            <div className="m-2 h-full border border-default-300 border-dashed rounded-lg flex justify-center content-center group-has-[<Image />]:h-32 group-has-[<Image />]:w-32">
                                <div className="my-16">
                                    <UploadButton
                                        endpoint="productImagesUploader"
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
                                            res.map((media) => {
                                                AddMediaToProduct(media.url, params.productId)
                                                let newMediaArray = Media
                                                if (Media == null) {
                                                    newMediaArray = [{
                                                        url: media.url,
                                                        isVideo: isVideoUrl(media.url)
                                                    }]
                                                } else {
                                                    Media.push({
                                                        url: media.url,
                                                        isVideo: isVideoUrl(media.url)
                                                    })
                                                }
                                                Media = newMediaArray
                                        })
                                        }}
                                    />
                                    <Button type="button" variant="link" className="text-default-600">Add from URL</Button>
                                </div>
                            </div>:
                            <div className="mx-2 mb-2">
                                {Media != null && Media.map((media) => (
                                    <div key={media.url} className="group relative h-32 max-w-48 object-cover overflow-hidden rounded-lg  border border-default-100">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="flex relative float-right top-0 z-0 group-[:hover]:z-10"
                                            onClick={() => {
                                                RemoveMediaFromProduct(media.url, params.productId)
                                                if (Media == null) return
                                                let newMediaArray: any = Media.filter((v: {url: string, isVideo: boolean}) => v.url !== media.url)
                                                if (JSON.stringify(newMediaArray) == "[]") newMediaArray = null
                                                Media = newMediaArray
                                            }}>
                                            <XIcon className="z-10" height={24} width={24} />
                                        </Button>
                                        <Image src={media.url} alt="test" fill />
                                    </div>
                                ))}
                            </div>}
                        </div>
                    </div>
                    <div className="ml-5 w-[30%]">
                        <div className="rounded-lg bg-default-50 h-20 mt-[100px] shadow-lg border border-default-100 flex flex-cols">
                            <div className="m-2">
                                <h6 className="my-2 text-default-700">Status</h6>
                            </div>
                        </div>
                        <div className="my-4">
                            <Button type="submit" variant="outline" className="bg-default-50 hover:bg-default-100 border-default-100 float-right">{createNewProduct ? "Create" : "Save"}</Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}