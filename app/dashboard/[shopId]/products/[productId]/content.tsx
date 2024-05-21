"use client"
import { ProductDescription } from "@/components/Tiptap/productDescription"
import { Input } from "@/components/ui/input"
import { Check, ChevronLeft, ChevronsUpDown, XCircleIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { StoreCategory, StoreProduct } from "@/Actions/store"
import { boolean, z } from "zod"
import { AddMediaToProduct, RemoveMediaFromProduct } from './page';
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UploadButton } from "@/lib/uploadthing"
import { Spinner } from "@nextui-org/react"
import Image from "next/image"
import { cn, getVideoUrlHost, isVideoUrl, makeVideoEmbed } from "@/lib/utils"
import { OnSubmitDashboardProductPage } from "./onSubmit"
import { Dialog } from "@/components/ui/dialog"
import AddMediaFromUrlContent from "@/components/Cards/AddMediaFromUrl"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Suspense, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { ProductSchema } from "@/lib/schema/ProductSchema"

export const EditProductContent = ({
    createNewProduct,
    categories,
    productData,
    params,
}: {
    createNewProduct: boolean,
    categories: StoreCategory[] | null,
    productData: StoreProduct,
    params: {shopId: string, productId: string}
}) => {
    const router = useRouter()
    const [Media, setMedia] = useState(productData?.media == null ? [] : productData.media)

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

    // TODO: Fix placement of video in media display

    function onSubmit(v: z.infer<typeof ProductSchema>) {
        const result = OnSubmitDashboardProductPage(v, createNewProduct, productData, createNewProduct ? Media : [])
    }

    return (
        <Dialog>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="mt-14 sm:mt-0 w-[90%] md:w-[75%] px-2 mx-auto h-screen flex flex-row">
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
                            <div className="rounded-lg bg-default-50 border border-default-100 h-auto justify-center content-center mt-5">
                                <div className="m-2">
                                    <h6 className="my-2 text-default-700">Price</h6>
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input className="border-default-300 bg-default-100 mb-4" title="Price" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="mt-5 rounded-lg bg-default-50 border border-default-100 h-fit max-h-96 flex-col">
                                <h6 className="m-2 text-default-700">Media</h6>
                                {Media.length < 1 ?
                                <div className="m-2 h-full border border-default-300 border-dashed rounded-lg flex justify-center content-center">
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
                                                    if (!createNewProduct) AddMediaToProduct(media.url, params.productId)
                                                    setMedia([
                                                        ...Media,
                                                        {
                                                            url: media.url,
                                                            isVideo: isVideoUrl(media.url)
                                                        }
                                                    ])
                                            })
                                            }}
                                        />
                                        <DialogTrigger>
                                            <Button type="button" variant="link" className="text-default-600">Add from URL</Button>
                                        </DialogTrigger>
                                    </div>
                                </div>:
                                <div className="mx-2 mb-2 h-auto max-h-80 flex gap-2 flex-wrap flex-shrink">
                                    {Media.map(media => (
                                        <div key={media.url} className="group relative h-32 w-48 object-cover overflow-hidden rounded-lg border border-default-100">
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className="flex relative float-right top-0 z-0 group-[:hover]:z-10"
                                                onClick={() => {
                                                    if(!createNewProduct) RemoveMediaFromProduct(media.url, params.productId)
                                                    if (Media == null) return
                                                    setMedia(Media.filter((v: {url: string, isVideo: boolean}) => v.url !== media.url))
                                                }}>
                                                <XIcon className="z-10" height={24} width={24} />
                                            </Button>
                                            {media.isVideo == false ? (
                                                <Image src={media.url} alt="test" fill />
                                            ): (
                                                <Suspense fallback={<Spinner />}>
                                                    <iframe src={makeVideoEmbed(media.url, getVideoUrlHost(media.url)) || ""} allowFullScreen className="w-full h-full" />
                                                </Suspense>
                                            )}
                                        </div>
                                    ))}
                                    <div className="h-32 w-32 border border-default-300 border-dashed rounded-lg justify-center content-center">
                                        <div className="my-auto">
                                            <UploadButton
                                                endpoint="productImagesUploader"
                                                content={{
                                                    button({ ready }: { ready: boolean}) {
                                                        if (ready) return "Add"
                                                        return <Spinner />
                                                    }
                                                }}
                                                appearance={{
                                                    button: {
                                                        height: 38,
                                                        width: 54,
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
                                                        setMedia([
                                                            ...Media,
                                                            {
                                                                url: media.url,
                                                                isVideo: isVideoUrl(media.url)
                                                            }
                                                        ])
                                                })
                                                }}
                                            />
                                            <div className="w-full flex justify-center">
                                                <DialogTrigger asChild>
                                                    <Button type="button" variant="link" className="text-default-600">From Url</Button>
                                                </DialogTrigger>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <div className="ml-5 w-[30%]">
                            <div className="rounded-lg bg-default-50 h-20 mt-[100px] shadow-lg border border-default-100 flex flex-cols">
                                <div className="m-2">
                                    <h6 className="my-2 text-default-700">Status</h6>
                                    <FormField
                                        control={form.control}
                                        name="isFeatured"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant="outline" role="combobox" className={cn(
                                                                "w-[200px] justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}>
                                                                {field.value
                                                                    ? "Active" : "Draft"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[200px] p-0">
                                                        <Command>
                                                            <CommandEmpty>No Status found.</CommandEmpty>
                                                            <CommandList>
                                                                <CommandItem value="true" key="Active" onSelect={() => {form.setValue("isFeatured", true)}}>
                                                                    <Check
                                                                        className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value === true
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                        )}
                                                                    />
                                                                    Active
                                                                </CommandItem>
                                                                <CommandItem value="false" key="Draft" onSelect={() => {form.setValue("isFeatured", false)}}>
                                                                    <Check
                                                                        className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value === false
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                        )}
                                                                    />
                                                                    Draft
                                                                </CommandItem>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="rounded-lg bg-default-50 h-20 mt-[100px] shadow-lg border border-default-100 flex flex-cols">
                                <div className="m-2">
                                    <h6 className="my-2 text-default-700">Category</h6>
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant="outline" role="combobox" className={cn(
                                                                "w-[200px] justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}>
                                                                {categories?.find((x) => x.id == field.value)?.title}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[200px] p-0 bg-default-50">
                                                        <Command>
                                                            <CommandEmpty>No Category found.</CommandEmpty>
                                                            <CommandList>
                                                                {categories?.map((category) => (
                                                                    <CommandItem value={category.id} key={category.id} onSelect={() => {form.setValue("category", category.id)}} className="group">
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                "group-[hover:]:opacity-50",
                                                                                field.value === category.id
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    {category.title}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="my-4">
                                <Button type="submit" variant="outline" className="bg-default-50 hover:bg-default-100 border-default-100 float-right">{createNewProduct ? "Create" : "Save"}</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
            <AddMediaFromUrlContent type="Product" itemid={params.productId}  />
        </Dialog>
    )
}