import { createClient } from "@/lib/supabase/server";
import ShopDashboardContent from "./content";

export default async function ShopDashboard({
    params
}: {
    params: {shopId: string}
}) {
    const supabase = createClient()
    const {data: shopData} = await supabase
        .from('stores')
        .select('*')
        .eq('id', params.shopId)
        .single()
    if (shopData == null) return
    return (
        <ShopDashboardContent params={params} shopData={shopData} />
    );
}
