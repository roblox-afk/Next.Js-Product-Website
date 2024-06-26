import { Footer } from "@/components/Navigation/Footer";
import NavBar from "@/components/Navigation/NavBar";
import { createClient } from "@/lib/supabase/server";

const MainLayout = async ({
    children,
} : {
    children: React.ReactNode
}) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="h-screen overflow-y-scroll scrollbar-hide">
            <div className="top-0 w-[100%] h-16">
                <NavBar loggedIn={user == null ? false : true } />
            </div>
            {children}
        </div>
    )
}

export default MainLayout