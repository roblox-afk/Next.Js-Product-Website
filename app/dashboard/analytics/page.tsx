import {Button, Divider, ScrollShadow} from "@nextui-org/react"

const testProductSales = [
    {
        name: "IPhone 11",
        value: 9800,
    },
    {
        name: "IPhone X",
        value: 4000,
    },
    {
        name: "IPhone 14",
        value: 11000,
    },
    {
        name: "IPhone 14 Pro Max",
        value: 14000,
    },
]

const DashboardAnalytics = () => {

    return (
        <ScrollShadow hideScrollBar className="w-[100%] flex justify-center" orientation="vertical">
            <div className="w-full my-5 ml-5 mr-5 flex justify-center">
                <div className="w-44 h-44 bg-neutral-900 rounded-md shadow shadow-neutral-900">
                    
                </div>
            </div>
        </ScrollShadow>
    )
}

export default DashboardAnalytics