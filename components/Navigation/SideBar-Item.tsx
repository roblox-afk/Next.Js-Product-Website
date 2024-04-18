import { Button } from "@nextui-org/react";
import Image from 'next/image'
import Link from "next/link";
import { icons } from "lucide-react"
import { error } from "console";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SideBarItem = ({ iconName, title, path, currentPath } : { iconName: string, title: string, path: string, currentPath: string }) => {
    const LucideIcon = icons[iconName]


    return (
        <Link href={path}>
            <Button variant={currentPath == path ? 'solid' : 'ghost'} className={cn("gap-2 text-white border-none bg-opacity-15 w-full")}>
                <LucideIcon className="left-0" />
                <span>{title}</span>
            </Button>
        </Link>
    )
}
export default SideBarItem;