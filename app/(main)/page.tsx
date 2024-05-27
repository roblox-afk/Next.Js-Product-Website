import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {Divider, ScrollShadow} from "@nextui-org/react"
import Image from "next/image";

const Main = () => {
    return (
        <ScrollShadow hideScrollBar className="w-[100%]">
            <div className="h-96 text-center content-center bt-10">
                <h1 className="font-semibold text-2xl">
                    Making Commerce Better for Everyone
                </h1>
                <p className="mx-[10%] font-sans">
                    Comify is supporting the next generation of entrepreneurs, the world’s biggest brands, and everyone in between
                </p>
                <Button variant="outline" className="my-4 border-default-300 hover:bg-default-300">Join Now</Button>
            </div>
            <Divider />
            <div className="relative h-60 flex flex-row gap-4 content-center bt-10 text-left">
                <div className="relative h-full w-60 object-cover overflow-hidden rounded-r-2xl">
                    <Image fill alt="Hero Image" src="https://cdn.shopify.com/shopifycloud/brochure/assets/home/redesign2022/marketing3-small-6582aefc08f96962465ba3e4579af9e7c1fd338571c1ac96de8999feb106c05f.png" />
                </div>
                <h1 className="flex right-0 w-96 font-semibold mr-4 text-4xl">
                    Discover why millions of entrepreneurs choose Comify to build their business - from hello world to IPO
                </h1>
                <ul className="absolute right-10 text-2xl">
                    <li></li>
                    <li className="m-2 bg-default-50 rounded-2xl h-12 w-fit p-2 content-center"><strong>Millions</strong> of merchants worldwide</li>
                    <li className="m-2 bg-default-50 rounded-2xl h-12 w-fit p-2 content-center"><strong>10%</strong> of total US ecommerce</li>
                    <li className="m-2 bg-default-50 rounded-2xl h-12 w-fit p-2 content-center"><strong>170+</strong> countries represented</li>
                    <li className="m-2 bg-default-50 rounded-2xl h-12 w-fit p-2 content-center"><strong>$444B</strong> global economic activity</li>
                </ul>
            </div>
            <Divider />
        </ScrollShadow>
    )
}
export default Main;