import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import React from "react"
import logoTest from "@/public/profilePicturePlaceholder.png"
import Image from "next/image"
import Link from "next/link"
import { StoreCategory, StoreCollection, StoreProduct } from "@/Actions/store"
import { Separator } from "@/components/ui/separator"
import { View } from "lucide-react"
import { storeData } from '@/Actions/store';

export function ModernShopNavBar({ data, categories, collections, products }: { data: storeData, categories: StoreCategory[] | null, collections: StoreCollection[], products: StoreProduct[] | null }) {
    return (
        <div className="flex absolute justify-center items-center bg-default-50 h-20 w-full">
            <Link href={"/shop/" + data.slug} className="absolute left-40 bg-red-400">
                <Image src={data.logoUrl} alt="logo of store" width={75} height={75} />
            </Link>
            <NavigationMenu className="ml-24">
                <NavigationMenuList className="gap-4">
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-default-100">Home</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <a
                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md bg-default-100"
                                            href="/"
                                            >
                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                shadcn/ui
                                            </div>
                                            <p className="text-sm leading-tight text-muted-foreground">
                                                Beautifully designed components that you can copy and
                                                paste into your apps. Accessible. Customizable. Open
                                                Source.
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <ListItem href="/docs" title="Introduction">
                                    Re-usable components built using Radix UI and Tailwind CSS.
                                </ListItem>
                                <ListItem href="/docs/installation" title="Installation">
                                    How to install dependencies and structure your app.
                                </ListItem>
                                <ListItem href="/docs/primitives/typography" title="Typography">
                                    Styles for headings, paragraphs, lists...etc
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    {categories?.map((category) => (
                        <NavigationMenuItem key={category.id} className="border-default-300">
                            <NavigationMenuTrigger className="bg-default-100">{category.title}</NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-default-100">
                                <ul className="grid w-[300px] gap-3 p-4 md:w-[350px] md:grid-cols-2 lg:w-[400px]">
                                    {collections.length > 0  ?
                                        <>
                                            {collections?.filter((collection) => collection.category == category.id).map((collection) => {
                                                return (
                                                    <ListItem
                                                        key={collection.id}
                                                        title={collection.title}
                                                        href={"/shop/"+data.slug+"/collections/"+collection.id}
                                                        className="bg-transparent border border-default-200 hover:bg-default-50 text-center"
                                                    />
                                                )
                                            })}
                                        </> :
                                        <>
                                            {products?.filter((product) => product.category == category.id).map((product) => {
                                                return (
                                                    <ListItem
                                                        key={product.id}
                                                        title={product.title}
                                                        href={"/shop/"+data.slug+"/products/"+product.id}
                                                        className="bg-transparent border border-default-200 hover:bg-default-50 text-center"
                                                    />
                                                )
                                            })}
                                        </>
                                    }
                                </ul>
                                <Separator className="bg-default-300 mx-4 w-auto" />
                                <NavigationMenuLink href={"/shop/"+data.slug+"/categories/"+category.id}>
                                    <a
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground
                                        bg-transparent border border-default-200 w-auto m-2 hover:bg-default-50"
                                        >
                                        <div className="flex text-sm font-medium leading-none justify-center text-center items-center"><View className="mr-2" />View all</div>
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ))}

                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
        <NavigationMenuLink asChild>
            <a
            ref={ref}
            className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className
            )}
            {...props}
            >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
            </p>
            </a>
        </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"