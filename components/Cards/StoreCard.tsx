"use client"
import { Button } from "../ui/button";
import Image from 'next/image';
import { CirclePlus } from 'lucide-react';
import profilePicturePlaceholder from "../../public/profilePicturePlaceholder.png"
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

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
            <Button className="bg-neutral-900 shadow-lg border border-neutral-800 hover:bg-neutral-800  hover:shadow-neutral-700 rounded-3xl w-48 h-52 justify-center flex flex-col items-center">
                <CirclePlus />
            </Button>
        )
    }

    return (
        <div className="bg-neutral-900 shadow-lg border border-neutral-800  hover:shadow-neutral-700 rounded-3xl w-48 h-52 justify-center flex flex-col items-center">
            <Image src={profilePicturePlaceholder} alt="store logo" width={50} height={50} />
            <h1 className="text-md top-0 text-default-800 text-center font-semibold mb-10 mt-5">{title}</h1>
            <Button className="w-36 bg-neutral-900 outline outline-1 outline-neutral-500 hover:bg-neutral-500" onClick={onClick}>
                Select
            </Button>
        </div>
    )
}
export default StoreCard;