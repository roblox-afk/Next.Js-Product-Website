"use client"
import { StoreCategory, StoreCollection, storeData, StoreProduct } from "@/Actions/store"
import { ModernShopNavBar } from "@/components/Navigation/shop/modern/shopModernNavbar"

export function ModernShopLayout({ children, storeData, categories, collections, products } : { children: React.ReactNode, storeData: storeData, categories: StoreCategory[] | null, collections: StoreCollection[], products: StoreProduct[] | null }) {

    return (
        <div className="h-screen overflow-y-scroll scrollbar-hide">
            <div className="h-20 w-full top-0">
                <ModernShopNavBar data={storeData} categories={categories} collections={collections} products={products} />
            </div>
            {children}
        </div>
    )
}