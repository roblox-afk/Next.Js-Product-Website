import { Button } from "@/components/ui/button";
import Image from 'next/image'
import Link from "next/link";
import { ChevronsUpDown } from "lucide-react"
import { error } from "console";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const SideBarShopSelect = () => {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mx-2 bg-default-50 h-10 rounded-lg flex justify-center items-center">
                    <ChevronsUpDown className="flex absolute right-6" height="20px" color="#504949" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full mx-2 bg-default-100">
                <Button variant="ghost" className="">
                    Image
                </Button>
            </PopoverContent>
        </Popover>
    )
}
export default SideBarShopSelect;