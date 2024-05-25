import { Footer } from "@/components/Navigation/Footer";
import SideBar, { ISideBarItemProps } from "@/components/Navigation/SideBar";
import { SelectStore } from "@/components/Select-Store";
import { createClient } from "@/lib/supabase/server"
import { UserResponse } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
const ShopDashboardLayout = async ({
    children,
    params
} : {
    children: React.ReactNode,
    params: {shopId: string}
}) => {
    const supabase = createClient()
    const {data: userData, error: userError} = await supabase.auth.getUser()
    let hasAccessToShop: boolean = false
    const sideBarItems: ISideBarItemProps[] = [
        {
            title: "Home",
            path: `/dashboard/${params.shopId}`,
            icon: "Home"
        },
        {
            title: "Analytics",
            path: `/dashboard/${params.shopId}/analytics`,
            icon: "BarChart3"
        },
        {
            title: "Products",
            path: `/dashboard/${params.shopId}/products`,
            icon: "Package"
        },
        {
            title: "Categories",
            path: `/dashboard/${params.shopId}/categories`,
            icon: "Folder"
        },
        {
            title: "Collections",
            path: `/dashboard/${params.shopId}/collections`,
            icon: "LibraryBig"
        }
    ]

    if (userError || !userData.user) {
        redirect('/auth/sign-in')
    }

    let { data: storeIds, error } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', userData.user.id)

    storeIds?.forEach((storeId: any) => {
        if (storeId.id == params.shopId) hasAccessToShop = true
    });

    if (hasAccessToShop == false) {
        redirect("/dashboard")
    }

    return (
        <div className="h-screen overflow-y-scroll scrollbar-hide">
            <SideBar MenuItems={sideBarItems} />
            <main className="sm:ml-[100px] md:ml-[230px]">{children}</main>
        </div>
    )
}

export default ShopDashboardLayout