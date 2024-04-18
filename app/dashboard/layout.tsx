import { Footer } from "@/components/Navigation/Footer";
import SideBar, { ISideBarItemProps } from "@/components/Navigation/SideBar";
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation";

const DashboardLayout = async ({
    children,
} : {
    children: React.ReactNode
}) => {
    const supabase = createClient()
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

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      redirect('/auth/sign-in')
    }

    return (
        <div className="h-screen overflow-y-scroll scrollbar-hide">
            <SideBar MenuItems={sideBarItems} />
            <main className="ml-[230px]">{children}</main>
        </div>
    )
}

export default DashboardLayout