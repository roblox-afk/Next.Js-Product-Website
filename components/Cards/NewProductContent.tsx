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
import { createProduct, createStore, StoreCategory } from '@/Actions/store';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { createClient } from '@/lib/supabase/client';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

//TODO: Add media for product

export const CreateProductSchema = z.object({
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
    price: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string"
    }),
    category: z.string(),
    isFeatured: z.boolean()
})

const NewProductContent = ({shopId}: {shopId: string}) => {
    const supabase = createClient()
    const categories = useRef<StoreCategory[]>([])
    const form = useForm<z.infer<typeof CreateProductSchema>>({
        resolver: zodResolver(CreateProductSchema),
        defaultValues: {
            title: "",
            category: "",
            price: "0",
            isFeatured: false
        }
    })

    useEffect(() => {
        async function getCategories() {
            const {data, error} = await supabase
                .from('categories')
                .select('*')
                .eq('store_id', shopId)

            categories.current = data != null ? data : []
        }
        getCategories()
    }, [supabase, shopId])

    function createNewProduct(data: z.infer<typeof CreateProductSchema>) {
        if (createProduct(data, shopId) == null) {
            toast("Unable to create product", {
                icon: <TriangleAlert fill="#ec9909" strokeWidth={2} absoluteStrokeWidth stroke="#ffffff" className="group-data-[type=warning]" />,
                description: "There seems to be a error while creating the product on stripe",
            })
        } else {
            toast("Product created", {
                icon: <CircleCheck fill="#6fec09" strokeWidth={2} absoluteStrokeWidth stroke="#ffffff" className="group-data-[type=success]" />,
                description: "Your product was created with no problems",
            })
        }
        form.reset()
    }

    console.log(shopId)
    console.log(categories)

    return (
        <DialogContent className="sm:max-w-[425px] border-neutral-600">
            <DialogHeader>
                <DialogTitle className="text-neutral-200">Create Product!</DialogTitle>
                <DialogDescription className="text-neutral-300">
                    Create your next success in just a few steps.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(createNewProduct)}>
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
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="price"
                                                type='number'
                                                title="Price"
                                                placeholder="0.99"
                                                className="col-span-3 w-[2/4] border-neutral-600 text-neutral-500 font-semibold focus-visible:ring-0 focus-visible:border-2"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="font-semibold text-red-400" />
                                    </FormItem>
                                )}
                            />
                            {categories == null ? <>
                                <Skeleton></Skeleton>
                            </> : <>
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Category</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-[200px] justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? categories.current.find(
                                                                    (category) => category.id === field.value
                                                                )?.title
                                                                : "Select category"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search category..." />
                                                        <CommandEmpty>No categories found.</CommandEmpty>
                                                        <CommandList>
                                                        {categories.current.map((category) => (
                                                            <CommandItem
                                                            value={category.title}
                                                            key={category.id}
                                                            onSelect={(value) => {
                                                                form.setValue("category", category.id)
                                                            }}
                                                            >
                                                            <Check
                                                                className={cn(
                                                                "mr-2 h-6 w-4",
                                                                category.id === field.value
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
                            </>}
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

export default NewProductContent