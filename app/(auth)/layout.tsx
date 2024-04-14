import { Footer } from "@/components/Navigation/Footer";
import NavBar from "@/components/Navigation/NavBar";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs"

const AuthLayout = async ({
    children,
} : {
    children: React.ReactNode
}) => {
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="flex h-screen overflow-y-scroll scrollbar-hide justify-center items-center">
            {children}
        </div>
    )
}

export default AuthLayout