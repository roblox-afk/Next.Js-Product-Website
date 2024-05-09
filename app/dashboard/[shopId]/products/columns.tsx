"use client"
import { deleteProduct, StoreProduct } from "@/Actions/store"
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

export const columns: ColumnDef<StoreProduct>[] = [
    {
        accessorKey: "category",
        header: "Category",
        cell: ({cell}) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [title, setTitle] = useState("")
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                async function getTitle(cell: Cell<StoreProduct, unknown>) {
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
            return title
        },
    },
    {
        accessorKey: "title",
        header: "Title"
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({cell}) => {
            return cell.getValue() == true ? 'Yes' : 'No'
        },
        enableSorting: true,
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
            }).format(price)

            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const product = row.original
            console.log(product)

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
                            navigator.clipboard.writeText(product.id)
                            toast("Copied to Clipboard", {
                                description: "Succesfully copied product id to your clipboard."
                            })
                        }}
                        className="hover:bg-default-50 mt-1"
                        >
                        <Clipboard size={16} color="#52525b" className="mr-1" />Copy product ID
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="hover:bg-default-50"><Link href={"/dashboard/"+product.store_id+"/products/"+product.id}><Pencil size={16} color="#52525b" className="mr-1" /> Edit Product</Link></DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-default-50" onClick={() => deleteProduct(product)}><Trash2 size={16} color="#52525b" className="mr-1" />Delete Product</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]