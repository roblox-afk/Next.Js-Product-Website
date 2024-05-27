"use client"
import { StoreCategory, StoreCollection, StoreProduct } from "@/Actions/store";
import { CartContext } from "@/components/providers/cart-provider";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "@/components/Cards/Shop/ProductCard";
import { Separator } from "@/components/ui/separator";

const ShopFrontPage = ({params, categories, collections, products}: {params: {shopSlug: string}, categories: StoreCategory[] | null, collections: StoreCollection[] | null, products: StoreProduct[] | null}) => {
    const router = useRouter()
    const successParam = useSearchParams().get("success")
    const cartContext = useContext(CartContext)
    if (successParam == "true") {
        cartContext.clearCart()
        router.push(`/shop/${params.shopSlug}`)
    }
    return (
        <div className="h-full w-full">
            <div className="h-[640px] w-full">
                <Carousel className="h-fit w-full" plugins={[
                    Autoplay({
                        delay: 5500
                    })
                ]}>
                    <CarouselContent className="h-fit w-full">
                        {categories?.map(category => (
                            <CarouselItem key={category.id} className="h-fit w-full p-0">
                                <div className="relative object-cover h-64 w-full">
                                    <div className="absolute my-14 mx-12 z-20">
                                        <h1 className="text-3xl font-semibold text-white">{category.title}</h1>
                                        <Button className="border-default-200 bg-transparent hover:bg-default-200 mt-2" variant="outline" asChild>
                                            <Link href={`/shop/${params.shopSlug}/categories/${category.id}`}>Browse</Link>
                                        </Button>
                                    </div>
                                    <div className="relative object-cover h-full w-full">
                                        <Image src={!category.banner_url ? "https://placeholder.co/1027x256" : category.banner_url} alt="Banner for category" className="z-10 top-lef" fill />
                                    </div>
                                </div>
                                <div className="w-full h-fit flex justify-center content-center my-auto">
                                    {products?.filter(product => category.featured_products?.includes(product.id)).map(product => {
                                        return <ProductCard key={product.id} productData={product} />
                                    })}
                                </div>
                                <Separator className="h-[1px] w-full bg-default-100 flex justify-self-center" />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            {collections?.filter(collection => collection.featured == true).map(collection => {
                return (
                    <div key={collection.id} className="flex h-96 w-full mt-2">
                        <div className="flex relative h-full w-96 mx-4 rounded-2xl object-cover overflow-hidden">
                            <Image src={collection.cover_url == null ? "https://placeholder.co/256x256" : collection.cover_url} alt="Cover Image of Collection" fill/>
                            <div className="relative z-10 flex-row my-auto ml-4">
                                <h1 className="text-4xl font-semibold">{`Take a look at our ${collection.title} Projects`}</h1>
                                <Button className="bg-transparent hover:bg-default-100 mt-2 border-default-100" variant="outline" asChild>
                                    <Link href={`/shop/${params.shopSlug}/collections/${collection.id}`}>Shop Now</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-flow-col grid-cols-2 grid-rows-2 h-full w-fit">
                            {products?.filter(product => product.collections?.includes(collection.id)).map(product => (
                                <ProductCard productData={product} key={product.id + "|" + collection.id} />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ShopFrontPage