import { Footer } from "@/components/Navigation/Footer";
import NavBar from "@/components/Navigation/NavBar";
import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs"

const MainLayout = async ({
    children,
} : {
    children: React.ReactNode
}) => {
    const { data: { user } } = await supabase.auth.getUser()
    console.log(user)

    return (
        <div className="h-screen overflow-y-scroll scrollbar-hide">
            <div className="top-0 w-[100%] h-16">
                <NavBar loggedIn={user ? true : false} />
            </div>
            {children}
            <div className="w-[100%] h-36 ">
                <Footer />
            </div>
        </div>
    )
}

export default MainLayout