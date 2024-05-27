import { StoreCategory, StoreCollection, storeData, StoreProduct } from "@/Actions/store";
import { LockedShop } from "@/components/Shop/Locked";
import { createClient } from "@/lib/supabase/client"
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const NoSSR = dynamic(() => import('@/components/Shop/layouts/modern'), { ssr: false })

const ShopLayout = async({
    children,
    params
} : {
    children: React.ReactNode,
    params: {shopSlug: string}
}) => {
    const supabase = createClient()
    //const localStoragePass = getLocalStoragePass()
    const { data: storeData, error: storeError } : {data: storeData | null, error: any} = await supabase
        .from('stores')
        .select('*')
        .eq('slug', params.shopSlug)
        .single()

    if (storeData == null) redirect("/")

    const { data: storeCategories } : {data: StoreCategory[] | null, error: any} = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeData?.id)

    const { data: storeCollections } : {data: StoreCollection[] | null, error: any} = await supabase
        .from('collections')
        .select('*')
        .eq('store_id', storeData?.id)

    const { data: storeProducts } : {data: StoreProduct[] | null, error: any} = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData?.id)

    if (storeCollections == null) return redirect("/")

    return (
        <NoSSR storeData={storeData} categories={storeCategories} collections={storeCollections} products={storeProducts}>{children}</NoSSR>
    )
}

export default ShopLayout