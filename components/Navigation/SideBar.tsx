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

interface IMenuItemProps {
    path: string,
    showWhileLoggedOut: boolean,
    showWhileLoggedIn: boolean
}

export default function SideBar() {
    const pathname = usePathname()
    const [activeSide, setActiveSide] = useState( pathname == "/dashboard" ? "home" : pathname == "/dashboard/organizations" ? "organizations" : "analytics")

    return (
        <aside className="w-[230px] max-w-xs h-screen fixed left-0 top-0 border-r border-neutral-900">
            <div className="h-full px-3 py-4">
                <div className="flex justify-center">
                    <OrganizationSwitcher createOrganizationMode="modal" organizationProfileMode="modal"/>
                </div>
                <Separator className="mt-5 bg-neutral-700" />
                <div className="mt-5">
                    <div className="flex flex-col gap-1 w-full">
                        <Link href="/dashboard">
                            <Button asChild variant={pathname == "/dashboard" ? 'solid' : 'ghost'} className={cn("gap-2 text-white border-none bg-opacity-15 w-full")}>
                                <Home className="left-0" />
                                <span>Home</span>
                            </Button>
                        </Link>
                        <Link href="/dashboard/analytics">
                            <Button asChild variant={pathname == "/dashboard/analytics" ? 'solid' : 'ghost'} className={cn("gap-2 text-white border-none bg-opacity-15 w-full")}>
                                <BarChart3 />
                                <span>Analytics</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    )
}