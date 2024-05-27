import CartProductCard from "@/components/Cards/Shop/CartProductCard"
import ProductsList from "./productsList"
import { createClient } from "@/lib/supabase/server"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import CheckoutInfo from "./checkoutInfo"
import { Separator } from "@/components/ui/separator"

const NoSSRProductList = dynamic(() => import('./productsList'), { ssr: false })
const NoSSRCheckoutInfo = dynamic(() => import('./checkoutInfo'), { ssr: false })

const ShopCartPage = async ({params}: {params: {shopSlug: string}}) => {
    const supabase = createClient()
    const {data: storeData} = await supabase
        .from('stores')
        .select('id')
        .eq('slug', params.shopSlug)
        .single()
    if (storeData == null) return
    const {data: productsData, error} = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id)
    if (productsData == null) return
    return (
        <div className="flex flex-col h-full">
            <div className="w-full h-3/4 flex justify-center">
                <NoSSRProductList productsData={productsData} />
            </div>
            <Separator className="h-[1px] w-full mx-2 bg-divider my-10" />
            <NoSSRCheckoutInfo />
        </div>
    )
}

export default ShopCartPage