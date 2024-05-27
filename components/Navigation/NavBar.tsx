"use client"
import { Button, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Navbar as NextNavBar } from "@nextui-org/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import NavBarQuickLinks from "./NavBar-QuickLinks"
import NavBarQuickMenuLinks from "./NavBar-QuickMenuLinks"

export interface IMenuItemProps {
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


    return (
        <NextNavBar onMenuOpenChange={setIsMenuOpen} className="bg-black bg-opacity-95 backdrop-blur-md border-b border-gray-800 fixed shadow">
            <NavbarContent>
                <NavbarMenuToggle
                aria-label={isMenuOpen? "Close Menu" : "Open Menu"}
                className="sm:hidden"
                />
                <NavbarBrand>
                    <p className="font-bold text-inherit">Comify Inc.</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link className="foreground" href="/">
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link className="foreground" href="/about">
                        About Us
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavBarQuickLinks loggedIn={loggedIn} />
            </NavbarContent>

            <NavbarMenu>
                <NavBarQuickMenuLinks loggedIn={loggedIn} menuItems={menuItems} ></NavBarQuickMenuLinks>
            </NavbarMenu>
        </NextNavBar>
    )
}