import { Button, NavbarItem } from "@nextui-org/react";
import Image from 'next/image'
import Link from "next/link";

const NavBarQuickLinks = ({loggedIn} : { loggedIn: boolean }) => {

    if (loggedIn) {
        return (
            <>
                <NavbarItem>
                    <Button as={Link} color="primary" href="/dashboard" variant="flat">
                        Dashboard
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button>
                        <Image
                            src=""
                            alt="Profile picture"
                        />
                    </Button>
                </NavbarItem>
            </>
        )
    } else {
        return (
            <>
                <NavbarItem className="hidden lg:flex">
                        <Link href="/sign-in">Login</Link>
                </NavbarItem>
                <NavbarItem>
                        <Button as={Link} color="primary" href="/sign-up" variant="flat">
                            Sign Up
                        </Button>
                </NavbarItem>
            </>
        )
    }
}
export default NavBarQuickLinks;