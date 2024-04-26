import { StoreCategory, StoreCollection, storeData, StoreProduct } from "@/Actions/store";
import { ModernShopLayout } from "@/components/Shop/layouts/modern";
import { LockedShop } from "@/components/Shop/Locked";
import { createClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation";

const ShopLayout = async({
    children,
    params
} : {
    children: React.ReactNode,
    params: {shopSlug: string}
}) => {
    const supabase = createClient()
    const layout = "default"
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

    if (storeData.published) {
        return (
            <ModernShopLayout storeData={storeData} categories={storeCategories} collections={storeCollections} products={storeProducts}>{children}</ModernShopLayout>
        )
    } else {
        return <LockedShop />
    }
}

export default ShopLayout