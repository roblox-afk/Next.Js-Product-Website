import { Button, NavbarItem, NavbarMenuItem } from "@nextui-org/react";
import Image from 'next/image'
import Link from "next/link";
import { IMenuItemProps } from "./NavBar";

const NavBarQuickMenuLinks = ({ loggedIn, menuItems }: { loggedIn: boolean, menuItems: Record<string, IMenuItemProps>[] }) => {

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

    if (loggedIn) {
        return (
            <>
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
                <Link
                    className="w-full text-danger-500"
                    href=""
                >
                    Log out
                </Link>
            </>
        )
    } else {
        return (
            <>
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
                <Link
                    className="w-full"
                    href="/auth/sign-in"
                >
                    Sign In
                </Link>
                <Link
                    className="w-full text-primary-500"
                    href="/auth/sign-up"
                >
                    Sign Up
                </Link>
            </>
        )
    }
}
export default NavBarQuickMenuLinks;