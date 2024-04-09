import { Footer } from "@/components/Navigation/Footer";
import NavBar from "@/components/Navigation/NavBar";
import { currentUser } from "@clerk/nextjs"

const MainLayout = async ({
    children,
} : {
    children: React.ReactNode
}) => {
    const user = await currentUser()

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