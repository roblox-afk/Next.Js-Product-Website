import { Button } from "@nextui-org/react";
import Image from 'next/image'
import Link from "next/link";
import { icons } from "lucide-react"
import { error } from "console";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const SideBarItem = ({ iconName, title, path, currentPath } : { iconName: string, title: string, path: string, currentPath: string }) => {
    const LucideIcon = (icons as any)[iconName]


    return (
        <Link href={path}>
            <Button variant={currentPath == path ? 'solid' : 'ghost'} className={cn("gap-2 text-white border-none bg-opacity-25 w-full")}>
                <LucideIcon className="left-0" />
                <span className="sm:hidden md:inline">{title}</span>
            </Button>
        </Link>
    )
}
export default SideBarItem;