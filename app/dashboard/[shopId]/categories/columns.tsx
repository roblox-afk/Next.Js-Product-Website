"use client"
import { addFeaturedProduct, deleteCategory, deleteProduct, removeFeaturedProduct, StoreCategory, StoreProduct } from "@/Actions/store"
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

export const columns: ColumnDef<StoreCategory>[] = [
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
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const category = row.original

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
                                navigator.clipboard.writeText(category.id)
                                toast("Copied to Clipboard", {
                                    description: "Succesfully copied category id to your clipboard."
                                })
                            }}
                            className="hover:bg-default-50"
                        >
                            <Clipboard size={16} color="#52525b" className="mr-1" />Copy category ID
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="hover:bg-default-50"><Link href={"/dashboard/"+category.store_id+"/categories/"+category.id}><Pencil size={16} color="#52525b" className="mr-1" /> Edit Category</Link></DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-default-50" onClick={() => deleteCategory(category)}><Trash2 size={16} color="#52525b" className="mr-1" />Delete Category</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]