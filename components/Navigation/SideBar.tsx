"use client"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, SignOutButton } from "@clerk/nextjs"
import { Button, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Navbar as NextNavBar } from "@nextui-org/react"
import Link from "next/link"
import { Home, BarChart3 } from 'lucide-react';
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react"
import { IsLoggedIn } from "@/Actions/isLoggedIn"
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
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
        <aside className="w-[230px] max-w-xs h-screen fixed left-0 top-0 border-r border-neutral-900">
            <div className="h-full px-3 py-4">
                <div className="flex justify-center">
                    <SideBarShopSelect />
                </div>
                <Separator className="mt-5 bg-neutral-700" />
                <div className="mt-5"><div className="bg-default-200"></div>
                    <div className="flex flex-col gap-1 w-full">
                        {MenuItems.map(function(data) {
                            return (
                                <SideBarItem title={data.title} iconName={data.icon} currentPath={pathname} path={data.path} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </aside>
    )
}