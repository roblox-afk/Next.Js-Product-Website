"use client"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, SignOutButton } from "@clerk/nextjs"
import { Button, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Navbar as NextNavBar } from "@nextui-org/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import {dark} from "@clerk/themes";
import { IsLoggedIn } from "@/Actions/isLoggedIn"

interface IMenuItemProps {
    path: string,
    showWhileLoggedOut: boolean,
    showWhileLoggedIn: boolean
}

export default function NavBar({ loggedIn}: {loggedIn: boolean}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activePage, setActivePage] = useState()

    const menuItems: Record<string, IMenuItemProps>[] = [
        {"Home": {
            path: "/",
            showWhileLoggedIn: true,
            showWhileLoggedOut: true,
        }},
        {"Products": {
            path: "/products",
            showWhileLoggedIn: true,
            showWhileLoggedOut: true,
        }},
        {"Dashboard": {
            path: "/dashboard",
            showWhileLoggedIn: true,
            showWhileLoggedOut: false,
        }},
        {"About Us": {
            path: "/about",
            showWhileLoggedIn: true,
            showWhileLoggedOut: true,
        }}
    ]

    function getItemsShowWhileLoggedIn() {
        return menuItems.filter(item => {
            const key = (Object.keys(item) as string[])[0]
            return item[key].showWhileLoggedIn
        })
    }

    function getItemsShowWhileLoggedOut() {
        return menuItems.filter(item => {
            const key = (Object.keys(item) as string[])[0]
            return item[key].showWhileLoggedOut
        })
    }


    return (
        <NextNavBar onMenuOpenChange={setIsMenuOpen} className="bg-black bg-opacity-95 backdrop-blur-md border-b border-gray-800 fixed shadow">
            <NavbarContent>
                <NavbarMenuToggle
                aria-label={isMenuOpen? "Close Menu" : "Open Menu"}
                className="sm:hidden"
                />
                <NavbarBrand>
                    <p className="font-bold text-inherit">PLACEHOLDER</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link className="foreground" href="/">
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link className="foreground" href="/products">
                        Products
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link className="foreground" href="/about">
                        About Us
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <SignedOut>
                    <NavbarItem className="hidden lg:flex">
                        <SignInButton>
                            <Link href="">Login</Link>
                        </SignInButton>
                    </NavbarItem>
                    <NavbarItem>
                        <SignUpButton>
                            <Button as={Link} color="primary" href="" variant="flat">
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </NavbarItem>
                </SignedOut>
                <SignedIn>
                    <NavbarItem>
                        <Button as={Link} color="primary" href="/dashboard" variant="flat">
                            Dashboard
                        </Button>
                    </NavbarItem>
                    <NavbarItem>
                        <UserButton appearance={{
                            baseTheme: dark
                        }} />
                    </NavbarItem>
                </SignedIn>
            </NavbarContent>

            <NavbarMenu>
                <SignedIn>
                    {getItemsShowWhileLoggedIn().map((item: Record<string, IMenuItemProps>, index: number) => (
                        <NavbarMenuItem key={`${item[1]}-${index}`}>
                            <Link
                                color={
                                    index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                                }
                                className="w-full"
                                href={item[(Object.keys(item) as string[])[0]].path}
                            >
                                {(Object.keys(item) as string[])[0]}
                            </Link>

                        </NavbarMenuItem>
                    ))}
                    <SignOutButton>
                        <Link
                            className="w-full text-danger-500"
                            href=""
                        >
                            Log out
                        </Link>
                    </SignOutButton>
                </SignedIn>
                <SignedOut>
                    {getItemsShowWhileLoggedOut().map((item: Record<string, IMenuItemProps>, index: number) => (
                        <NavbarMenuItem key={`${item[1]}-${index}`}>
                            <Link
                                color={
                                    index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                                }
                                className="w-full"
                                href={item[(Object.keys(item) as string[])[0]].path}
                            >
                                {(Object.keys(item) as string[])[0]}
                            </Link>

                        </NavbarMenuItem>
                    ))}
                    <SignInButton>
                        <Link
                            className="w-full"
                            href=""
                        >
                            Sign In
                        </Link>
                    </SignInButton>
                    <SignUpButton>
                        <Link
                            className="w-full text-primary-500"
                            href=""
                        >
                            Sign Up
                        </Link>
                    </SignUpButton>
                </SignedOut>
            </NavbarMenu>
        </NextNavBar>
    )
}