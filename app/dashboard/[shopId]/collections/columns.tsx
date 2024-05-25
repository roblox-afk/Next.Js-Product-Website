"use client"
import { addFeaturedProduct, deleteCategory, deleteCollection, deleteProduct, removeFeaturedProduct, StoreCategory, StoreCollection, StoreProduct } from "@/Actions/store"
import { createClient } from "@/lib/supabase/client"
import { Cell, ColumnDef } from "@tanstack/react-table"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Clipboard, MoreHorizontal, Pencil, Star, StarHalf, Trash2 } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import { title } from 'process';
import { toast } from "sonner"
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@nextui-org/react"

export const columns: ColumnDef<StoreCollection>[] = [
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}>
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({cell}) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [title, setTitle] = useState("")
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                async function getTitle(cell: Cell<StoreCollection, unknown>) {
                    const supabase = createClient()
                    const { data, error }: {data: any, error: any} = await supabase
                        .from('categories')
                        .select('title')
                        .eq('id', cell.getValue())
                        .single()
                    if (data == null) return setTitle("No category assigned")
                    setTitle(data.title)
                }
                getTitle(cell)
            }, [cell])
            return title == "" ? <Spinner size="sm" color="default" /> : title
        },
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}>
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "featured",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}>
                    Featured
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({cell}) => {
            return cell.getValue() == true ? <Badge className="bg-success-200">Yes</Badge> : <Badge className="bg-default-200">No</Badge>
        },
        enableSorting: true,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const collection = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-default-50">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-neutral-950 border-default-100">
                        <DropdownMenuLabel className="border-b border-default-100 text-center">Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                navigator.clipboard.writeText(collection.id)
                                toast("Copied to Clipboard", {
                                    description: "Succesfully copied collection id to your clipboard."
                                })
                            }}
                            className="hover:bg-default-50"
                        >
                            <Clipboard size={16} color="#52525b" className="mr-1" />Copy collection ID
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="hover:bg-default-50"><Link href={"/dashboard/"+collection.store_id+"/collections/"+collection.id}><Pencil size={16} color="#52525b" className="mr-1" /> Edit Collection</Link></DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-default-50" onClick={() => deleteCollection(collection)}><Trash2 size={16} color="#52525b" className="mr-1" />Delete Collection</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]