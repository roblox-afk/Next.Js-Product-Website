import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from "../ui/form";
import { Button } from '../ui/button';
import { CircleCheck, Loader2, TriangleAlert, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createStore } from '@/Actions/store';
import { Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { UploadDropzone } from '@/lib/uploadthing';
import Image from 'next/image';
import axios from "axios"

export const CreateStoreSchema = z.object({
    storeLogo: z.string(),
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
    }),
    storeSlug: z.string().superRefine((val, ctx) => {
        if (val.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 3,
                type: "string",
                inclusive: true,
                message: "Must be 3 or more characters long"
            })
        }

        if (val.length > 120) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                maximum: 120,
                type: "string",
                inclusive: true,
                message: "Must be less than 120 characters"
            })
        }
    })
})

const CreateStoreContent = ({setOpen} : {setOpen: Dispatch<SetStateAction<boolean>> }) => {
    const router = useRouter()
    const [slug, setSlug] = useState("fancyshopping")
    const [logo, setLogo] = useState("")
    const [logoIsDeleting, setLogoIsDeleting] = useState(false)

    const form = useForm<z.infer<typeof CreateStoreSchema>>({
        resolver: zodResolver(CreateStoreSchema),
        defaultValues: {
            storeName: "",
            storeSlug: "",
            storeLogo: ""
        }
    })

    function handleLogoDelete(image: string) {
        setLogoIsDeleting(true)
        const imageKey = image.substring(image.lastIndexOf('/') + 1)

        axios.post("/api/uploadthing/delete", {imageKey}).then((res) => {
            if(res.data.success) {
                setLogo("")
                toast("Deleted Logo", {
                    description: "The logo that you submited has been deleted"
                })
            }
        }).catch(() => {
            toast("Failed: Deleting logo", {
                description: "There has been an error while deleting your logo"
            })
        }).finally(() => {
            setLogoIsDeleting(false)
        })
    }

    function createNewStore(data: z.infer<typeof CreateStoreSchema>) {
        const formData = data
        if (logo.length < 1) {
            return form.setError("storeLogo", { type: "custom", message: "A logo is required." })
        }
        formData.storeLogo = logo
        if (createStore(formData) == null) {
            toast("Unable to create store", {
                icon: <TriangleAlert fill="#ec9909" strokeWidth={2} absoluteStrokeWidth stroke="#ffffff" className="group-data-[type=warning]" />,
                description: "There seems to be a store with that slug!",
            })
        } else {
            toast("Store created", {
                icon: <CircleCheck fill="#6fec09" strokeWidth={2} absoluteStrokeWidth stroke="#ffffff" className="group-data-[type=success]" />,
                description: "Your store was created with no problems",
            })
        }
        setOpen(false)
        form.reset()
    }

    return (
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
                                name="storeLogo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl className=''>
                                            {logo ?
                                            <>
                                                <Button onClick={() => handleLogoDelete(logo)} className='relative top-0 right-[-12px]' type='button' variant="ghost" size="icon">{logoIsDeleting ? <Loader2 /> : <XCircle /> }</Button>
                                                <Image src={logo} alt="logo of store" width={75} height={75} />
                                            </> :
                                            <>
                                                <UploadDropzone
                                                    endpoint='imageUploader'
                                                    onClientUploadComplete={(res) => {
                                                        setLogo(res[0].url)
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast("Eror while uploading file", {
                                                            description: error.message
                                                        })
                                                    }}
                                                />
                                            </>
                                            }
                                        </FormControl>
                                        <FormMessage className="font-semibold text-red-400" />
                                    </FormItem>
                                )}
                            />
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
                            <FormField
                                control={form.control}
                                name="storeSlug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Store&apos;s Slug</FormLabel>
                                        <FormDescription className='text-neutral-500 font-semibold'>Example: www.example.com/shop/{slug}</FormDescription>
                                        <FormControl>
                                            <Input
                                                id="slug"
                                                title="Store&apos;s Slug"
                                                placeholder="fancyshopping"
                                                className="col-span-3 w-[2/4] border-neutral-600 text-neutral-500 font-semibold focus-visible:ring-0 focus-visible:border-2"
                                                onChangeCapture={e => e.currentTarget.value.length == 0 ? setSlug("fancyshopping") : setSlug(e.currentTarget.value)}
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
    )
}

export default CreateStoreContent