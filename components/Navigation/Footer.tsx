"use client"

import { Divider, Listbox, ListboxItem } from "@nextui-org/react"

export function Footer() {

    return (
        <div className="w-full h-[200px] bottom-0">
            <Divider />
            <div className="my-2 text-center">
                <Listbox className="ml-[300px] w-[20%] " >
                    <ListboxItem key="pages" className="font-bold w-[100px]" isDisabled >
                        Pages
                    </ListboxItem>
                    <ListboxItem key="dashboard" className="w-[100px]" >
                        DashBoard
                    </ListboxItem>
                    <ListboxItem key="products" className="w-[100px]" >
                        Products
                    </ListboxItem>
                </Listbox>
            </div>
            <Divider className="" />
            <p className="text-center bottom-2 w-full">©COMIFY, All Rights Reserved</p>
        </div>
    )
}