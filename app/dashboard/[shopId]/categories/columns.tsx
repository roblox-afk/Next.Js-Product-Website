"use client"
import { deleteCategory, deleteProduct, StoreCategory } from "@/Actions/store"
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
import { Clipboard, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { title } from 'process';
import { toast } from "sonner"
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"
import Link from "next/link"

export const columns: ColumnDef<StoreCategory>[] = [
    {
        accessorKey: "title",
        header: "Title"
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const category = row.original
            console.log(category)

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
                                description: "Succesfully copied product id to your clipboard."
                            })
                        }}
                        className="hover:bg-default-50 mt-1"
                        >
                        <Clipboard size={16} color="#52525b" className="mr-1" />Copy category Id
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="hover:bg-default-50"><Link href={"/dashboard/"+category.store_id+"/categories/"+category.id}><Pencil size={16} color="#52525b" className="mr-1" /> Edit Category</Link></DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-default-50" onClick={() => deleteCategory(category)}><Trash2 size={16} color="#52525b" className="mr-1" />Delete Category</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]