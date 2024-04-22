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
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { createStore } from '@/Actions/store';
import { Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';

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
}).required()

const CreateStoreContent = ({setOpen} : {setOpen: Dispatch<SetStateAction<boolean>> }) => {
    const router = useRouter()
    const [slug, setSlug] = useState("fancyshopping")

    const form = useForm<z.infer<typeof CreateStoreSchema>>({
        resolver: zodResolver(CreateStoreSchema),
        defaultValues: {
            storeName: "",
            storeSlug: ""
        }
    })

    function createNewStore(data: z.infer<typeof CreateStoreSchema>) {
        if (createStore(data) != null) {
            toast("Unable to create store", {
                icon: <TriangleAlert fill="#ec9909" strokeWidth={2} absoluteStrokeWidth stroke="#ffffff" className="group-data-[type=warning]" />,
                description: "There seems to be a store with that name!",
            })
        } else {
            toast("Store created", {
                icon: <CircleCheck fill="#6fec09" strokeWidth={2} absoluteStrokeWidth stroke="#ffffff" className="group-data-[type=success]" />,
                description: "Your store was created with no problems",
            })
        }
        setOpen(false)
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