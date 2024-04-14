import { Footer } from "@/components/Navigation/Footer";
import NavBar from "@/components/Navigation/NavBar";
import SideBar from "@/components/Navigation/SideBar";
import { currentUser } from "@clerk/nextjs"

const DashboardLayout = async ({
    children,
} : {
    children: React.ReactNode
}) => {
    const user = await currentUser()

    return (
        <div className="h-screen overflow-y-scroll scrollbar-hide">
            <SideBar />
            <main className="ml-[230px]">{children}</main>
        </div>
    )
}

export default DashboardLayout