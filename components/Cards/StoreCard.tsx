"use client"
import { Button } from "../ui/button";
import Image from 'next/image';
import { CirclePlus } from 'lucide-react';
import profilePicturePlaceholder from "../../public/profilePicturePlaceholder.png"
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { DialogTrigger } from "@/components/ui/dialog";

const StoreCard = ({title, logo, id, isCreateNew} : {title: string, logo: string, id: string, isCreateNew: boolean}) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    function onClick() {
        const params = new URLSearchParams(searchParams.toString())
        params.set("id", id)
        router.push(pathname + '?' + params.toString())
    }

    if (isCreateNew) {
        return (
            <DialogTrigger asChild>
                <Button className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-900 text-default-200 hover:text-default-500 rounded-3xl w-48 h-52 justify-center flex flex-col items-center">
                    <CirclePlus />
                </Button>
            </DialogTrigger>
        )
    }

    return (
        <div className="bg-neutral-900 shadow-lg border border-neutral-800  hover:shadow-neutral-700 rounded-3xl w-48 h-52 justify-center flex flex-col items-center">
            <Image src={logo} alt="store logo" width={75} height={75} className="rounded-2xl" />
            <h1 className="text-md top-0 text-default-800 text-center font-semibold mb-6 mt-4">{title}</h1>
            <Button className="w-36 bg-neutral-900 outline outline-1 outline-neutral-500 hover:bg-neutral-500" onClick={onClick}>
                Select
            </Button>
        </div>
    )
}
export default StoreCard;