"use client"
import { StoreCategory, StoreCollection, storeData, StoreProduct } from "@/Actions/store"
import dynamic from "next/dynamic"

const NoSSR = dynamic(() => import('@/components/Navigation/shop/modern/shopModernNavbar'), { ssr: false })

export function ModernShopLayout({ children, storeData, categories, collections, products } : { children: React.ReactNode, storeData: storeData, categories: StoreCategory[] | null, collections: StoreCollection[], products: StoreProduct[] | null }) {

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-20 w-full top-0 overflow-hidden z-10">
                <NoSSR data={storeData} categories={categories} collections={collections} products={products} />
            </div>
            <main className="overflow-clip h-full">
                {children}
            </main>
        </div>
    )
}