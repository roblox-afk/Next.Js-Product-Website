"use client"
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { DialogTrigger } from "@/components/ui/dialog";
import { StoreCollection } from "@/Actions/store";

function getCollectionPath(pathname: string, collectionId: string) {
    const shopSlug = pathname.split("/")[2]
    return "/shop/"+shopSlug+"/collections/"+collectionId
}

const CollectionCard = ({collectionData} : {collectionData: StoreCollection}) => {
    const pathname = usePathname()
    const collectionPath = getCollectionPath(pathname, collectionData.id)

    function onClick() {
    }

    return (
        <div className="hover:bg-zinc-900 shadow-lg rounded-3xl w-48 h-52 justify-center flex flex-col items-center">
            <Link href={collectionPath}>
                <Image src={collectionData.coverUrl ? collectionData.coverUrl : "https://placehold.co/178x160"} alt="store logo" width={179} height={160} className="rounded-2xl mt-2" />
            </Link>
            <h1 className="centered text-md top-0 text-default-800 text-center font-bold mb-3 mt-1">
                <Link href={collectionPath}>{collectionData.title}</Link>
            </h1>
        </div>
    )
}
export default CollectionCard;