import { Footer } from "@/components/Navigation/Footer";
import NavBar from "@/components/Navigation/NavBar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const SettingsLayout = async ({
    children,
} : {
    children: React.ReactNode
}) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user != null) {
        redirect("/403")
    }

    return (
        <div className="flex h-screen overflow-y-scroll scrollbar-hide justify-center items-center">
            {children}
        </div>
    )
}

export default SettingsLayout