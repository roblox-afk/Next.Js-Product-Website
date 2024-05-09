import { Footer } from "@/components/Navigation/Footer";
import SideBar, { ISideBarItemProps } from "@/components/Navigation/SideBar";
import { SelectStore } from "@/components/Select-Store";
import { createClient } from "@/lib/supabase/server"
import { UserResponse } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const DashboardLayout = async ({
    children,
} : {
    children: React.ReactNode
}) => {
    const supabase = createClient()
    const {data: userData, error: userError} = await supabase.auth.getUser()

    if (userError || !userData.user) {
        redirect('/auth/sign-in')
    }

    return (
        <>
            {children}
        </>
    )

}

export default DashboardLayout