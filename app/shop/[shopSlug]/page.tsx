import { findStoreWithSlug } from "@/Actions/store";
import { DefaultShopLayout } from "@/components/Shop/layouts/default";
import { ModernShopLayout } from "@/components/Shop/layouts/modern";
import { redirect } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

async function handleVisit(id:string) {

}

const ShopPage = ({ params } : { params: {shopSlug: string} }) => {
    const layout = "default"
    const store = findStoreWithSlug(params.shopSlug)

    console.log(store)

    return (
        <h1></h1>
    )
}
export default ShopPage;