"use client"
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
import React, { useContext } from "react"
import logoTest from "@/public/profilePicturePlaceholder.png"
import Image from "next/image"
import Link from "next/link"
import { StoreCategory, StoreCollection, StoreProduct } from "@/Actions/store"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, View } from "lucide-react"
import { storeData } from '@/Actions/store';
import { Button } from "@/components/ui/button"
import { Badge, ConfigProvider } from "antd"
import { CartContext } from "@/components/providers/cart-provider"

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

const ModernShopNavBar = ({ data, categories, collections, products }: { data: storeData, categories: StoreCategory[] | null, collections: StoreCollection[], products: StoreProduct[] | null }) => {
    const cartContext = useContext(CartContext)
    return (
        <div className="flex absolute justify-center items-center bg-default-50 h-20 w-full">
            <Link href={"/shop/" + data.slug} className="absolute left-10 sm:left-20 md:left-40 bg-red-400">
                <Image src={data.logoUrl} alt="logo of store" width={75} height={75} />
            </Link>
            <NavigationMenu className="ml-24">
                <NavigationMenuList className="gap-4">
                    <Link href={`/shop/${data.slug}`} legacyBehavior passHref>
                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-default-100")}>
                            Home
                        </NavigationMenuLink>
                    </Link>
                    {categories?.map((category) => (
                        <NavigationMenuItem key={category.id} className="border-default-300">
                            <NavigationMenuTrigger className="bg-default-100">{category.title}</NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-default-100">
                                <ul className="grid w-[300px] gap-3 p-4 md:w-[350px] md:grid-cols-2 lg:w-[400px]">
                                    {JSON.stringify(collections.filter(x => x.category == category.id)) != "[]"  ?
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
            <Button asChild size="icon" className="bg-transparent hover:bg-default-100 absolute right-5 sm:right-10">
                    <Link href={`/shop/${data.slug}/cart`}>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Badge: {
                                        dotSize: 1,
                                        statusSize: 2,
                                        colorError: '#27272a',
                                        colorErrorHover: '#27272a',
                                        colorBorderBg: '#3f3f46',
                                    }
                                }
                            }}
                        >
                            <Badge count={cartContext.getTotalQuantity()} size="small" className="border-none">
                                <ShoppingCart />
                            </Badge>
                        </ConfigProvider>
                    </Link>
            </Button>
        </div>
    )
}

export default ModernShopNavBar