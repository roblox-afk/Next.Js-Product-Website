import CartProductCard from "@/components/Cards/Shop/CartProductCard"
import ProductsList from "./productsList"
import { createClient } from "@/lib/supabase/client"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import CheckoutInfo from "./checkoutInfo"

const NoSSR = dynamic(() => import('./productsList'), { ssr: false })
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
                <NoSSR productsData={productsData} />
            </div>
            <NoSSRCheckoutInfo />
        </div>
    )
}

export default ShopCartPage