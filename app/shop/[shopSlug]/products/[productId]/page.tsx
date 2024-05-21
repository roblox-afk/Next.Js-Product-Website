import { findStoreWithSlug, StoreCategory, StoreCollection, storeData, StoreProduct } from "@/Actions/store";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactElement, Suspense, useContext, useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import { getVideoUrlHost, makeVideoEmbed } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCart";

const ShopProduct = async ({ params } : { params: {shopSlug: string, productId: string} }) => {
    const supabase = createClient()
    const layout = "default"
    const { data, error } : {data: storeData | null, error: any} = await supabase
        .from('stores')
        .select('*')
        .eq('slug', params.shopSlug)
        .single()

    if (data == null) return redirect("/shop/"+params.shopSlug)

    const { data: productData, error: productError } : { data: StoreProduct | null, error: any } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', data.id)
        .eq('id', params.productId)
        .single()
    // TODO: Add Focus on image (Makes image larger / opens a modal of image)
    if (productData == null || !productData.isFeatured) return redirect("/shop/"+params.shopSlug)
    return (
        <div className="h-full flex flex-row">
            <div className="mt-20 h-72 w-[50%] flex justify-center">
                <Carousel className="w-full max-w-xl">
                    <CarouselContent>
                        {productData.media?.filter((media) => media.isVideo ).map((media) => (
                            <CarouselItem key={media.url} className="pl-4">
                                <Suspense fallback={<Spinner />}>
                                    <iframe src={makeVideoEmbed(media.url, getVideoUrlHost(media.url)) || ""} allowFullScreen className="w-full h-full" />
                                </Suspense>
                            </CarouselItem>
                        ))}
                        {productData.media?.filter((media) => media.isVideo != true).map((media) => (
                            <CarouselItem key={media.url} className="pl-4 h-72 w-full relative">
                                <Image src={media.url} alt="Product image" className="rounded-3xl" fill objectFit="contain" />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
            <div className="flex flex-col h-full w-[550px] mr-36 float-right mt-20">
                <h1 className="font-bold text-4xl w-[90%]">{productData.title}</h1>
                <h2 className="font-semibold mt-2">{productData.price == null || productData.price == 0 ? "Free" : "$" + productData.price + " USD"}</h2>
                <h2 className="font-semibold">Tax included</h2>
                <AddToCartButton productData={productData} />
                <div dangerouslySetInnerHTML={{__html: productData.description}} className="mt-4"></div>
            </div>
        </div>
    )
}
export default ShopProduct;