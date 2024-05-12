"use client"
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from "../ui/form";
import { Button } from '../ui/button';
import { CircleCheck, Loader2, TriangleAlert, XCircle, Check, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { createCategory, createProduct, createStore, StoreCategory } from '@/Actions/store';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { createClient } from '@/lib/supabase/client';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

//TODO: Add media for product

export const CreateCategorySchema = z.object({
    title: z.string().superRefine((val, ctx) => {
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
})

const NewCategoryContent = ({shopId}: {shopId: string}) => {
    const supabase = createClient()
    const categories = useRef<StoreCategory[]>([])
    const form = useForm<z.infer<typeof CreateCategorySchema>>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            title: ""
        }
    })

    function createNewCategory(data: z.infer<typeof CreateCategorySchema>) {
        if (createCategory(data, shopId) == null) {
            toast("Unable to create category", {
                icon: <TriangleAlert fill="#ec9909" strokeWidth={2} absoluteStrokeWidth stroke="#ffffff" className="group-data-[type=warning]" />,
                description: "There seems to be a error while creating the category",
            })
        } else {
            toast("Category created", {
                icon: <CircleCheck fill="#6fec09" strokeWidth={2} absoluteStrokeWidth stroke="#ffffff" className="group-data-[type=success]" />,
                description: "Your category was created with no problems",
            })
        }
        form.reset()
    }

    console.log(shopId)
    console.log(categories)

    return (
        <DialogContent className="sm:max-w-[425px] border-neutral-600">
            <DialogHeader>
                <DialogTitle className="text-neutral-200">Create a category!</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(createNewCategory)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 items-center gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="title"
                                                title="Name"
                                                placeholder="Car tire."
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
    )
}

export default NewCategoryContent