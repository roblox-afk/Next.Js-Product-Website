"use client"
import { StoreCategory, StoreCollection, storeData, StoreProduct } from "@/Actions/store"
import { ModernShopNavBar } from "@/components/Navigation/shop/modern/shopModernNavbar"

export async function ModernShopLayout({ children, storeData, categories, collections, products } : { children: React.ReactNode, storeData: storeData, categories: StoreCategory[] | null, collections: StoreCollection[], products: StoreProduct[] | null }) {

    return (
        <div className="h-screen w-full bg-slate-500">
            <ModernShopNavBar data={storeData} categories={categories} collections={collections} products={products} />
            <main>{children}</main>
        </div>
    )
}