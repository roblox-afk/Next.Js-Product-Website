"use client"
import { StoreCategory, StoreCollection, storeData, StoreProduct } from "@/Actions/store"
import dynamic from "next/dynamic"
import { LockedShop } from "../Locked"

const NoSSR = dynamic(() => import('@/components/Navigation/shop/modern/shopModernNavbar'), { ssr: false })

function ModernShopLayout({ children, storeData, categories, collections, products } : { children: React.ReactNode, storeData: storeData, categories: StoreCategory[] | null, collections: StoreCollection[], products: StoreProduct[] | null }) {
    const localPass = localStorage.getItem("key") || ""
    console.log(storeData)
    console.log(localPass)
    if (storeData.published == false && localPass !== storeData.password) return <LockedShop />
    return (
        <div className="h-screen scrollbar-hide">
            <div className="h-20 w-full top-0 overflow-hidden z-10">
                <NoSSR data={storeData} categories={categories} collections={collections} products={products} />
            </div>
            <main className="overflow-clip h-full">
                {children}
            </main>
        </div>
    )
}

export default ModernShopLayout