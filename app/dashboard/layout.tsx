"use client"
import { Footer } from "@/components/Navigation/Footer";
import SideBar, { ISideBarItemProps } from "@/components/Navigation/SideBar";
import { SelectStore } from "@/components/Select-Store";
import { createClient } from "@/lib/supabase/client"
import { UserResponse } from "@supabase/supabase-js";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DashboardLayout = ({
    children
} : {
    children: React.ReactNode
}) => {
    const supabase = createClient()
    const searchParams = useSearchParams()
    const router = useRouter()
    const sideBarItems: ISideBarItemProps[] = [
        {
            title: "Home",
            path: "/dashboard",
            icon: "Home"
        },
        {
            title: "Analytics",
            path: "/dashboard/analytics",
            icon: "BarChart3"
        },

    ]

    useEffect(() => {
        async function fetchUser() {
            const {data, error} = await supabase.auth.getUser()
            if (error || !data.user) {
                redirect('/auth/sign-in')
            }
        }
        async function hasAccess() {
            const searchParamId = searchParams.get("id")
            let access = false
            let { data: storeIds, error } = await supabase
                .from('stores')
                .select('id')

            if (searchParamId == null) return null

            storeIds?.forEach((x: any) => {
                if (x.id == searchParamId) access = true
            });

            if (access == false) {
                router.push("/dashboard")
            }
            return access
        }
        fetchUser()
        hasAccess()
    }, [supabase, router, searchParams])

    if(searchParams.get("id") == null) {
        return (
            <SelectStore />
        )
    }

    return (
        <div className="h-screen overflow-y-scroll scrollbar-hide">
            <SideBar MenuItems={sideBarItems} />
            <main className="sm:ml-[100px] md:ml-[230px]">{children}</main>
        </div>
    )
}

export default DashboardLayout