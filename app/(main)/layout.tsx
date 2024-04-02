import { Footer } from "@/components/Navigation/Footer";
import NavBar from "@/components/Navigation/NavBar";

const MainLayout = ({
    children,
} : {
    children: React.ReactNode
}) => {
    return (
        <div className="h-screen overflow-y-scroll scrollbar-hide">
            <div className="top-0 w-[100%] h-16">
                <NavBar />
            </div>
            {children}
            <div className="w-[100%] h-36 ">
                <Footer />
            </div>
        </div>
    )
}

export default MainLayout