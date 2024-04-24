"use client"
import { Button, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Navbar as NextNavBar } from "@nextui-org/react"
import Link from "next/link"
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react"
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import SideBarItem from "./SideBar-Item";
import SideBarShopSelect from "./SideBar-ShopSelect";

export interface ISideBarItemProps {
    title: string,
    icon: string,
    path: string,
}

export default function SideBar({MenuItems}:{MenuItems: ISideBarItemProps[]}) {
    const pathname = usePathname()

    return (
        <>
            <aside className="phone:hidden sm:w-[100px] sm:block md:w-[230px] max-w-xs h-screen fixed left-0 top-0 border-r border-neutral-900">
                <div className="h-full px-3 py-4">
                    <div className="flex justify-center">
                        <SideBarShopSelect />
                    </div>
                    <Separator className="mt-5 bg-neutral-700" />
                    <div className="mt-5"><div className="bg-default-200"></div>
                        <div className="flex flex-col gap-1 w-full">
                            {MenuItems.map(function(data) {
                                return (
                                    <SideBarItem key={data.title} title={data.title} iconName={data.icon} currentPath={pathname} path={data.path} />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </aside>
            <Button variant="bordered" className="phone:flex sm:hidden w-fit absolute m-1 gap-unit-0">
                <Menu className="m-1" />
            </Button>
        </>
    )
}