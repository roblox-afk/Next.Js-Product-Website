import { NavbarItem, Button as NextUiButton } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import Image from 'next/image'
import Link from "next/link";
import { Settings, LogOut, User } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import profilePicturePlaceholder from "@/public/profilePicturePlaceholder.png"
import { PopoverClose } from "@radix-ui/react-popover";
import { logout } from "@/Actions/auth";
import { Avatar } from "antd";

const NavBarQuickLinks = ({loggedIn} : { loggedIn: boolean }) => {

    function onLogoutClicked() {
        logout()
    }

    if (loggedIn) {
        return (
            <>
                <NavbarItem>
                    <NextUiButton as={Link} color="primary" href="/dashboard" variant="flat">
                        Dashboard
                    </NextUiButton>
                </NavbarItem>
                <NavbarItem>
                    <Popover>
                        <PopoverTrigger>
                            <Avatar className="bg-default-50 bg-opacity-35 hover:bg-opacity-50" size={50} icon={<User />} />
                        </PopoverTrigger>
                        <PopoverContent className="bg-neutral-950 border-neutral-800 w-48">
                            <PopoverClose asChild>
                                <Button className="w-full bg-transparent hover:bg-neutral-900 font-sans" onClick={onLogoutClicked}>
                                    <LogOut className="mr-1 w-4 h-4" /> Log Out
                                </Button>
                            </PopoverClose>
                        </PopoverContent>
                    </Popover>
                </NavbarItem>
            </>
        )
    } else {
        return (
            <>
                <NavbarItem className="hidden lg:flex">
                        <Link href="/auth/sign-in">Login</Link>
                </NavbarItem>
                <NavbarItem>
                        <NextUiButton as={Link} color="primary" href="/auth/sign-up" variant="flat">
                            Sign Up
                        </NextUiButton>
                </NavbarItem>
            </>
        )
    }
}
export default NavBarQuickLinks;