"use client"
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { DialogTrigger } from "@/components/ui/dialog";
import { StoreProduct } from "@/Actions/store";

function getProductPath(pathname: string, productId: string) {
    const shopSlug = pathname.split("/")[2]
    return "/shop/"+shopSlug+"/products/"+productId
}

const ProductCard = ({productData} : {productData: StoreProduct}) => {
    const pathname = usePathname()
    const productPath = getProductPath(pathname, productData.id)

    return (
        <div className="hover:bg-zinc-900 shadow-lg rounded-3xl w-[400px] h-[298px] justify-center">
            <Link href={productPath}>
                <Image src={productData.media ? productData.media[0].url : "https://placehold.co/380x225"} alt="image of product" width={380} height={225} className="rounded-2xl bg-zinc-800 mt-2.5 mx-2.5" />
            </Link>
            <h1 className="mx-7 text-md text-default-800 text-left font-bold mt-1.5">
                <Link href={productPath}>{productData.title}</Link>
            </h1>
            <p className="text-default-800 font-semibold text-md mx-7 mb-4">${productData.price}</p>
        </div>
    )
}
export default ProductCard;